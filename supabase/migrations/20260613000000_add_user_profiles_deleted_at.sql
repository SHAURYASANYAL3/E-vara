ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT null;
DROP POLICY IF EXISTS "Profile_Isolation" ON user_profiles;
CREATE POLICY "Profile_Isolation" ON user_profiles FOR ALL USING (auth.uid() = id AND deleted_at IS NULL);
