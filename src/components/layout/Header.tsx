import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground">ScriptureChat</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Bible Study</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/auth">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
          <Button asChild>
            <Link to="/auth?mode=signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
