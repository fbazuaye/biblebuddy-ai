import { useState, useEffect } from "react";
import { Bookmark, Trash2, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface SavedVerse {
  reference: string;
  text: string;
  explanation: string;
  savedAt: string;
}

interface SavedDevotional {
  title: string;
  verse: string;
  reference: string;
  reflection: string;
  prayer: string;
  savedAt: string;
}

const SavedContent = () => {
  const { toast } = useToast();
  const [verses, setVerses] = useState<SavedVerse[]>([]);
  const [devotionals, setDevotionals] = useState<SavedDevotional[]>([]);

  useEffect(() => {
    const savedVerses = JSON.parse(localStorage.getItem("savedVerses") || "[]");
    const savedDevotionals = JSON.parse(localStorage.getItem("savedDevotionals") || "[]");
    setVerses(savedVerses);
    setDevotionals(savedDevotionals);
  }, []);

  const deleteVerse = (reference: string) => {
    const updated = verses.filter((v) => v.reference !== reference);
    setVerses(updated);
    localStorage.setItem("savedVerses", JSON.stringify(updated));
    toast({ title: "Verse removed" });
  };

  const deleteDevotional = (index: number) => {
    const updated = devotionals.filter((_, i) => i !== index);
    setDevotionals(updated);
    localStorage.setItem("savedDevotionals", JSON.stringify(updated));
    toast({ title: "Devotional removed" });
  };

  return (
    <div className="glass-card p-6">
      <h2 className="mb-6 text-xl font-semibold text-foreground flex items-center gap-2">
        <Bookmark className="h-5 w-5 text-primary" />
        Saved Content
      </h2>

      <Tabs defaultValue="verses">
        <TabsList className="mb-4">
          <TabsTrigger value="verses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Verses ({verses.length})
          </TabsTrigger>
          <TabsTrigger value="devotionals" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Devotionals ({devotionals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="verses" className="space-y-4">
          {verses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No saved verses yet. Search for verses and save your favorites!
            </p>
          ) : (
            verses.map((verse) => (
              <div key={verse.reference} className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-primary">{verse.reference}</h3>
                    <p className="mt-1 text-foreground italic text-sm">"{verse.text}"</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Saved {new Date(verse.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteVerse(verse.reference)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="devotionals" className="space-y-4">
          {devotionals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No saved devotionals yet. Save your favorite daily devotionals!
            </p>
          ) : (
            devotionals.map((devotional, index) => (
              <div key={index} className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-primary">{devotional.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{devotional.reference}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Saved {new Date(devotional.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteDevotional(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavedContent;
