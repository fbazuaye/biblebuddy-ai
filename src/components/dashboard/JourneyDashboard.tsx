import { useState, useEffect } from "react";
import { Flame, Clock, BookOpen, Heart, Trophy, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrayerJournal from "./PrayerJournal";
import StudySessionTracker from "./StudySessionTracker";
import MilestoneDisplay from "./MilestoneDisplay";

interface Stats {
  studyStreak: number;
  weeklyStudyMinutes: number;
  prayersLogged: number;
  studySessions: number;
}

const JourneyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    studyStreak: 0,
    weeklyStudyMinutes: 0,
    prayersLogged: 0,
    studySessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Fetch prayer count
      const { count: prayerCount } = await supabase
        .from("prayer_journals")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Fetch study sessions count
      const { count: studyCount } = await supabase
        .from("study_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Fetch weekly study minutes
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data: weeklyStudies } = await supabase
        .from("study_sessions")
        .select("duration_minutes")
        .eq("user_id", user.id)
        .gte("created_at", weekAgo.toISOString());

      const weeklyMinutes = weeklyStudies?.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) || 0;

      setStats({
        studyStreak: 0, // TODO: Calculate streak logic
        weeklyStudyMinutes: weeklyMinutes,
        prayersLogged: prayerCount || 0,
        studySessions: studyCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Study Streak",
      value: `${stats.studyStreak} days`,
      icon: Flame,
      color: "text-orange-400",
    },
    {
      label: "Weekly Study",
      value: `${stats.weeklyStudyMinutes} min`,
      icon: Clock,
      color: "text-blue-400",
    },
    {
      label: "Prayers Logged",
      value: stats.prayersLogged.toString(),
      icon: Heart,
      color: "text-pink-400",
    },
    {
      label: "Study Sessions",
      value: stats.studySessions.toString(),
      icon: BookOpen,
      color: "text-green-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "..." : stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="prayers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prayers" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Prayer Journal
          </TabsTrigger>
          <TabsTrigger value="studies" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Study Sessions
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Milestones
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="prayers" className="mt-6">
          <PrayerJournal onUpdate={fetchStats} />
        </TabsContent>
        
        <TabsContent value="studies" className="mt-6">
          <StudySessionTracker onUpdate={fetchStats} />
        </TabsContent>
        
        <TabsContent value="milestones" className="mt-6">
          <MilestoneDisplay />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JourneyDashboard;
