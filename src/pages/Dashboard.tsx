import { useState, useEffect } from "react";
import { BookOpen, MessageSquare, Search, Heart, Bookmark, LogOut, Compass, BookMarked } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import ChatInterface from "@/components/dashboard/ChatInterface";
import ScriptureSearch from "@/components/dashboard/ScriptureSearch";
import DailyDevotional from "@/components/dashboard/DailyDevotional";
import SavedContent from "@/components/dashboard/SavedContent";
import JourneyDashboard from "@/components/dashboard/JourneyDashboard";
import StudyPlans from "@/components/dashboard/StudyPlans";
import SEO from "@/components/SEO";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <SEO 
        title="My Dashboard | ScriptureChat"
        description="Access your personalized Bible study dashboard with AI chat, scripture search, daily devotionals, prayer journal, and spiritual growth tracking."
        canonicalUrl="/dashboard"
      />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground">ScriptureChat</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Bible Study</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 lg:grid-cols-6 glass-card p-1">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </TabsTrigger>
            <TabsTrigger value="devotional" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Devotional</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
            </TabsTrigger>
            <TabsTrigger value="journey" className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              <span className="hidden sm:inline">Journey</span>
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <BookMarked className="h-4 w-4" />
              <span className="hidden sm:inline">Plans</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <ChatInterface />
          </TabsContent>
          <TabsContent value="search">
            <ScriptureSearch />
          </TabsContent>
          <TabsContent value="devotional">
            <DailyDevotional />
          </TabsContent>
          <TabsContent value="saved">
            <SavedContent />
          </TabsContent>
          <TabsContent value="journey">
            <JourneyDashboard />
          </TabsContent>
          <TabsContent value="plans">
            <StudyPlans />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
