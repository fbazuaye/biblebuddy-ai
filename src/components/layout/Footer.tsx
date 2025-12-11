import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-8">
      <div className="container mx-auto px-4 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Designed by Frank Bazuaye: Powered by LiveGig Ltd
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/70">
          <span>© {new Date().getFullYear()} ScriptureChat. All rights reserved.</span>
          <span>•</span>
          <Link to="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-primary transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
