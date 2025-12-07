-- Create storage bucket for course content
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-content', 'course-content', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for course content
CREATE POLICY "Professors can upload course content"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'course-content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view course content"
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-content');

CREATE POLICY "Professors can delete own course content"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'course-content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add RLS policy to allow inserting roles during signup trigger
CREATE POLICY "System can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (true);