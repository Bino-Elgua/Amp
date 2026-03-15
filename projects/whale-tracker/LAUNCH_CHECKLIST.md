# Whale Tracker - Launch Checklist

## Pre-Launch Setup (3-5 days)

### 1. Stripe Setup
- [ ] Create Stripe account
- [ ] Create product "Whale Tracker Premium"
- [ ] Create recurring price: $19/month
- [ ] Get Secret Key → `STRIPE_SECRET_KEY`
- [ ] Get Publishable Key → `STRIPE_PUBLISHABLE_KEY`
- [ ] Create webhook endpoint
- [ ] Get Webhook Secret → `STRIPE_WEBHOOK_SECRET`

### 2. Supabase Setup
- [ ] Create Supabase project
- [ ] Run `supabase-schema.sql` (all tables)
- [ ] Verify tables created (users, alerts, alert_log, etc.)
- [ ] Get Project URL → `SUPABASE_URL`
- [ ] Get Anon Key → `SUPABASE_KEY`
- [ ] Get Service Key → `SUPABASE_SERVICE_KEY`
- [ ] Enable RLS on all tables (rows in schema already do this)

### 3. Discord Bot
- [ ] Create Discord app at developer.discord.com
- [ ] Create bot user
- [ ] Get bot token → `DISCORD_TOKEN`
- [ ] Enable Message Content Intent (required for monitoring)
- [ ] Set OAuth2 scopes: `bot`
- [ ] Set permissions: Send Messages, Embed Links
- [ ] Get invite URL → `BOT_INVITE_URL`
- [ ] Invite bot to test server
- [ ] Enable Developer Mode in Discord
- [ ] Get alert channel ID → `DISCORD_CHANNEL_ID`

### 4. Etherscan API
- [ ] Create etherscan.io account
- [ ] Generate API key → `ETHERSCAN_API_KEY`
- [ ] Test with sample request

### 5. Railway Deployment
- [ ] Push code to GitHub
- [ ] Create Railway account
- [ ] Connect GitHub repo
- [ ] Add environment variables
- [ ] Deploy and verify logs show no errors

### 6. Telegram (Optional but Recommended)
- [ ] Message @BotFather on Telegram
- [ ] Create bot with BotFather
- [ ] Get bot token → `TELEGRAM_BOT_TOKEN`
- [ ] Create private Telegram channel
- [ ] Get channel ID → `TELEGRAM_CHANNEL_ID`
- [ ] Deploy telegram_bot.py to Railway

## Testing (1 day)

### Local Testing
- [ ] `python bot.py` runs without errors
- [ ] Check logs for "Whale monitor started"
- [ ] Wait for first block poll
- [ ] Verify bot is online in Discord
- [ ] Send `!whale_status` command - bot responds
- [ ] Send `!premium` command - shows Stripe checkout link

### Stripe Webhook Testing
- [ ] Create webhook endpoint in Stripe Dashboard
- [ ] Test event: `checkout.session.completed`
- [ ] Check Supabase users table - test user should be marked premium
- [ ] Test event: `customer.subscription.deleted`
- [ ] Check users table - user should be marked non-premium

### End-to-End Test
- [ ] Deploy to Railway
- [ ] Invite bot to test Discord server
- [ ] Send `!whale_status` - should show correct threshold ($500k)
- [ ] Etherscan alerts flowing? (may take 1-2 hours for $500k+ transaction)
- [ ] Receive Telegram alerts? (if enabled)

## Launch Day (Go Live)

### 1 Hour Before
- [ ] Verify all environment variables are set on Railway
- [ ] Check Stripe is in live mode (not test mode)
- [ ] Verify Supabase webhook secret matches Stripe
- [ ] Test `!premium` command one more time
- [ ] Check webhook logs in Stripe Dashboard

### Launch
- [ ] Post bot invite link to crypto Discord communities
  - r/cryptocurrency
  - r/ethereum
  - r/defi
  - Crypto Discord servers (100+ members)
- [ ] Share Telegram channel link in relevant communities
- [ ] Post on Twitter/X with link
- [ ] Share on crypto forums

### Post-Launch Monitoring (First 24 hours)
- [ ] Monitor Railway logs for errors
- [ ] Check Supabase for new users
- [ ] Monitor Stripe for first payments
- [ ] Monitor Etherscan API usage (shouldn't exceed limits)
- [ ] Check Discord for command errors
- [ ] Be responsive to user support questions

## Success Metrics (First Week)

Track in Supabase:

```sql
-- DAU (Daily Active Users)
SELECT COUNT(DISTINCT discord_id) as dau
FROM alert_log
WHERE created_at > now() - interval '1 day';

-- Premium conversions
SELECT COUNT(*) as premium_users
FROM users
WHERE is_premium = true;

-- Alerts sent
SELECT COUNT(*) as total_alerts
FROM alerts
WHERE created_at > now() - interval '24 hours';

-- MRR
SELECT COUNT(*) * 19 as monthly_revenue
FROM users
WHERE is_premium = true;
```

### Target Metrics
- **Week 1**: 100+ unique users, 5-10 premium subscribers = $95-190 MRR
- **Week 2**: 300+ users, 20+ premium = $380 MRR  
- **Week 3**: 500+ users, 40+ premium = $760 MRR
- **Month 1**: 1,000+ users, 100+ premium = $1,900 MRR

## Common Issues & Fixes

### Bot Not Responding to Commands
```
1. Check DISCORD_TOKEN is valid
2. Verify bot has permissions in channel
3. Check Message Content Intent is enabled
4. View logs: railway logs --service whale-tracker-bot
```

### Stripe Webhook Not Working
```
1. Verify webhook secret matches in code
2. Check endpoint URL is publicly accessible (HTTPS)
3. Verify event subscriptions in Stripe Dashboard
4. Test webhook in Stripe Dashboard
```

### No Etherscan Data
```
1. Verify API key is correct
2. Check API rate limit: 5 calls/sec, 100k/day
3. Verify latest block number is changing
4. Check if network is congested (higher gas = more alerts)
```

### Supabase Connection Issues
```
1. Verify URL and keys are correct
2. Check RLS policies aren't blocking access
3. Verify service_role key is being used for webhooks
4. Test connection: supabase db test
```

## Post-Launch Improvements (Week 2+)

- [ ] Optimize Etherscan polling (websockets instead of polling)
- [ ] Add Solana whale tracking (via Helius webhooks)
- [ ] Add Bitcoin whale tracking (via Mempool.space)
- [ ] Implement custom watchlists (premium feature)
- [ ] Add token transfer alerts (ERC-20)
- [ ] Build web dashboard for stats
- [ ] Add analytics to track user behavior
- [ ] Implement referral program

## Marketing (Ongoing)

### Channels
- [ ] Reddit: r/cryptocurrency, r/ethereum, r/defi, r/cryptomarkets
- [ ] Discord: High-volume crypto servers (1k+ members)
- [ ] Twitter/X: Crypto traders, VCs, DAOs
- [ ] Telegram: Crypto trading groups
- [ ] Product Hunt (after 2 weeks)

### Messaging
- "Get alerts for whale movements before the market reacts"
- "5 free alerts/day, unlimited for $19/month"
- "$500k+ ETH transfers to your Discord instantly"
- "Join 1,000+ traders already using Whale Tracker"

### Partnership Opportunities
- Integrate with trading bots (Gunbot, 3Commas)
- Partner with DeFi protocols for co-marketing
- Sponsor crypto Discord communities
- Affiliate with trading education platforms

---

**Estimated Timeline**: Setup (3-5 days) → Testing (1 day) → Launch → Scale to $1M ARR (6-12 months with 5k+ users)
