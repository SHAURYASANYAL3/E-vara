-- Create the roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user'))
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create helper function for policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Apply basic RLS policy for the roles table
CREATE POLICY "Admins can view roles" ON public.user_roles 
FOR SELECT USING (public.is_admin());