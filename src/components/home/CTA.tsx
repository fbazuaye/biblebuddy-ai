import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="glass-card mx-auto max-w-3xl p-10 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Ready to Transform Your Bible Study?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join thousands of believers who have discovered a new way to engage
            with Scripture
          </p>
          <div className="mt-8">
            <Button size="lg" className="px-8" asChild>
              <Link to="/auth?mode=signup">Start Your Journey</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
