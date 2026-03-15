#!/usr/bin/env python3
"""
Whale Tracker Demo - Simulates the bot without requiring Discord/Supabase/Etherscan credentials
Shows how the bot works without external APIs
"""

import asyncio
import logging
from datetime import datetime
from config import WHALE_THRESHOLD_USD, POLLING_INTERVAL

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Demo state
alert_count = 0
premium_users = {"user_123": True, "user_456": True}
free_users = {"user_789": 0, "user_101": 2}  # alert count today

def print_header():
    """Print welcome header"""
    print("\n" + "="*70)
    print("🐋 WHALE TRACKER - DEMO MODE".center(70))
    print("="*70)
    print("\n✅ Bot initialized in DEMO mode (no real Discord/APIs)")
    print(f"📊 Whale Threshold: ${WHALE_THRESHOLD_USD:,}")
    print(f"⏱️  Polling Interval: {POLLING_INTERVAL} seconds")
    print(f"📅 Current Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\n" + "-"*70 + "\n")

def simulate_whale_transaction():
    """Generate a simulated whale transaction"""
    global alert_count
    alert_count += 1
    
    # Simulated transaction data
    transactions = [
        {
            "hash": "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
            "from": "0x742d35Cc6634C0532925a3b844Bc2e4f33e6e9fC",
            "to": "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
            "value": 2500 * 1e18,  # 2500 ETH
            "value_usd": 5200000,  # ~$5.2M at $2080/ETH
            "eth_price": 2080,
            "blockNumber": 19542987,
            "gas": 21000,
            "gasPrice": 45e9,
        },
        {
            "hash": "0x9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g",
            "from": "0x28C6c06298d161e15667F44F23cB4e1Df1e6cD27",
            "to": "0x1234567890abcdef1234567890abcdef12345678",
            "value": 1800 * 1e18,  # 1800 ETH
            "value_usd": 3744000,  # ~$3.74M
            "eth_price": 2080,
            "blockNumber": 19542990,
            "gas": 21000,
            "gasPrice": 42e9,
        },
        {
            "hash": "0x5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t",
            "from": "0xd8dA6BF26964aF9D7eEd9e03E53415D37AA96045",
            "to": "0x40b38215ea3d47eff3ce66f7e9677169a480baa3",
            "value": 3000 * 1e18,  # 3000 ETH
            "value_usd": 6240000,  # ~$6.24M
            "eth_price": 2080,
            "blockNumber": 19542993,
            "gas": 21000,
            "gasPrice": 48e9,
        }
    ]
    
    return transactions[alert_count % len(transactions)]

def send_alert(tx, user_id=None):
    """Simulate sending a Discord alert"""
    embed = f"""
    {'='*70}
    🐋 WHALE ALERT #{alert_count}
    {'='*70}
    
    💰 Value:     ${tx['value_usd']:,.0f} ({tx['value'] / 1e18:.2f} ETH @ ${tx['eth_price']:,.0f})
    📤 From:      {tx['from'][:10]}...{tx['from'][-8:]}
    📥 To:        {tx['to'][:10]}...{tx['to'][-8:]}
    ⛽ Gas:       {int(tx['gas']) / 1e9:.2f} Gwei
    🔗 Block:     #{tx['blockNumber']}
    🔍 Tx Hash:   {tx['hash'][:16]}...
    
    🔗 View: https://etherscan.io/tx/{tx['hash']}
    
    {'='*70}
    """
    print(embed)
    return True

def check_daily_limits(user_id):
    """Check if user is premium or has free alerts remaining"""
    if user_id in premium_users:
        return True, "PREMIUM"
    
    alerts_today = free_users.get(user_id, 0)
    if alerts_today < 5:
        free_users[user_id] = alerts_today + 1
        return True, f"FREE ({alerts_today + 1}/5)"
    
    return False, "DAILY_LIMIT"

def print_premium_prompt(user_id):
    """Show premium upgrade prompt"""
    print(f"\n💳 User {user_id} hit daily free limit!")
    print("   Premium Features:")
    print("   ✅ Unlimited alerts")
    print("   ✅ Custom thresholds")
    print("   ✅ Multi-chain support (coming soon)")
    print("   💵 Just $19/month")
    print("   🔗 Subscribe: !premium")
    print()

async def whale_monitor_loop():
    """Main monitoring loop"""
    iteration = 0
    
    print_header()
    print("🚀 Starting whale monitor loop...")
    print(f"   (Simulating new whales every {POLLING_INTERVAL} seconds)\n")
    
    try:
        while iteration < 5:
            iteration += 1
            print(f"\n[Iteration {iteration}] Polling Etherscan...")
            
            # Simulate detecting a whale transaction
            await asyncio.sleep(2)
            tx = simulate_whale_transaction()
            
            print(f"   ✅ Detected whale tx: {tx['value_usd']:,.0f}")
            
            # Send to random user
            user_id = list(premium_users.keys())[0] if iteration % 2 == 0 else list(free_users.keys())[0]
            
            # Check limits
            can_send, status = check_daily_limits(user_id)
            
            if can_send:
                print(f"   📩 Sending alert to {user_id} ({status})")
                send_alert(tx, user_id)
                
                # Reminder for free users
                if status.startswith("FREE") and "5/5" in status:
                    print_premium_prompt(user_id)
            else:
                print(f"   ⚠️  {user_id} has hit daily limit")
                print_premium_prompt(user_id)
            
            if iteration < 5:
                print(f"   ⏳ Next poll in {POLLING_INTERVAL} seconds...")
                await asyncio.sleep(POLLING_INTERVAL)
    
    except KeyboardInterrupt:
        print("\n\n⚠️  Bot stopped by user")
    except Exception as e:
        print(f"\n❌ Error in monitor loop: {e}")

def print_commands():
    """Print available commands"""
    print("\n" + "="*70)
    print("📋 AVAILABLE DISCORD COMMANDS".center(70))
    print("="*70)
    print("""
    !whale_status          Show bot status and monitoring stats
    !premium               Upgrade to premium ($19/month)
    !set_threshold <USD>   Set custom whale threshold (premium only)
    
    Example Discord setup:
    
    1. Create Discord bot at: https://discord.com/developers
    2. Get token → add to .env as DISCORD_TOKEN
    3. Create private channel for alerts
    4. Get channel ID (Developer Mode) → add as DISCORD_CHANNEL_ID
    5. Invite bot to server (OAuth2 URL in .env)
    6. Deploy to Railway
    
    Expected Revenue (12 months):
    ✅ Month 1:  100 users, 5-10 premium        = $95-190 MRR
    ✅ Month 3:  500 users, 25-50 premium       = $475-950 MRR
    ✅ Month 6:  2000 users, 100-200 premium    = $1900-3800 MRR
    ✅ Month 12: 5000+ users, 500+ premium      = $9500+ MRR ($114k+ ARR)
    """)
    print("="*70 + "\n")

def print_monetization():
    """Print monetization strategy"""
    print("\n" + "="*70)
    print("💰 MONETIZATION STRATEGY".center(70))
    print("="*70)
    print("""
    FREE TIER ($0)
    ├─ 5 whale alerts per day
    ├─ Basic Discord embed
    └─ Community support
    
    PREMIUM ($19/month)
    ├─ Unlimited alerts
    ├─ Custom thresholds per user
    ├─ Multi-chain (Ethereum, Solana, Bitcoin)
    ├─ Email notifications
    └─ Priority support
    
    API TIER ($99/month)
    ├─ For traders, bots, hedge funds
    ├─ Webhook access
    ├─ Real-time REST API
    ├─ 99.9% uptime SLA
    └─ Dedicated account manager
    
    AFFILIATE PROGRAM (20% commission)
    ├─ Earn $3.80 per premium signup
    ├─ Lifetime commission on referrals
    ├─ Marketing materials provided
    └─ Monthly payouts via Stripe
    
    PATH TO $100K/MONTH
    ├─ 3,000 free users (100 free channels)
    ├─ 500 premium subs × $19      = $9,500/month
    ├─ 50 API tier × $99           = $4,950/month
    ├─ 100 affiliate subs × $3.80   = $380/month
    └─ TOTAL                        = $14,830/month
    
    Multiplied 6-7x over 12 months = $100k+/month possible
    """)
    print("="*70 + "\n")

async def main():
    """Main entry point"""
    print_commands()
    
    # Run the monitor loop
    await whale_monitor_loop()
    
    print_monetization()
    
    print("\n✅ Demo complete!")
    print("\n📖 To launch the REAL bot:")
    print("   1. Follow setup in QUICKLAUNCH.md")
    print("   2. Get Discord token, Etherscan API key, Stripe keys")
    print("   3. Run: python bot.py")
    print("   4. Deploy to Railway for 24/7 monitoring")
    print("\n")

if __name__ == "__main__":
    asyncio.run(main())
