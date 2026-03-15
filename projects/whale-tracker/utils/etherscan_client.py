import aiohttp
import logging
from config import ETHERSCAN_BASE_URL

logger = logging.getLogger(__name__)


class EtherscanClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = ETHERSCAN_BASE_URL
        self.session = None
    
    async def _get(self, params: dict):
        """Make async HTTP request to Etherscan"""
        if not self.session:
            self.session = aiohttp.ClientSession()
        
        params["apikey"] = self.api_key
        
        try:
            async with self.session.get(self.base_url, params=params) as response:
                return await response.json()
        except Exception as e:
            logger.error(f"Etherscan API error: {e}")
            return {"result": []}
    
    async def get_latest_block(self) -> int:
        """Get latest block number"""
        result = await self._get({
            "module": "eth",
            "action": "blockNumber",
        })
        
        if result.get("status") == "1":
            return int(result["result"], 16)
        return 0
    
    async def get_block_transactions(self, block_number: int) -> list:
        """Get all transactions in a specific block"""
        result = await self._get({
            "module": "proxy",
            "action": "eth_getBlockByNumber",
            "tag": hex(block_number),
            "boolean": "true",
        })
        
        if result.get("result"):
            return result["result"].get("transactions", [])
        return []
    
    async def get_transactions_in_range(self, start_block: int, end_block: int) -> list:
        """Get transactions across multiple blocks"""
        all_txs = []
        
        for block_num in range(start_block, end_block + 1):
            txs = await self.get_block_transactions(block_num)
            all_txs.extend(txs)
        
        return all_txs
    
    async def get_eth_balance(self, address: str) -> float:
        """Get ETH balance for address"""
        result = await self._get({
            "module": "account",
            "action": "balance",
            "address": address,
            "tag": "latest",
        })
        
        if result.get("status") == "1":
            return int(result["result"]) / 1e18
        return 0
    
    async def get_token_transfers(self, address: str, contract: str) -> list:
        """Get ERC20 token transfers"""
        result = await self._get({
            "module": "account",
            "action": "tokentx",
            "address": address,
            "contractaddress": contract,
            "sort": "desc",
            "page": 1,
            "offset": 10000,
        })
        
        if result.get("status") == "1":
            return result["result"]
        return []
    
    async def close(self):
        """Close aiohttp session"""
        if self.session:
            await self.session.close()
