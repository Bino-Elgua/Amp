-- Whale Tracker Database Schema

-- Users table (tracks subscriptions and premium status)
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  discord_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255),
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Whale alerts log (tracks all alerts sent)
CREATE TABLE IF NOT EXISTS alerts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tx_hash VARCHAR(255) UNIQUE NOT NULL,
  value_usd DECIMAL(20, 2),
  from_address VARCHAR(255),
  to_address VARCHAR(255),
  eth_price DECIMAL(15, 2),
  block_number BIGINT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Alert log for daily limits (free tier: 5/day)
CREATE TABLE IF NOT EXISTS alert_log (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  discord_id VARCHAR(255) NOT NULL,
  tx_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transaction log (tracks alerts per guild for analytics)
CREATE TABLE IF NOT EXISTS transaction_log (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  guild_id VARCHAR(255),
  tx_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions (for tracking active Stripe subscriptions)
CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  guild_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_id VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Custom thresholds per user (premium feature)
CREATE TABLE IF NOT EXISTS custom_thresholds (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  discord_id VARCHAR(255) UNIQUE NOT NULL,
  threshold_usd DECIMAL(20, 2) DEFAULT 500000,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_users_discord_id ON users(discord_id);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_alerts_tx_hash ON alerts(tx_hash);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);
CREATE INDEX idx_alert_log_discord_id ON alert_log(discord_id);
CREATE INDEX idx_alert_log_created_at ON alert_log(created_at);
CREATE INDEX idx_transaction_log_guild_id ON transaction_log(guild_id);
CREATE INDEX idx_transaction_log_created_at ON transaction_log(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_thresholds ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own data
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = discord_id);

-- RLS Policy: Authenticated users can read alerts
CREATE POLICY "Authenticated users can read alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: Users can only view their own alert logs
CREATE POLICY "Users can view their own alert logs"
  ON alert_log FOR SELECT
  USING (auth.uid()::text = discord_id);
