import { BookMarked, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudyPlans = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <BookMarked className="h-5 w-5 text-primary" />
          Study Plans
        </h2>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      <div className="text-center py-12">
        <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          AI-Powered Study Plans
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Enable Lovable Cloud to unlock personalized Bible study plans generated
          by AI based on your interests and spiritual goals.
        </p>
      </div>
    </div>
  );
};

export default StudyPlans;
