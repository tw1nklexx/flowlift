CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE projects (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL DEFAULT 'My Project',
  api_key     TEXT        NOT NULL UNIQUE,
  plan        TEXT        NOT NULL DEFAULT 'free',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create a project + API key when a user signs up
CREATE OR REPLACE FUNCTION create_project_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO projects (user_id, api_key)
  VALUES (
    NEW.id,
    'proj_' || substr(replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''), 1, 24)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_project_for_user();
