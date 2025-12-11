import { useState, useEffect } from "react";
import { BookOpen, Plus, Play, Square, Clock, Trash2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface StudySession {
  id: string;
  topic: string;
  scripture_reference: string | null;
  notes: string | null;
  duration_minutes: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

interface StudySessionTrackerProps {
  onUpdate: () => void;
}

const StudySessionTracker = ({ onUpdate }: StudySessionTrackerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [formData, setFormData] = useState({
    topic: "",
    scripture_reference: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession) {
      interval = setInterval(() => {
        const start = new Date(activeSession.started_at).getTime();
        const now = Date.now();
        setElapsedTime(Math.floor((now - start) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const completedSessions = data?.filter((s) => s.completed_at) || [];
      const activeSess = data?.find((s) => !s.completed_at);
      
      setSessions(completedSessions);
      setActiveSession(activeSess || null);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("study_sessions")
        .insert({
          user_id: user.id,
          topic: formData.topic,
          scripture_reference: formData.scripture_reference || null,
          notes: formData.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Study Session Started",
        description: "Your timer is now running. Happy studying!",
      });

      setActiveSession(data);
      setFormData({ topic: "", scripture_reference: "", notes: "" });
      setDialogOpen(false);
    } catch (error) {
      console.error("Error starting session:", error);
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const endSession = async () => {
    if (!activeSession) return;

    const durationMinutes = Math.ceil(elapsedTime / 60);

    try {
      const { error } = await supabase
        .from("study_sessions")
        .update({
          completed_at: new Date().toISOString(),
          duration_minutes: durationMinutes,
        })
        .eq("id", activeSession.id);

      if (error) throw error;

      toast({
        title: "Study Session Complete!",
        description: `Great job! You studied for ${durationMinutes} minutes.`,
      });

      setActiveSession(null);
      setElapsedTime(0);
      fetchSessions();
      onUpdate();
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from("study_sessions")
        .delete()
        .eq("id", sessionId);

      if (error) throw error;

      toast({
        title: "Session Deleted",
        description: "The study session has been removed.",
      });

      fetchSessions();
      onUpdate();
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Study Sessions</h3>
        {!activeSession && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start Study Session</DialogTitle>
              </DialogHeader>
              <form onSubmit={startSession} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                    placeholder="What are you studying?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scripture">Scripture Reference (optional)</Label>
                  <Input
                    id="scripture"
                    value={formData.scripture_reference}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scripture_reference: e.target.value,
                      })
                    }
                    placeholder="e.g., John 3:16"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Any notes for this session..."
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <Play className="h-4 w-4" />
                  Start Session
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Active Session */}
      {activeSession && (
        <div className="glass-card p-6 border-l-4 border-l-primary">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-foreground">
                {activeSession.topic}
              </h4>
              {activeSession.scripture_reference && (
                <p className="text-sm text-muted-foreground">
                  {activeSession.scripture_reference}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-mono font-bold text-primary">
                {formatTime(elapsedTime)}
              </p>
              <p className="text-xs text-muted-foreground">Session in progress</p>
            </div>
          </div>
          <Button
            onClick={endSession}
            variant="destructive"
            className="w-full gap-2"
          >
            <Square className="h-4 w-4" />
            End Session
          </Button>
        </div>
      )}

      {/* Session History */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : sessions.length === 0 && !activeSession ? (
        <div className="glass-card p-8 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Start tracking your Bible study sessions.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="glass-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{session.topic}</h4>
                  {session.scripture_reference && (
                    <p className="text-sm text-primary">
                      {session.scripture_reference}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.duration_minutes} min
                    </span>
                    <span>
                      {format(new Date(session.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSession(session.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudySessionTracker;
