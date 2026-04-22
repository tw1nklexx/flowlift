CREATE TABLE flows (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id       UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name             TEXT        NOT NULL DEFAULT 'Untitled Flow',
  is_active        BOOLEAN     NOT NULL DEFAULT false,
  targeting_rules  JSONB       NOT NULL DEFAULT '{"operator":"AND","conditions":[]}',
  steps            JSONB       NOT NULL DEFAULT '[]',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE flows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own flows" ON flows
  FOR ALL USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Keep updated_at fresh
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER flows_updated_at
  BEFORE UPDATE ON flows
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
