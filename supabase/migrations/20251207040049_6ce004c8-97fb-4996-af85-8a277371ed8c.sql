-- Add policy to allow users to update their own role during registration
CREATE POLICY "Users can update own role" 
ON public.user_roles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);