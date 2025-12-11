-- Create prayer_journals table
CREATE TABLE public.prayer_journals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  prayer_type TEXT DEFAULT 'general',
  is_answered BOOLEAN DEFAULT false,
  answered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create study_sessions table
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  scripture_reference TEXT,
  notes TEXT,
  duration_minutes INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create milestones table (shared milestone definitions)
CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'trophy',
  requirement_type TEXT NOT NULL,
  requirement_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_milestones table (earned milestones)
CREATE TABLE public.user_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES public.milestones(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, milestone_id)
);

-- Enable RLS on all tables
ALTER TABLE public.prayer_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_milestones ENABLE ROW LEVEL SECURITY;

-- Prayer journals policies
CREATE POLICY "Users can view their own prayer journals"
ON public.prayer_journals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prayer journals"
ON public.prayer_journals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer journals"
ON public.prayer_journals FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayer journals"
ON public.prayer_journals FOR DELETE
USING (auth.uid() = user_id);

-- Study sessions policies
CREATE POLICY "Users can view their own study sessions"
ON public.study_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study sessions"
ON public.study_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions"
ON public.study_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sessions"
ON public.study_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Milestones policies (public read)
CREATE POLICY "Anyone can view milestones"
ON public.milestones FOR SELECT
USING (true);

-- User milestones policies
CREATE POLICY "Users can view their own earned milestones"
ON public.user_milestones FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can earn milestones"
ON public.user_milestones FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger for prayer_journals
CREATE TRIGGER update_prayer_journals_updated_at
BEFORE UPDATE ON public.prayer_journals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default milestones
INSERT INTO public.milestones (name, description, icon, requirement_type, requirement_count) VALUES
('First Prayer', 'Write your first prayer journal entry', 'heart', 'prayers', 1),
('Prayer Warrior', 'Write 10 prayer journal entries', 'shield', 'prayers', 10),
('First Study', 'Complete your first Bible study session', 'book-open', 'studies', 1),
('Dedicated Student', 'Complete 10 Bible study sessions', 'graduation-cap', 'studies', 10),
('Scripture Scholar', 'Study for 100 total minutes', 'award', 'study_minutes', 100),
('Answered Prayer', 'Mark your first prayer as answered', 'check-circle', 'answered_prayers', 1);