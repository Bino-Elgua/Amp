"""
Telegram mirror bot - sends same alerts to Telegram channel
Run as separate process: python telegram_bot.py
"""

import os
import asyncio
import logging
from dotenv import load_dotenv
import aiohttp
from config import ETHERSCAN_BASE_URL
from utils.etherscan_client import EtherscanClient
from utils.price_fetcher import PriceFetcher
from config import WHALE_THRESHOLD_USD, POLLING_INTERVAL, COINGECKO_API

load_dotenv()

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHANNEL_ID = os.getenv("TELEGRAM_CHANNEL_ID")
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"

etherscan = None
price_fetcher = None
last_block = None


async def initialize():
    """Initialize API clients"""
    global etherscan, price_fetcher, last_block
    
    etherscan = EtherscanClient(os.getenv("ETHERSCAN_API_KEY"))
    price_fetcher = PriceFetcher(COINGECKO_API)
    last_block = await etherscan.get_latest_block()
    logger.info(f"Initialized. Starting block: {last_block}")


async def send_telegram_alert(tx):
    """Send whale alert to Telegram channel"""
    try:
        message = (
            f"🐋 **WHALE ALERT**\n\n"
            f"💰 Value: ${tx['value_usd']:,.0f}\n"
            f"Ξ Amount: {tx['value'] / 1e18:.2f} ETH @ ${tx['eth_price']:,.2f}\n\n"
            f"📤 From: `{tx['from']}`\n"
            f"📥 To: `{tx['to']}`\n\n"
            f"⛽ Gas: {int(tx['gas']) / 1e9:.2f} Gwei\n"
            f"🔗 Block: {tx['blockNumber']}\n\n"
            f"[View on Etherscan](https://etherscan.io/tx/{tx['hash']})"
        )
        
        payload = {
            "chat_id": TELEGRAM_CHANNEL_ID,
            "text": message,
            "parse_mode": "Markdown",
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{TELEGRAM_API_URL}/sendMessage",
                json=payload
            ) as response:
                if response.status == 200:
                    logger.info(f"Telegram alert sent: {tx['hash']}")
                else:
                    logger.error(f"Telegram error: {response.status}")
    except Exception as e:
        logger.error(f"Failed to send Telegram alert: {e}")


async def monitor_whales():
    """Main monitoring loop"""
    global last_block
    
    await initialize()
    
    while True:
        try:
            current_block = await etherscan.get_latest_block()
            
            if last_block is None:
                last_block = current_block - 10
            
            # Fetch transactions
            transactions = await etherscan.get_transactions_in_range(
                last_block, 
                current_block
            )
            
            # Get ETH price
            eth_price = await price_fetcher.get_eth_price()
            
            # Filter whales
            whale_txs = []
            for tx in transactions:
                value_usd = (int(tx.get("value", 0)) / 1e18) * eth_price
                
                if value_usd >= WHALE_THRESHOLD_USD:
                    whale_txs.append({
                        **tx,
                        "value_usd": value_usd,
                        "eth_price": eth_price,
                    })
            
            # Send alerts
            for tx in whale_txs:
                await send_telegram_alert(tx)
            
            last_block = current_block
            await asyncio.sleep(POLLING_INTERVAL)
            
        except Exception as e:
            logger.error(f"Monitor error: {e}")
            await asyncio.sleep(POLLING_INTERVAL)


if __name__ == "__main__":
    asyncio.run(monitor_whales())
