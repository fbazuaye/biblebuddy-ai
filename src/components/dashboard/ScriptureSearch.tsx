import { useState } from "react";
import { Search, Bookmark, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Verse {
  reference: string;
  text: string;
  explanation: string;
}

const ScriptureSearch = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Verse[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);

    // Simulated search - replace with actual AI integration
    setTimeout(() => {
      setResults([
        {
          reference: "John 3:16",
          text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
          explanation: "This verse captures the essence of God's love and the gift of salvation through Jesus Christ.",
        },
        {
          reference: "Romans 8:28",
          text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
          explanation: "A reminder that God's providence works through all circumstances for believers.",
        },
        {
          reference: "Jeremiah 29:11",
          text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
          explanation: "God's promise of hope and a purposeful future for His people.",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSave = (verse: Verse) => {
    const saved = JSON.parse(localStorage.getItem("savedVerses") || "[]");
    const exists = saved.some((v: Verse) => v.reference === verse.reference);
    
    if (!exists) {
      saved.push({ ...verse, savedAt: new Date().toISOString() });
      localStorage.setItem("savedVerses", JSON.stringify(saved));
      toast({
        title: "Verse saved!",
        description: `${verse.reference} has been added to your collection.`,
      });
    } else {
      toast({
        title: "Already saved",
        description: `${verse.reference} is already in your collection.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="glass-card p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Scripture Search
        </h2>
        <div className="flex gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic (e.g., love, faith, hope, forgiveness...)"
            className="flex-1"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((verse) => (
            <div key={verse.reference} className="glass-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <BookOpen className="h-5 w-5" />
                    {verse.reference}
                  </h3>
                  <p className="mt-2 text-foreground italic">"{verse.text}"</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {verse.explanation}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSave(verse)}
                  className="shrink-0"
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && results.length === 0 && query && (
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground">No results found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
};

export default ScriptureSearch;
