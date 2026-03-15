import logging
from supabase import create_client, Client

logger = logging.getLogger(__name__)


class Database:
    def __init__(self, url: str = None, key: str = None):
        from config import SUPABASE_URL, SUPABASE_KEY
        
        self.url = url or SUPABASE_URL
        self.key = key or SUPABASE_KEY
        self.client: Client = None
    
    async def connect(self):
        """Initialize Supabase client"""
        try:
            self.client = create_client(self.url, self.key)
            logger.info("Connected to Supabase")
        except Exception as e:
            logger.error(f"Failed to connect to Supabase: {e}")
    
    async def save_alert(self, tx_hash: str, value_usd: float, from_addr: str, to_addr: str):
        """Save whale alert to database"""
        try:
            self.client.table("alerts").insert({
                "tx_hash": tx_hash,
                "value_usd": value_usd,
                "from_address": from_addr,
                "to_address": to_addr,
            }).execute()
        except Exception as e:
            logger.error(f"Failed to save alert: {e}")
    
    async def get_user_subscriptions(self, guild_id: int) -> list:
        """Get all premium subscriptions for a guild"""
        try:
            result = self.client.table("subscriptions").select("*").eq(
                "guild_id", guild_id
            ).eq("active", True).execute()
            
            return result.data
        except Exception as e:
            logger.error(f"Failed to fetch subscriptions: {e}")
            return []
    
    async def create_subscription(self, guild_id: int, stripe_id: str):
        """Create new subscription"""
        try:
            self.client.table("subscriptions").insert({
                "guild_id": guild_id,
                "stripe_id": stripe_id,
                "active": True,
            }).execute()
        except Exception as e:
            logger.error(f"Failed to create subscription: {e}")
    
    async def log_transaction(self, guild_id: int, tx_hash: str):
        """Log transaction alert for guild"""
        try:
            self.client.table("transaction_log").insert({
                "guild_id": guild_id,
                "tx_hash": tx_hash,
            }).execute()
        except Exception as e:
            logger.error(f"Failed to log transaction: {e}")
