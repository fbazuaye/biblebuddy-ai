const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ScriptureChat. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
