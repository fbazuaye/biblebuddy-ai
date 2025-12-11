import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Shield, Lock, Eye, Trash2, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy - ScriptureChat"
        description="Learn how ScriptureChat protects your privacy. We don't sell your data, don't advertise, and keep your spiritual journey private."
        keywords="privacy policy, data protection, scripture chat privacy, bible app privacy"
        canonicalUrl="/privacy"
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Shield className="h-16 w-16 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {/* Introduction */}
            <section className="space-y-4">
              <p className="text-foreground/90 leading-relaxed">
                At ScriptureChat, we are deeply committed to protecting your privacy. Your spiritual journey is personal and sacred, 
                and we believe it should remain that way. This Privacy Policy explains how we collect, use, and safeguard your 
                information when you use our service.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Information We Collect</h2>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Account Information</h3>
                  <p className="text-muted-foreground">
                    When you create an account, we collect your email address and optional profile information 
                    (such as your name) to personalize your experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Usage Data</h3>
                  <p className="text-muted-foreground">
                    We store your chat history, saved scriptures, and study progress to provide continuity 
                    in your spiritual journey and improve our service.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Device Information</h3>
                  <p className="text-muted-foreground">
                    Basic device and browser information is collected solely for app functionality 
                    and to ensure a smooth user experience.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">How We Use Your Information</h2>
              <ul className="space-y-3 text-foreground/90">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>To provide and maintain our Scripture study service</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>To personalize your spiritual journey and provide relevant insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>To save your progress, bookmarks, and preferences</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>To communicate important service updates (only when necessary)</span>
                </li>
              </ul>
            </section>

            {/* Data Storage & Security */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Data Storage & Security</h2>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <p className="text-foreground/90">
                  Your data is stored securely using industry-standard encryption and cloud infrastructure. 
                  We implement appropriate technical and organizational measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p className="text-foreground/90">
                  We do not share your personal data with third parties except as necessary to provide 
                  our service (such as secure cloud hosting providers who are bound by strict data protection agreements).
                </p>
              </div>
            </section>

            {/* No Advertising Policy - Highlighted */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Our No Advertising Promise</h2>
              <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-6 space-y-4">
                <p className="text-foreground font-medium text-lg">
                  We make this commitment to you:
                </p>
                <ul className="space-y-3 text-foreground/90">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span><strong>We do NOT sell your data</strong> – Your information will never be sold to advertisers, 
                    data brokers, or any third parties.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span><strong>We do NOT display targeted advertising</strong> – You will never see ads based on 
                    your spiritual inquiries or personal data.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span><strong>We do NOT share your data for marketing</strong> – Your conversations, saved scriptures, 
                    and spiritual journey remain completely private.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span><strong>We do NOT monetize your spiritual journey</strong> – Your relationship with Scripture 
                    is sacred, not a commodity.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Trash2 className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Your Rights</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-2">Access Your Data</h3>
                  <p className="text-sm text-muted-foreground">
                    You can request a copy of all personal data we hold about you.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-2">Delete Your Data</h3>
                  <p className="text-sm text-muted-foreground">
                    You can request complete deletion of your account and all associated data.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-2">Update Your Information</h3>
                  <p className="text-sm text-muted-foreground">
                    You can modify your profile and account information at any time.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-2">Opt Out</h3>
                  <p className="text-sm text-muted-foreground">
                    You can opt out of non-essential communications at any time.
                  </p>
                </div>
              </div>
            </section>

            {/* Family & Young Users */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Family & Young Users</h2>
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <p className="text-foreground/90">
                  We welcome families exploring Scripture together! For users under 13, we encourage parents 
                  and guardians to guide their child's experience and create accounts on their behalf.
                </p>
                <p className="text-foreground/90">
                  To protect young users, we do not knowingly collect personal information directly from 
                  children under 13 without parental consent. If you're a parent or guardian with questions 
                  about your child's use of ScriptureChat, please reach out – we're here to help ensure 
                  a safe and meaningful experience for your family.
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Changes to This Policy</h2>
              <p className="text-foreground/90">
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date. 
                Significant changes will be communicated via email or a prominent notice on our service.
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-foreground/90 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <p className="text-foreground">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:scripturechat@livegig.com.ng" className="text-primary hover:underline">
                    scripturechat@livegig.com.ng
                  </a>
                </p>
              </div>
            </section>

            {/* Back Link */}
            <div className="pt-8 text-center">
              <Link to="/" className="text-primary hover:underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
