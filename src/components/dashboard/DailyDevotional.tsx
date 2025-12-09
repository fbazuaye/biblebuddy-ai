import { useState } from "react";
import { Heart, RefreshCw, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const [devotional, setDevotional] = useState<Devotional>({
    title: "Walking in Faith",
    verse: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
    reflection: "Today's devotional reminds us that true wisdom comes from trusting God completely. When we try to figure everything out on our own, we often miss the path God has prepared for us. But when we surrender our understanding to His wisdom, He guides us with perfect clarity.",
    prayer: "Heavenly Father, help me to trust You more deeply today. When I'm tempted to rely on my own understanding, remind me of Your perfect wisdom and love. Guide my steps and make my paths straight. In Jesus' name, Amen.",
  });

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulated refresh - replace with actual AI integration
    setTimeout(() => {
      setDevotional({
        title: "Finding Peace in His Presence",
        verse: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
        reference: "Isaiah 26:3",
        reflection: "In a world full of anxiety and uncertainty, God offers us something extraordinary - perfect peace. This peace isn't dependent on our circumstances but on where we fix our minds. When we keep our focus on God, trusting in His character and promises, He becomes our anchor in every storm.",
        prayer: "Lord, I choose to fix my mind on You today. When worries try to overwhelm me, help me remember Your faithfulness. Fill me with Your peace that surpasses all understanding. Amen.",
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem("savedDevotionals") || "[]");
    saved.push({ ...devotional, savedAt: new Date().toISOString() });
    localStorage.setItem("savedDevotionals", JSON.stringify(saved));
    toast({
      title: "Devotional saved!",
      description: "Added to your saved devotionals.",
    });
  };

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
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
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
