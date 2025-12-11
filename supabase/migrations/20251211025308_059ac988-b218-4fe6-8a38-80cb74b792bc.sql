-- Create study_plans table
CREATE TABLE public.study_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL DEFAULT 7,
  topics TEXT[] NOT NULL DEFAULT '{}',
  daily_readings JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  progress INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own study plans"
ON public.study_plans
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study plans"
ON public.study_plans
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study plans"
ON public.study_plans
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study plans"
ON public.study_plans
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_study_plans_updated_at
BEFORE UPDATE ON public.study_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();