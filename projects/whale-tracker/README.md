# Whale Tracker - Ethereum Whale Alert Bot

Real-time Discord bot that monitors and alerts on large Ethereum transactions (whales) above a configurable threshold.

## Features

- **Real-time monitoring**: Polls Etherscan every 60 seconds for large ETH transfers
- **Discord alerts**: Embeds with tx hash, value, from/to addresses, gas, and Etherscan links
- **Threshold filtering**: Customizable minimum transaction value ($500k default)
- **Price conversion**: Auto-fetches current ETH price for USD value calculation
- **Freemium model**: Free tier (5 alerts/day), premium ($19/month unlimited)
- **Database tracking**: Supabase integration for subscriptions and alert history

## Quick Start (5 minutes)

```bash
# 1. Clone & install
git clone https://github.com/YOUR_USERNAME/whale-tracker.git
cd whale-tracker
pip install -r requirements.txt

# 2. Setup .env (see DEPLOYMENT.md for full guide)
cp .env.example .env
# Edit with: DISCORD_TOKEN, ETHERSCAN_API_KEY, STRIPE_SECRET_KEY, SUPABASE_URL, etc.

# 3. Run locally
python bot.py

# 4. Deploy to Railway (recommended)
git push
# Railway auto-deploys on push
```

**Full setup guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed Stripe, Supabase, Discord, and Railway setup.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Whale Tracker System                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Etherscan API                                          │
│      ↓                                                   │
│  bot.py (Discord alerts)      telegram_bot.py (Mirror) │
│      ↓                              ↓                   │
│  Discord Channel              Telegram Channel         │
│                                                          │
│  webhook_server.py (FastAPI)                           │
│      ↓                                                   │
│  Stripe Events (checkout, subscription cancellation)   │
│      ↓                                                   │
│  Supabase (users, alerts, subscription tracking)       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Monitoring** - `bot.py` polls Etherscan every 60 seconds for new blocks
2. **Filtering** - Detects transactions ≥ $500k USD
3. **Alerts** - Sends embeds to Discord + Telegram simultaneously
4. **Subscription** - User clicks `/premium` → Stripe checkout → webhook updates Supabase
5. **Gating** - Free users capped at 5 alerts/day, premium unlimited

## Discord Commands

- `!whale_status` - Check bot status and monitoring stats
- `!premium` - Subscribe to premium (unlimited alerts, custom thresholds)
- `!set_threshold <amount>` - Set custom whale threshold (premium only)

## Revenue Model

- **Free**: 5 alerts per day
- **Pro ($19/month)**: Unlimited alerts + custom thresholds + multi-chain (SOL, BTC coming soon)
- **API ($99/month)**: Webhook access for traders/bots

## Project Status

### ✅ MVP Complete
- [x] Discord bot with real-time alerts
- [x] Stripe subscription integration ($19/month)
- [x] Supabase user/subscription tracking
- [x] Freemium model (5 free/day, unlimited premium)
- [x] Telegram mirror bot
- [x] Railway deployment ready

### 📋 Phase 2 (Month 2)
- [ ] Multi-chain support (Solana via Helius, Bitcoin via Mempool)
- [ ] Custom watchlists (track specific wallets)
- [ ] Token transfers (ERC-20, stablecoins)
- [ ] Advanced filters (contract addresses, gas price)
- [ ] Web dashboard for stats

### 🚀 Phase 3 (Month 3+)
- [ ] API tier ($99/month for traders/bots)
- [ ] Mobile app (iOS/Android)
- [ ] Push notifications
- [ ] Affiliate program (traffic commission)
- [ ] White-label licensing

## License

MIT
