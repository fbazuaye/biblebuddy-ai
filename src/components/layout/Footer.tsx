const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-8">
      <div className="container mx-auto px-4 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Designed by Frank Bazuaye: Powered by LiveGig Ltd
        </p>
        <p className="text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} ScriptureChat. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
