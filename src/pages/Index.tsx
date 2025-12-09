import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
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
