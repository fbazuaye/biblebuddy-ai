import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import SEO from "@/components/SEO";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signUp, signIn } = useAuth();
  const isSignUp = searchParams.get("mode") === "signup";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const validateForm = () => {
    try {
      authSchema.parse({ email: formData.email, password: formData.password });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        err.errors.forEach((error) => {
          if (error.path[0] === "email") fieldErrors.email = error.message;
          if (error.path[0] === "password") fieldErrors.password = error.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );
        
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Account created!",
            description: "Welcome to ScriptureChat!",
          });
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Redirecting to dashboard...",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <SEO 
        title={isSignUp ? "Create Account | ScriptureChat" : "Sign In | ScriptureChat"}
        description={isSignUp 
          ? "Create your ScriptureChat account to start your AI-powered Bible study journey with personalized devotionals and scripture insights."
          : "Sign in to your ScriptureChat account to continue your spiritual growth journey with AI-powered Bible study tools."
        }
        canonicalUrl="/auth"
      />
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">ScriptureChat</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isSignUp
              ? "Start your spiritual journey today"
              : "Sign in to continue your journey"}
          </p>
        </div>

        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="pl-10"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Please wait..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {isSignUp ? (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/auth" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/auth?mode=signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
