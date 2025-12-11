import { useState, useEffect } from "react";
import { Heart, Plus, Check, Trash2, Edit2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Prayer {
  id: string;
  title: string;
  content: string;
  prayer_type: string;
  is_answered: boolean;
  answered_at: string | null;
  created_at: string;
}

interface PrayerJournalProps {
  onUpdate: () => void;
}

const PrayerJournal = ({ onUpdate }: PrayerJournalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    prayer_type: "general",
  });

  useEffect(() => {
    if (user) {
      fetchPrayers();
    }
  }, [user]);

  const fetchPrayers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("prayer_journals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrayers(data || []);
    } catch (error) {
      console.error("Error fetching prayers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from("prayer_journals").insert({
        user_id: user.id,
        title: formData.title,
        content: formData.content,
        prayer_type: formData.prayer_type,
      });

      if (error) throw error;

      toast({
        title: "Prayer Added",
        description: "Your prayer has been saved to your journal.",
      });

      setFormData({ title: "", content: "", prayer_type: "general" });
      setDialogOpen(false);
      fetchPrayers();
      onUpdate();
    } catch (error) {
      console.error("Error adding prayer:", error);
      toast({
        title: "Error",
        description: "Failed to save prayer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const markAsAnswered = async (prayerId: string) => {
    try {
      const { error } = await supabase
        .from("prayer_journals")
        .update({
          is_answered: true,
          answered_at: new Date().toISOString(),
        })
        .eq("id", prayerId);

      if (error) throw error;

      toast({
        title: "Prayer Answered!",
        description: "Praise God for answering your prayer!",
      });

      fetchPrayers();
      onUpdate();
    } catch (error) {
      console.error("Error updating prayer:", error);
    }
  };

  const deletePrayer = async (prayerId: string) => {
    try {
      const { error } = await supabase
        .from("prayer_journals")
        .delete()
        .eq("id", prayerId);

      if (error) throw error;

      toast({
        title: "Prayer Deleted",
        description: "The prayer has been removed from your journal.",
      });

      fetchPrayers();
      onUpdate();
    } catch (error) {
      console.error("Error deleting prayer:", error);
    }
  };

  const prayerTypes = [
    { value: "general", label: "General" },
    { value: "thanksgiving", label: "Thanksgiving" },
    { value: "petition", label: "Petition" },
    { value: "intercession", label: "Intercession" },
    { value: "confession", label: "Confession" },
    { value: "praise", label: "Praise" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Prayer Journal</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Prayer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Prayer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Prayer title..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.prayer_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, prayer_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {prayerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Prayer</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Write your prayer..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Save Prayer
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : prayers.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Start your prayer journal by adding your first prayer.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {prayers.map((prayer) => (
            <div
              key={prayer.id}
              className={`glass-card p-4 ${
                prayer.is_answered ? "border-l-4 border-l-green-500" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{prayer.title}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {prayer.prayer_type}
                    </span>
                    {prayer.is_answered && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                        Answered
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {prayer.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(prayer.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!prayer.is_answered && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsAnswered(prayer.id)}
                      title="Mark as answered"
                    >
                      <Check className="h-4 w-4 text-green-400" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePrayer(prayer.id)}
                    title="Delete prayer"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrayerJournal;
