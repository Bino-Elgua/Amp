# Whale Tracker - Quick Launch Plan (48-72 Hours)

## WHAT YOU HAVE

✅ **Fully functional Discord bot** - Monitors Ethereum for whale txs ($500k+)  
✅ **Stripe integration** - $19/month premium subscription  
✅ **Supabase backend** - User tracking, alert logging  
✅ **Telegram mirror bot** - Optional alerts on Telegram  
✅ **WebSocket webhook server** - Handles Stripe payment events  
✅ **Docker + Railway setup** - Production-ready deployment  

**Total code:** 17 files, ~1500 lines of Python. **COMPLETE MVP.**

---

## CRITICAL PATH TO LAUNCH (72 hours max)

### DAY 1: Setup External Services (6-8 hours)

#### 1. Stripe Account (30 min)
- [ ] Go to **stripe.com** → Sign up
- [ ] Create product: "Whale Tracker Premium"
- [ ] Create recurring price: **$19/month**
- [ ] Copy to `.env`:
  - `STRIPE_SECRET_KEY` (from API Keys page)
  - `STRIPE_PRICE_ID` (from price page)
  - `STRIPE_WEBHOOK_SECRET` (we'll create after)

#### 2. Supabase Account (30 min)
- [ ] Go to **supabase.com** → Sign up (free tier OK)
- [ ] New project → name it "whale-tracker"
- [ ] Go to SQL Editor
- [ ] Copy-paste entire `supabase-schema.sql` and execute
- [ ] Copy to `.env`:
  - `SUPABASE_URL` (Settings → API)
  - `SUPABASE_KEY` (anon key)
  - `SUPABASE_SERVICE_KEY` (service_role key)

#### 3. Discord Bot (30 min)
- [ ] Go to **discord.com/developers** → Login
- [ ] Create new application (name: "Whale Tracker")
- [ ] Bot tab → Create Bot
- [ ] Copy token → `DISCORD_TOKEN`
- [ ] Enable "Message Content Intent" (toggle ON)
- [ ] Copy to `.env`: `DISCORD_TOKEN`
- [ ] OAuth2 → URL Generator:
  - Scopes: `bot`
  - Permissions: `Send Messages`, `Embed Links`, `Use Slash Commands`
  - Copy URL → Save for later (for inviting bot)

#### 4. Etherscan API (15 min)
- [ ] Go to **etherscan.io** → Sign up
- [ ] Account → API Keys → Create API key
- [ ] Copy to `.env`: `ETHERSCAN_API_KEY`

#### 5. Create `.env` file
```bash
cd whale-tracker
cp .env.example .env
# Edit .env with all keys from above
```

---

### DAY 2: Local Testing + GitHub Push (4-6 hours)

#### 1. Test Locally (2 hours)
```bash
# Install deps
pip install -r requirements.txt

# Create a test Discord server (if you don't have one)
# Invite bot via OAuth2 URL from Step 3 above

# Run bot
python bot.py

# In Discord, test:
!whale_status          # Should show threshold
!premium               # Should show Stripe checkout link
```

**Expected:** Bot goes online, no errors in console.

#### 2. Push to GitHub (1 hour)
```bash
git init
git add .
git commit -m "Whale Tracker MVP - ready for launch"
git remote add origin https://github.com/YOUR_USERNAME/whale-tracker.git
git push -u origin main
```

---

### DAY 3: Deploy to Railway + Webhooks (4-6 hours)

#### 1. Deploy Bot to Railway (2 hours)
- [ ] Go to **railway.app** → Sign up
- [ ] New Project → GitHub Repo → Select `whale-tracker`
- [ ] Railway detects `Dockerfile` + `railway.json`
- [ ] Add environment variables (Project → Variables):
  - Copy ALL from `.env`
- [ ] Deploy button
- [ ] Check logs (should see "Bot logged in as...")

#### 2. Setup Stripe Webhook (1 hour)
- [ ] Get Railway URL: Deployments → URL (something like `whale-tracker-prod.railway.app`)
- [ ] In Stripe: Webhooks → Add endpoint
- [ ] URL: `https://YOUR_RAILWAY_URL/webhook/stripe`
- [ ] Select events:
  - `checkout.session.completed`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
- [ ] Copy webhook secret → Add to `.env.STRIPE_WEBHOOK_SECRET`
- [ ] Push to GitHub (triggers Railway redeploy)

#### 3. Test in Production (1 hour)
```
- Invite bot to a real Discord server
- Run: !whale_status
- Click premium link → use Stripe TEST card (4242 4242 4242 4242)
- Check Supabase: users table should show your account as premium=true
```

**If tests pass → YOU'RE LIVE**

---

## GO LIVE (Launch Day)

### 1. Final Checks (30 min)
```sql
-- In Supabase SQL editor, verify tables exist:
SELECT * FROM users;
SELECT * FROM alerts;
SELECT * FROM alert_log;
-- Should all return empty (OK, no users yet)
```

### 2. Spread the Word (Ongoing)

**Where to post bot invite link:**

1. **Reddit** (same-day posts):
   - r/ethereum
   - r/cryptocurrency
   - r/defi
   - r/ethtrader

2. **Discord communities** (message admins):
   - Crypto trading servers (100+ members)
   - DeFi communities
   - Ethereum communities

3. **Telegram** (if using telegram_bot.py):
   - Crypto trading groups
   - Whale watching groups

4. **Twitter/X**:
   - Tag crypto traders, VCs
   - Message: "Get free ETH whale alerts in Discord. 5/day free, unlimited for $19/month"

5. **Product Hunt** (wait 1 week, then):
   - Launch on producthunt.com
   - Good for credibility

---

## FIRST WEEK SUCCESS METRICS

Track these in Supabase:

```sql
-- Daily users
SELECT COUNT(DISTINCT discord_id) FROM alert_log WHERE created_at > now() - interval '1 day';

-- Premium users
SELECT COUNT(*) FROM users WHERE is_premium = true;

-- Current MRR
SELECT COUNT(*) * 19 as monthly_revenue FROM users WHERE is_premium = true;
```

**Target Week 1:**
- 100+ unique users joined
- 5-10 premium subscriptions
- $95-190 MRR

**Target Month 1:**
- 1,000+ users
- 50-100 premium subs
- $950-1,900 MRR

---

## COMMON ISSUES & FIXES

### "Bot not responding in Discord"
- Check `DISCORD_TOKEN` is correct
- Verify bot has "Send Messages" permission in channel
- Check Message Content Intent is ON in Discord developer portal

### "Stripe webhook not working"
- Verify webhook URL is **HTTPS** (not HTTP)
- Check webhook secret matches in code
- Test webhook in Stripe dashboard → Send test event

### "No Etherscan data"
- Verify `ETHERSCAN_API_KEY` is correct
- Check free tier limit: 5 calls/sec, 100k/day
- Wait for a real $500k+ transaction (may take hours/days)

### "Supabase connection error"
- Verify `SUPABASE_URL` and keys are exactly right (copy-paste)
- Check RLS policies (schema file should set them correctly)
- Verify using `SUPABASE_SERVICE_KEY` for backend (not anon key)

---

## NEXT WEEK IMPROVEMENTS (After Launch)

- [ ] Add Solana whale tracking (via Helius API)
- [ ] Add Bitcoin whale tracking (via Mempool)
- [ ] Implement custom thresholds (premium feature)
- [ ] Build web dashboard for stats
- [ ] Add referral program (5% revenue share)
- [ ] Create case studies / demo videos

---

## ESTIMATED COSTS (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Stripe | 2.9% + $0.30/transaction | Only on payments (profit) |
| Supabase | Free (100,000 requests/day) | Upgrade later if needed |
| Railway | ~$5-10 | Depends on bot uptime |
| Etherscan API | Free (100k calls/day) | Plenty for 1 bot |
| Discord | Free | |
| **Total** | **~$5-15/month** | For 100-1000 users |

**Revenue at 100 premium users:** 100 × $19 = $1,900/month  
**Profit:** $1,900 - $15 = **$1,885/month** = **23x ROI**

---

## TIMELINE SUMMARY

| When | What | Expected Result |
|------|------|-----------------|
| Day 1 (6-8h) | Setup Stripe, Supabase, Discord, Etherscan | All .env vars filled |
| Day 2 (4-6h) | Test locally + GitHub push | Bot running, code backed up |
| Day 3 (4-6h) | Deploy to Railway + webhooks | Live bot, payments working |
| Week 1 | Promote in communities | 100+ users, 5-10 paying |
| Week 2-4 | Iterate based on feedback | 300-500 users, 20-40 paying |
| Month 2 | Add multi-chain tracking | 1,000+ users, 100+ paying |

---

## GO/NO-GO CHECKLIST

- [ ] All 6 `.env` variables filled (Stripe, Supabase, Discord, Etherscan)
- [ ] Local bot runs: `python bot.py`
- [ ] Code pushed to GitHub
- [ ] Railway deployment successful (no errors in logs)
- [ ] Test Stripe webhook (create test checkout)
- [ ] Supabase shows test user as premium
- [ ] Discord bot responds to `!whale_status`

**If all checked:** Launch immediately 🚀

---

**Start: TODAY**  
**Launch: 72 hours from now**  
**First $1,000 MRR: ~60 days**
