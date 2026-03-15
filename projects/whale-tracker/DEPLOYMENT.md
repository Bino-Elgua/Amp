# Whale Tracker Deployment Guide

## Step 1: Setup Stripe

1. **Create Stripe Account** - [stripe.com](https://stripe.com)
2. **Create Product** - "Whale Tracker Premium"
3. **Create Recurring Price** - $19/month
4. **Get API Keys** - Dashboard → Developers → API Keys
   - Copy `Secret Key` → `STRIPE_SECRET_KEY`
   - Copy `Publishable Key` → `STRIPE_PUBLISHABLE_KEY`

## Step 2: Setup Supabase

1. **Create Supabase Project** - [supabase.com](https://supabase.com)
2. **Run Database Schema**:
   - Go to SQL Editor
   - Paste contents of `supabase-schema.sql`
   - Execute
3. **Get API Keys** - Settings → API
   - Copy `Project URL` → `SUPABASE_URL`
   - Copy `anon public` → `SUPABASE_KEY`
   - Copy `service_role secret` → `SUPABASE_SERVICE_KEY`

## Step 3: Setup Discord Bot

1. **Create Discord Application** - [discord.com/developers](https://discord.com/developers)
2. **Get Bot Token** - Bot → TOKEN (copy to clipboard)
   - Set `DISCORD_TOKEN` in `.env`
3. **Enable Intents** - Bot → Message Content Intent (toggle ON)
4. **Set Permissions** - OAuth2 → URL Generator
   - Scopes: `bot`
   - Permissions: `Send Messages`, `Embed Links`
   - Copy URL → `BOT_INVITE_URL`
5. **Get Channel ID** - Enable Developer Mode in Discord
   - Right-click channel → Copy Channel ID
   - Set `DISCORD_CHANNEL_ID` in `.env`

## Step 4: Setup Etherscan API

1. **Create Account** - [etherscan.io](https://etherscan.io)
2. **Create API Key** - Account → API Keys
   - Copy key → `ETHERSCAN_API_KEY`

## Step 5: Deploy Discord Bot to Railway

### Local Testing First

```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your keys

# Test locally
python bot.py
```

### Deploy to Railway

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial whale tracker setup"
git remote add origin https://github.com/YOUR_USERNAME/whale-tracker.git
git push -u origin main
```

2. **Connect Railway**:
   - Go to [railway.app](https://railway.app)
   - New Project → GitHub Repo
   - Select `whale-tracker`
   - Railway auto-detects Dockerfile and `railway.json`

3. **Add Environment Variables**:
   - Project → Variables
   - Add all keys from `.env`

4. **Deploy**:
   - Railway auto-deploys on git push
   - View logs: Deployments → View Logs

## Step 6: Deploy Webhook Server (FastAPI)

Stripe webhooks need a public HTTPS endpoint. Two options:

### Option A: Separate Railway Service

1. **Create new Railway project** for `webhook_server.py`
2. **Get Public URL** from Railway deployment
3. **Add to Stripe**:
   - Stripe Dashboard → Webhooks
   - Endpoint URL: `https://YOUR_RAILWAY_URL/webhook/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Get `Webhook Secret` → `STRIPE_WEBHOOK_SECRET`

### Option B: Edge Functions (Recommended)

Use Supabase Edge Functions for webhook handling (serverless, included in free tier):

```bash
supabase functions new stripe-webhook
supabase functions deploy stripe-webhook
```

Then point Stripe webhook to the Function URL.

## Step 7: Setup Telegram Bot (Optional)

1. **Create Bot** - Message [@BotFather](https://t.me/botfather) on Telegram
2. **Get Bot Token** → `TELEGRAM_BOT_TOKEN`
3. **Create Channel** - For alerts
4. **Get Channel ID** - Message [@IDBot](https://t.me/myidbot)
   - Forward message from channel → get ID
   - Set `TELEGRAM_CHANNEL_ID`

### Deploy Telegram Mirror

```bash
# On Railway, create another service
# Environment: Python 3.11
# Start Command: python telegram_bot.py
```

## Step 8: Verify Setup

1. **Discord Bot Online** - Check status in Discord server
2. **Send `/whale_status`** - Bot should respond
3. **Send `/premium`** - Should show Stripe checkout link
4. **Test Stripe Webhook** - Stripe Dashboard → Webhooks → Test Event
5. **Check Supabase** - Users table should have test entry after payment

## Monitoring

### View Bot Logs
```bash
railway logs --service whale-tracker-bot
```

### View Webhook Logs
```bash
railway logs --service whale-tracker-webhook
```

### Monitor Alerts
```sql
-- Check recent alerts
SELECT * FROM alerts 
ORDER BY created_at DESC 
LIMIT 10;

-- Check active subscriptions
SELECT * FROM users 
WHERE is_premium = true;

-- Check daily limits (free users)
SELECT discord_id, COUNT(*) as alerts_today
FROM alert_log
WHERE created_at > now() - interval '1 day'
GROUP BY discord_id
ORDER BY alerts_today DESC;
```

## Troubleshooting

### Bot not responding
- Check `DISCORD_TOKEN` is valid
- Verify bot has message permissions in channel
- Check logs: `railway logs`

### Stripe webhook not firing
- Verify webhook secret matches in code
- Check endpoint URL is public HTTPS
- Test event in Stripe Dashboard

### No Etherscan data
- Verify `ETHERSCAN_API_KEY` is valid
- Check API rate limits (5 calls/sec, 100k/day)
- Try fetching latest block manually

## Revenue Tracking

Monitor in Supabase:

```sql
-- Monthly recurring revenue (MRR)
SELECT COUNT(*) as premium_users, (COUNT(*) * 19) as mrr
FROM users
WHERE is_premium = true;

-- Churn rate
SELECT 
  COUNT(DISTINCT discord_id) as downgrades_this_month
FROM users
WHERE is_premium = false
  AND updated_at > now() - interval '1 month'
  AND created_at < now() - interval '1 month';
```

## Next Steps

1. Launch Discord bot in crypto trading servers
2. Share Telegram channel link
3. Monitor metrics (alerts sent, conversions, churn)
4. Add multi-chain support (Solana, Bitcoin) after reaching 1K users
5. Build landing page with dashboard preview
6. Add API tier ($99/month for traders/bots)
