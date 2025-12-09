import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center px-4 pt-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="text-foreground">The Bible, One </span>
          <span className="text-gradient">Conversation</span>
          <br />
          <span className="text-foreground">Away</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Experience AI-powered Bible study with intelligent conversations,
          scripture search, daily devotionals, and personalized spiritual guidance.
        </p>
        <div className="mt-10">
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link to="/auth?mode=signup">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
