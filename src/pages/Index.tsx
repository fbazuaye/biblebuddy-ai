import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "LiveGig Ltd",
  "founder": {
    "@type": "Person",
    "name": "Frank Bazuaye"
  },
  "brand": {
    "@type": "Brand",
    "name": "ScriptureChat"
  }
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="ScriptureChat - The Bible, One Conversation Away"
        description="Experience intelligent Bible study with AI-powered conversations, scripture search, daily devotionals, and personalized spiritual growth tracking. Start your journey today."
        canonicalUrl="/"
        structuredData={organizationSchema}
      />
      <Header />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
