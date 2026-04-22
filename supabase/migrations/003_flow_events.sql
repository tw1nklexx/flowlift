CREATE TABLE flow_events (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id     UUID        NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  project_id  UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  session_id  TEXT        NOT NULL,
  event_type  TEXT        NOT NULL, -- flow_shown | step_advanced | flow_completed | flow_dismissed
  step_index  INTEGER,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE flow_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own flow events" ON flow_events
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Insert is done by Edge Function via service role — no user policy needed
CREATE INDEX flow_events_flow_id_idx ON flow_events(flow_id);
CREATE INDEX flow_events_project_id_idx ON flow_events(project_id);
CREATE INDEX flow_events_created_at_idx ON flow_events(created_at);
