import discord
from discord.ext import commands, tasks
import aiohttp
import asyncio
import logging
import os
from datetime import datetime
from config import (
    DISCORD_TOKEN,
    ETHERSCAN_API_KEY,
    ETHERSCAN_BASE_URL,
    WHALE_THRESHOLD_USD,
    POLLING_INTERVAL,
    COINGECKO_API,
)
from utils.etherscan_client import EtherscanClient
from utils.price_fetcher import PriceFetcher
from utils.db import Database
from payments import (
    is_premium_user,
    get_daily_alert_count,
    log_alert_sent,
    create_checkout_session,
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

# Global state
etherscan = None
price_fetcher = None
db = None
last_block = None


@bot.event
async def on_ready():
    global etherscan, price_fetcher, db, last_block
    
    logger.info(f"Bot logged in as {bot.user}")
    
    if etherscan is None:
        etherscan = EtherscanClient(ETHERSCAN_API_KEY)
        price_fetcher = PriceFetcher(COINGECKO_API)
        db = Database()
        await db.connect()
        
        # Get initial block
        last_block = await etherscan.get_latest_block()
    
    if not whale_monitor.is_running():
        whale_monitor.start()
        logger.info("Whale monitor started")


@tasks.loop(seconds=POLLING_INTERVAL)
async def whale_monitor():
    """Main loop: poll Etherscan for large transactions"""
    global last_block
    
    try:
        current_block = await etherscan.get_latest_block()
        
        if last_block is None:
            last_block = current_block - 10  # Start 10 blocks back
        
        # Fetch transactions in new blocks
        transactions = await etherscan.get_transactions_in_range(last_block, current_block)
        
        # Fetch current ETH price
        eth_price = await price_fetcher.get_eth_price()
        
        # Filter whale transactions
        whale_txs = []
        for tx in transactions:
            value_usd = (int(tx.get("value", 0)) / 1e18) * eth_price
            
            if value_usd >= WHALE_THRESHOLD_USD:
                whale_txs.append({
                    **tx,
                    "value_usd": value_usd,
                    "eth_price": eth_price,
                })
        
        # Send alerts for whale transactions (with freemium limits)
        # Note: In production, loop through subscribed guilds instead of global channel
        for tx in whale_txs:
            # For MVP, send to all connected guilds
            # TODO: Check subscription status per guild and enforce daily limits
            await send_whale_alert(tx)
            logger.info(f"Whale alert sent: {tx['hash']}")
        
        last_block = current_block
        
    except Exception as e:
        logger.error(f"Error in whale_monitor: {e}")


async def send_whale_alert(tx, guild_id: int = None):
    """Send Discord embed alert for whale transaction"""
    channel = bot.get_channel(int(os.getenv("DISCORD_CHANNEL_ID", 0)))
    
    if not channel:
        logger.error("Channel not found")
        return
    
    embed = discord.Embed(
        title="🐋 WHALE ALERT",
        color=discord.Color.gold(),
        timestamp=datetime.now(),
    )
    
    embed.add_field(
        name="Value",
        value=f"${tx['value_usd']:,.0f} ({tx['value'] / 1e18:.2f} ETH @ ${tx['eth_price']:,.2f})",
        inline=False,
    )
    embed.add_field(name="From", value=f"`{tx['from']}`", inline=False)
    embed.add_field(name="To", value=f"`{tx['to']}`", inline=False)
    embed.add_field(name="Gas", value=f"{int(tx['gas']) / 1e9:.2f} Gwei", inline=True)
    embed.add_field(name="Block", value=tx['blockNumber'], inline=True)
    embed.add_field(
        name="Transaction",
        value=f"[View on Etherscan](https://etherscan.io/tx/{tx['hash']})",
        inline=False,
    )
    
    embed.set_footer(text="Whale Tracker | Real-time ETH Monitoring")
    
    message = await channel.send(embed=embed)
    
    # Log alert for tracking
    if guild_id:
        await db.log_transaction(guild_id, tx['hash'])


@bot.command(name="whale_status")
async def whale_status(ctx):
    """Check bot status and monitoring info"""
    embed = discord.Embed(
        title="Whale Tracker Status",
        color=discord.Color.blue(),
    )
    embed.add_field(name="Status", value="✅ Online", inline=False)
    embed.add_field(name="Threshold", value=f"${WHALE_THRESHOLD_USD:,.0f}", inline=True)
    embed.add_field(name="Polling Interval", value=f"{POLLING_INTERVAL}s", inline=True)
    embed.add_field(name="Last Block", value=last_block or "N/A", inline=False)
    
    await ctx.send(embed=embed)


@bot.command(name="premium")
async def premium(ctx):
    """Subscribe to premium alerts (unlimited, custom thresholds)"""
    user_id = str(ctx.author.id)
    
    # Check if already premium
    if is_premium_user(user_id):
        embed = discord.Embed(
            title="✅ Premium Subscriber",
            description="You already have unlimited alerts!",
            color=discord.Color.green(),
        )
        await ctx.send(embed=embed)
        return
    
    # Create checkout session
    success_url = "https://whale-tracker.app/success"
    cancel_url = "https://whale-tracker.app/cancel"
    checkout_url = create_checkout_session(user_id, success_url, cancel_url)
    
    if checkout_url:
        embed = discord.Embed(
            title="🚀 Upgrade to Premium",
            description="$19/month for unlimited alerts + custom thresholds",
            color=discord.Color.gold(),
        )
        embed.add_field(
            name="Subscribe",
            value=f"[Complete Payment]({checkout_url})",
            inline=False,
        )
        embed.set_footer(text="Secure payment via Stripe")
        await ctx.send(embed=embed)
    else:
        await ctx.send("❌ Failed to create checkout session. Try again later.")


@bot.command(name="set_threshold")
async def set_threshold(ctx, amount: float):
    """Set custom whale threshold (premium only)"""
    user_id = str(ctx.author.id)
    
    if not is_premium_user(user_id):
        embed = discord.Embed(
            title="🔒 Premium Feature",
            description="Custom thresholds available for premium subscribers.",
            color=discord.Color.red(),
        )
        embed.add_field(
            name="Upgrade",
            value="Use `/premium` to subscribe",
            inline=False,
        )
        await ctx.send(embed=embed)
        return
    
    # TODO: Store custom threshold per user in Supabase
    await ctx.send(f"✅ Threshold set to ${amount:,.0f}")


if __name__ == "__main__":
    import os
    bot.run(DISCORD_TOKEN)
