import { useState, useEffect } from "react";
import { Heart, RefreshCw, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Devotional {
  title: string;
  verse: string;
  reference: string;
  reflection: string;
  prayer: string;
}

const DailyDevotional = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [devotional, setDevotional] = useState<Devotional | null>(null);

  const generateDevotional = async () => {
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke("chat-ai", {
        body: {
          messages: [{ role: "user", content: "Generate a daily devotional for spiritual growth and encouragement." }],
          type: "devotional",
        },
      });

      if (response.error) throw response.error;

      const content = response.data?.content;
      if (content) {
        try {
          const parsed = JSON.parse(content);
          setDevotional(parsed);
        } catch {
          toast({
            title: "Error",
            description: "Failed to parse devotional",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Devotional error:", error);
      toast({
        title: "Failed to generate devotional",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateDevotional();
  }, []);

  const handleSave = () => {
    if (!devotional) return;
    
    const saved = JSON.parse(localStorage.getItem("savedDevotionals") || "[]");
    saved.push({ ...devotional, savedAt: new Date().toISOString() });
    localStorage.setItem("savedDevotionals", JSON.stringify(saved));
    toast({
      title: "Devotional saved!",
      description: "Added to your saved devotionals.",
    });
  };

  if (isLoading && !devotional) {
    return (
      <div className="glass-card p-8 text-center">
        <RefreshCw className="h-8 w-8 text-primary mx-auto animate-spin" />
        <p className="mt-4 text-muted-foreground">Generating your devotional...</p>
      </div>
    );
  }

  if (!devotional) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-muted-foreground">Failed to load devotional.</p>
        <Button className="mt-4" onClick={generateDevotional}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Daily Devotional
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={generateDevotional} disabled={isLoading}>
            <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-primary">{devotional.title}</h3>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
          <p className="text-foreground italic">"{devotional.verse}"</p>
          <p className="mt-2 text-sm text-primary font-medium">{devotional.reference}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Reflection
          </h4>
          <p className="text-foreground leading-relaxed">{devotional.reflection}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Prayer
          </h4>
          <p className="text-foreground leading-relaxed italic">{devotional.prayer}</p>
        </div>
      </div>
    </div>
  );
};

export default DailyDevotional;
