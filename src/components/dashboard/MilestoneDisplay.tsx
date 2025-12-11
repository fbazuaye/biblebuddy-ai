import { useState, useEffect } from "react";
import {
  Trophy,
  Heart,
  Shield,
  BookOpen,
  GraduationCap,
  Award,
  CheckCircle,
  Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Milestone {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  requirement_type: string;
  requirement_count: number;
}

interface UserMilestone {
  milestone_id: string;
  earned_at: string;
}

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  heart: Heart,
  shield: Shield,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  award: Award,
  "check-circle": CheckCircle,
};

const MilestoneDisplay = () => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [earnedMilestones, setEarnedMilestones] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch all milestones
      const { data: milestonesData } = await supabase
        .from("milestones")
        .select("*")
        .order("requirement_count");

      setMilestones(milestonesData || []);

      if (user) {
        // Fetch user's earned milestones
        const { data: userMilestonesData } = await supabase
          .from("user_milestones")
          .select("milestone_id, earned_at")
          .eq("user_id", user.id);

        const earned = new Set(
          userMilestonesData?.map((um) => um.milestone_id) || []
        );
        setEarnedMilestones(earned);

        // Calculate progress for each requirement type
        const [prayersRes, studiesRes, answeredRes, minutesRes] =
          await Promise.all([
            supabase
              .from("prayer_journals")
              .select("*", { count: "exact", head: true })
              .eq("user_id", user.id),
            supabase
              .from("study_sessions")
              .select("*", { count: "exact", head: true })
              .eq("user_id", user.id),
            supabase
              .from("prayer_journals")
              .select("*", { count: "exact", head: true })
              .eq("user_id", user.id)
              .eq("is_answered", true),
            supabase
              .from("study_sessions")
              .select("duration_minutes")
              .eq("user_id", user.id),
          ]);

        const totalMinutes =
          minutesRes.data?.reduce(
            (acc, s) => acc + (s.duration_minutes || 0),
            0
          ) || 0;

        setProgress({
          prayers: prayersRes.count || 0,
          studies: studiesRes.count || 0,
          answered_prayers: answeredRes.count || 0,
          study_minutes: totalMinutes,
        });

        // Check and award new milestones
        await checkAndAwardMilestones(
          milestonesData || [],
          earned,
          {
            prayers: prayersRes.count || 0,
            studies: studiesRes.count || 0,
            answered_prayers: answeredRes.count || 0,
            study_minutes: totalMinutes,
          },
          user.id
        );
      }
    } catch (error) {
      console.error("Error fetching milestones:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndAwardMilestones = async (
    allMilestones: Milestone[],
    alreadyEarned: Set<string>,
    currentProgress: Record<string, number>,
    userId: string
  ) => {
    const toAward: string[] = [];

    for (const milestone of allMilestones) {
      if (alreadyEarned.has(milestone.id)) continue;

      const currentValue = currentProgress[milestone.requirement_type] || 0;
      if (currentValue >= milestone.requirement_count) {
        toAward.push(milestone.id);
      }
    }

    if (toAward.length > 0) {
      const inserts = toAward.map((milestoneId) => ({
        user_id: userId,
        milestone_id: milestoneId,
      }));

      await supabase.from("user_milestones").insert(inserts);

      setEarnedMilestones((prev) => {
        const newSet = new Set(prev);
        toAward.forEach((id) => newSet.add(id));
        return newSet;
      });
    }
  };

  const getProgressPercentage = (milestone: Milestone) => {
    const current = progress[milestone.requirement_type] || 0;
    return Math.min(100, (current / milestone.requirement_count) * 100);
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading milestones...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Milestones & Achievements
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {milestones.map((milestone) => {
          const Icon = iconMap[milestone.icon] || Trophy;
          const isEarned = earnedMilestones.has(milestone.id);
          const progressPct = getProgressPercentage(milestone);

          return (
            <div
              key={milestone.id}
              className={`glass-card p-4 relative overflow-hidden ${
                isEarned
                  ? "border-2 border-primary/50"
                  : "opacity-75"
              }`}
            >
              {/* Progress bar background */}
              {!isEarned && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-primary/30 transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              )}

              <div className="flex items-start gap-3">
                <div
                  className={`rounded-lg p-2 ${
                    isEarned
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isEarned ? (
                    <Icon className="h-6 w-6" />
                  ) : (
                    <Lock className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{milestone.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {milestone.description}
                  </p>
                  {!isEarned && (
                    <p className="text-xs text-primary mt-2">
                      {progress[milestone.requirement_type] || 0} /{" "}
                      {milestone.requirement_count}
                    </p>
                  )}
                </div>
                {isEarned && (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {milestones.length === 0 && (
        <div className="glass-card p-8 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No milestones available yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default MilestoneDisplay;
