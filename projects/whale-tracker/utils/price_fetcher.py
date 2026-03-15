import aiohttp
import logging

logger = logging.getLogger(__name__)


class PriceFetcher:
    def __init__(self, coingecko_api: str):
        self.api = coingecko_api
        self.session = None
        self.cache = {}
    
    async def _get(self, endpoint: str, params: dict = None):
        """Make async request to CoinGecko"""
        if not self.session:
            self.session = aiohttp.ClientSession()
        
        url = f"{self.api}{endpoint}"
        
        try:
            async with self.session.get(url, params=params) as response:
                return await response.json()
        except Exception as e:
            logger.error(f"CoinGecko API error: {e}")
            return {}
    
    async def get_eth_price(self) -> float:
        """Get current ETH price in USD"""
        result = await self._get(
            "/simple/price",
            {"ids": "ethereum", "vs_currencies": "usd"}
        )
        
        price = result.get("ethereum", {}).get("usd", 0)
        self.cache["eth_price"] = price
        return price
    
    async def get_token_price(self, token_address: str) -> float:
        """Get token price by contract address"""
        result = await self._get(
            f"/simple/token_price/ethereum",
            {"contract_addresses": token_address, "vs_currencies": "usd"}
        )
        
        return result.get(token_address.lower(), {}).get("usd", 0)
    
    async def get_multiple_prices(self, token_addresses: list) -> dict:
        """Get prices for multiple tokens"""
        addresses = ",".join(token_addresses)
        result = await self._get(
            "/simple/token_price/ethereum",
            {"contract_addresses": addresses, "vs_currencies": "usd"}
        )
        
        return result
    
    async def close(self):
        """Close aiohttp session"""
        if self.session:
            await self.session.close()
