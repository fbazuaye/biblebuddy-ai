import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    let systemPrompt = "";
    
    switch (type) {
      case "chat":
        systemPrompt = `You are a knowledgeable and compassionate AI Bible study companion. Your role is to:
- Help users understand scripture with historical, cultural, and theological context
- Provide thoughtful, biblically-grounded answers to faith questions
- Offer spiritual guidance and encouragement
- Reference specific Bible verses when relevant
- Be warm, patient, and non-judgmental
Keep responses concise but meaningful. When citing scripture, include the book, chapter, and verse.`;
        break;
        
      case "devotional":
        systemPrompt = `You are a devotional writer creating daily spiritual content. Generate a devotional with:
1. A meaningful title
2. A relevant Bible verse with reference
3. A reflection/meditation (2-3 paragraphs)
4. A closing prayer

Format your response as JSON:
{
  "title": "...",
  "verse": "...",
  "reference": "...",
  "reflection": "...",
  "prayer": "..."
}`;
        break;
        
      case "search":
        systemPrompt = `You are a Bible verse finder. When given a topic or theme, find 3-5 relevant Bible verses.

Format your response as JSON array:
[
  {
    "reference": "Book Chapter:Verse",
    "text": "The verse text",
    "explanation": "Brief explanation of relevance"
  }
]

Only respond with valid JSON, no other text.`;
        break;
        
      default:
        systemPrompt = "You are a helpful Bible study assistant.";
    }

    console.log(`Processing ${type} request with ${messages.length} messages`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: type === "chat",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    if (type === "chat") {
      // Stream response for chat
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    } else {
      // Non-streaming for devotional/search
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      console.log(`${type} response received:`, content?.substring(0, 100));
      
      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in chat-ai function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
