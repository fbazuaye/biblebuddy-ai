import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topics, durationDays, spiritualGoals } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating study plan for topics:', topics, 'duration:', durationDays);

    const systemPrompt = `You are a knowledgeable Bible study guide. Create personalized Bible study plans that are spiritually enriching and practically applicable. Your plans should include specific scripture references, reflection questions, and actionable applications.`;

    const userPrompt = `Create a ${durationDays}-day Bible study plan focused on: ${topics.join(', ')}.
${spiritualGoals ? `Spiritual goals: ${spiritualGoals}` : ''}

Return a JSON object with this exact structure:
{
  "title": "A compelling title for the study plan",
  "description": "A 2-3 sentence description of what this study covers",
  "dailyReadings": [
    {
      "day": 1,
      "title": "Day title/theme",
      "scripture": "Book Chapter:Verse-Verse",
      "reflection": "A thought-provoking reflection question",
      "application": "A practical way to apply this teaching today"
    }
  ]
}

Make sure to include exactly ${durationDays} daily readings. Use real Bible references.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('Failed to generate study plan');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    // Extract JSON from the response
    let studyPlan;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        studyPlan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse study plan');
    }

    console.log('Successfully generated study plan:', studyPlan.title);

    return new Response(JSON.stringify(studyPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-study-plan:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
