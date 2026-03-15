import os
from dotenv import load_dotenv

load_dotenv()

# Discord
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
DISCORD_WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")

# Etherscan
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
ETHERSCAN_BASE_URL = "https://api.etherscan.io/api"

# Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Whale tracker settings
WHALE_THRESHOLD_USD = float(os.getenv("WHALE_THRESHOLD_USD", 500000))
POLLING_INTERVAL = int(os.getenv("POLLING_INTERVAL_SECONDS", 60))

# Chain configuration
ETH_DECIMALS = 18
STABLECOIN_ADDRESSES = {
    "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "DAI": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
}

# Polygon chain
POLYGON_RPC = "https://polygon-rpc.com"
SOL_RPC = "https://api.mainnet-beta.solana.com"

# Price feed (use coingecko for free tier)
COINGECKO_API = "https://api.coingecko.com/api/v3"
