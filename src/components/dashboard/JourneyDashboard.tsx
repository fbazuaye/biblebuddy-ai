import { Flame, Clock, BookOpen, Heart } from "lucide-react";

const stats = [
  {
    label: "Study Streak",
    value: "0 days",
    icon: Flame,
    color: "text-orange-400",
  },
  {
    label: "Weekly Study",
    value: "0 min",
    icon: Clock,
    color: "text-blue-400",
  },
  {
    label: "Prayers Logged",
    value: "0",
    icon: Heart,
    color: "text-pink-400",
  },
  {
    label: "Verses This Week",
    value: "0",
    icon: BookOpen,
    color: "text-green-400",
  },
];

const JourneyDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="glass-card p-8 text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Spiritual Journey Tracking
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Enable Lovable Cloud to unlock prayer journals, study session tracking,
          AI-powered growth insights, and milestone achievements.
        </p>
      </div>
    </div>
  );
};

export default JourneyDashboard;
