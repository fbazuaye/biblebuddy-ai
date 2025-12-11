import { useState, useEffect } from "react";
import { BookMarked, Plus, Calendar, ChevronRight, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface DailyReading {
  day: number;
  title: string;
  scripture: string;
  reflection: string;
  application: string;
}

interface StudyPlan {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  topics: string[];
  daily_readings: DailyReading[];
  progress: number;
  is_active: boolean;
  created_at: string;
}

const TOPIC_OPTIONS = [
  "Faith & Trust",
  "Prayer",
  "Love & Relationships",
  "Forgiveness",
  "Wisdom",
  "Courage",
  "Gratitude",
  "Peace",
  "Hope",
  "Spiritual Growth"
];

const StudyPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [duration, setDuration] = useState("7");
  const [spiritualGoals, setSpiritualGoals] = useState("");

  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPlans((data || []).map(plan => ({
        ...plan,
        daily_readings: plan.daily_readings as unknown as DailyReading[]
      })));
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const generatePlan = async () => {
    if (selectedTopics.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-study-plan', {
        body: {
          topics: selectedTopics,
          durationDays: parseInt(duration),
          spiritualGoals
        }
      });

      if (error) throw error;

      // Save to database
      const { data: savedPlan, error: saveError } = await supabase
        .from('study_plans')
        .insert({
          user_id: user!.id,
          title: data.title,
          description: data.description,
          duration_days: parseInt(duration),
          topics: selectedTopics,
          daily_readings: data.dailyReadings,
          progress: 0,
          is_active: true
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setPlans(prev => [{
        ...savedPlan,
        daily_readings: savedPlan.daily_readings as unknown as DailyReading[]
      }, ...prev]);
      
      setDialogOpen(false);
      setSelectedTopics([]);
      setSpiritualGoals("");
      toast.success("Study plan created!");
    } catch (error: any) {
      console.error('Error generating plan:', error);
      toast.error(error.message || "Failed to generate study plan");
    } finally {
      setGenerating(false);
    }
  };

  const deletePlan = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('study_plans')
        .delete()
        .eq('id', planId);
      
      if (error) throw error;
      
      setPlans(prev => prev.filter(p => p.id !== planId));
      setSelectedPlan(null);
      toast.success("Plan deleted");
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error("Failed to delete plan");
    }
  };

  const updateProgress = async (planId: string, newProgress: number) => {
    try {
      const { error } = await supabase
        .from('study_plans')
        .update({ progress: newProgress })
        .eq('id', planId);
      
      if (error) throw error;
      
      setPlans(prev => prev.map(p => 
        p.id === planId ? { ...p, progress: newProgress } : p
      ));
      if (selectedPlan?.id === planId) {
        setSelectedPlan(prev => prev ? { ...prev, progress: newProgress } : null);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (selectedPlan) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setSelectedPlan(null)}>
            ← Back to Plans
          </Button>
          <Button variant="destructive" size="sm" onClick={() => deletePlan(selectedPlan.id)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-2">{selectedPlan.title}</h2>
        <p className="text-muted-foreground mb-4">{selectedPlan.description}</p>
        
        <div className="flex items-center gap-4 mb-6">
          <Badge variant="secondary">{selectedPlan.duration_days} days</Badge>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{selectedPlan.progress}/{selectedPlan.duration_days} days</span>
            </div>
            <Progress value={(selectedPlan.progress / selectedPlan.duration_days) * 100} />
          </div>
        </div>

        <div className="space-y-4">
          {selectedPlan.daily_readings.map((reading, index) => (
            <div 
              key={reading.day}
              className={`p-4 rounded-lg border ${index < selectedPlan.progress ? 'bg-primary/10 border-primary/30' : 'bg-muted/50 border-border'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Day {reading.day}: {reading.title}</h3>
                {index < selectedPlan.progress ? (
                  <Badge variant="default">Completed</Badge>
                ) : index === selectedPlan.progress ? (
                  <Button size="sm" onClick={() => updateProgress(selectedPlan.id, index + 1)}>
                    Mark Complete
                  </Button>
                ) : null}
              </div>
              <p className="text-sm text-primary font-medium mb-2">📖 {reading.scripture}</p>
              <p className="text-sm text-muted-foreground mb-2"><strong>Reflect:</strong> {reading.reflection}</p>
              <p className="text-sm text-muted-foreground"><strong>Apply:</strong> {reading.application}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <BookMarked className="h-5 w-5 text-primary" />
          Study Plans
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create AI Study Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Select Topics</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {TOPIC_OPTIONS.map(topic => (
                    <Badge
                      key={topic}
                      variant={selectedTopics.includes(topic) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTopic(topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="21">21 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Spiritual Goals (optional)</Label>
                <Textarea
                  placeholder="E.g., I want to grow in my prayer life, understand God's love better..."
                  value={spiritualGoals}
                  onChange={(e) => setSpiritualGoals(e.target.value)}
                />
              </div>
              <Button onClick={generatePlan} disabled={generating || selectedTopics.length === 0} className="w-full">
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Study Plan'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-12">
          <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Study Plans Yet
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Create your first AI-powered Bible study plan based on your interests and spiritual goals.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map(plan => (
            <div
              key={plan.id}
              className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{plan.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{plan.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {plan.duration_days} days
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {plan.progress}/{plan.duration_days} completed
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <Progress value={(plan.progress / plan.duration_days) * 100} className="mt-3" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyPlans;
