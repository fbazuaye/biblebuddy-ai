import { MessageSquare, Search, Heart, Bookmark } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Chat",
    description: "Have meaningful conversations about scripture with our AI assistant",
  },
  {
    icon: Search,
    title: "Scripture Search",
    description: "Find relevant verses and passages with intelligent search",
  },
  {
    icon: Heart,
    title: "Daily Devotionals",
    description: "Receive personalized devotional content for your spiritual journey",
  },
  {
    icon: Bookmark,
    title: "Save Verses",
    description: "Keep track of meaningful verses and build your personal collection",
  },
];

const Features = () => {
  return (
    <section 
      id="features" 
      aria-labelledby="features-heading" 
      className="py-20 px-4"
    >
      <div className="container mx-auto">
        <h2 
          id="features-heading" 
          className="text-3xl font-bold text-center text-foreground mb-12"
        >
          Our Features
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="glass-card p-6 text-center transition-all hover:scale-105 hover:border-primary/50"
              aria-label={feature.title}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-7 w-7 text-primary" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
