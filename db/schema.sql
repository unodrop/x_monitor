-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Notification configs table (grouped configurations)
CREATE TABLE IF NOT EXISTS notification_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel_type TEXT NOT NULL CHECK (channel_type IN ('telegram', 'discord', 'dingtalk', 'feishu', 'webhook')),
  webhook_url TEXT,
  config_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Monitor targets table
CREATE TABLE IF NOT EXISTS monitor_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  x_handle TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  -- Reference to notification config group
  notification_config_id UUID REFERENCES notification_configs(id) ON DELETE SET NULL,
  -- Track last processed tweet ID to avoid duplicate notifications
  last_tweet_id TEXT,
  -- Twitter/X user rest_id from API
  rest_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_monitor_targets_user_id ON monitor_targets(user_id);
CREATE INDEX IF NOT EXISTS idx_monitor_targets_notification_config_id ON monitor_targets(notification_config_id);
CREATE INDEX IF NOT EXISTS idx_notification_configs_user_id ON notification_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Disable RLS for users table (since we're using service role key)
-- Or enable RLS and create policies if you want row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything (bypass RLS)
-- Note: Service role key already bypasses RLS, but this ensures policies don't interfere
CREATE POLICY IF NOT EXISTS "Service role can do everything on users"
  ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Similar policies for other tables
ALTER TABLE monitor_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Service role can do everything on monitor_targets"
  ON monitor_targets
  FOR ALL
  USING (true)
  WITH CHECK (true);

ALTER TABLE notification_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Service role can do everything on notification_configs"
  ON notification_configs
  FOR ALL
  USING (true)
  WITH CHECK (true);

