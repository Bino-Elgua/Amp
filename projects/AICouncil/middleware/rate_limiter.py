"""
Rate Limiting & Cost Tracking Middleware
Task 14: Per-user quotas, cost dashboard, abuse prevention
"""

import os
import json
from typing import Dict, Optional
from datetime import datetime, timedelta
from enum import Enum
import redis
from pydantic import BaseModel
import httpx


class RateLimitTier(str, Enum):
    """User tier levels"""
    FREE = "free"       # 10 requests/hour
    PRO = "pro"         # 1000 requests/hour
    ENTERPRISE = "enterprise"  # Unlimited


class CostModel(BaseModel):
    """Pricing model per model"""
    model: str
    input_cost_per_1k: float  # USD per 1k tokens
    output_cost_per_1k: float


class RateLimitConfig:
    """Rate limiting configuration"""
    
    # Default limits (requests per hour)
    LIMITS = {
        RateLimitTier.FREE: 10,
        RateLimitTier.PRO: 1000,
        RateLimitTier.ENTERPRISE: 999999,
    }
    
    # Cost limits (USD per month)
    COST_LIMITS = {
        RateLimitTier.FREE: 5.0,
        RateLimitTier.PRO: 100.0,
        RateLimitTier.ENTERPRISE: float('inf'),
    }
    
    # Pricing per model
    PRICING = {
        "gpt-4": CostModel(
            model="gpt-4",
            input_cost_per_1k=0.03,
            output_cost_per_1k=0.06,
        ),
        "gpt-3.5-turbo": CostModel(
            model="gpt-3.5-turbo",
            input_cost_per_1k=0.0005,
            output_cost_per_1k=0.0015,
        ),
        "ollama/llama2": CostModel(
            model="ollama/llama2",
            input_cost_per_1k=0.0,
            output_cost_per_1k=0.0,  # Local, free
        ),
    }


class RateLimiter:
    """Rate limiting & cost tracking service"""
    
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.redis_client = self._connect_redis()
        self.config = RateLimitConfig()
    
    def _connect_redis(self) -> Optional[redis.Redis]:
        """Connect to Redis"""
        try:
            client = redis.from_url(self.redis_url)
            client.ping()
            return client
        except Exception as e:
            print(f"Warning: Redis unavailable - {e}")
            return None
    
    async def check_rate_limit(
        self,
        user_id: str,
        tier: RateLimitTier = RateLimitTier.FREE
    ) -> tuple[bool, Dict]:
        """
        Check if user has exceeded rate limit
        
        Returns:
            (allowed: bool, info: Dict)
        """
        
        if not self.redis_client:
            # Redis unavailable - allow request
            return True, {"message": "Rate limiting unavailable"}
        
        key = f"rate_limit:{user_id}"
        limit = self.config.LIMITS[tier]
        
        try:
            current = self.redis_client.incr(key)
            
            # Set expiry on first request
            if current == 1:
                self.redis_client.expire(key, 3600)  # 1 hour window
            
            if current > limit:
                return False, {
                    "message": "Rate limit exceeded",
                    "limit": limit,
                    "current": current,
                    "reset_in_seconds": self.redis_client.ttl(key)
                }
            
            return True, {
                "remaining": limit - current,
                "limit": limit,
                "reset_in_seconds": self.redis_client.ttl(key)
            }
        
        except Exception as e:
            print(f"Rate limit check error: {e}")
            return True, {"message": "Rate limit check failed"}
    
    async def track_usage(
        self,
        user_id: str,
        model: str,
        input_tokens: int,
        output_tokens: int
    ) -> Dict:
        """
        Track API usage and costs
        """
        
        if not self.redis_client:
            return {"message": "Usage tracking unavailable"}
        
        # Get pricing
        pricing = self.config.PRICING.get(model)
        if not pricing:
            return {"error": "Model not found in pricing"}
        
        # Calculate cost
        input_cost = (input_tokens / 1000) * pricing.input_cost_per_1k
        output_cost = (output_tokens / 1000) * pricing.output_cost_per_1k
        total_cost = input_cost + output_cost
        
        # Store usage
        usage_key = f"usage:{user_id}:{datetime.now().strftime('%Y-%m')}"
        self.redis_client.incr(f"{usage_key}:tokens", input_tokens + output_tokens)
        self.redis_client.incrbyfloat(f"{usage_key}:cost", total_cost)
        
        # Update monthly data
        self.redis_client.expire(usage_key, 86400 * 30)  # 30 days
        
        return {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": input_tokens + output_tokens,
            "input_cost": round(input_cost, 6),
            "output_cost": round(output_cost, 6),
            "total_cost": round(total_cost, 6),
        }
    
    async def get_usage(self, user_id: str) -> Dict:
        """Get user's current month usage"""
        
        if not self.redis_client:
            return {"error": "Usage tracking unavailable"}
        
        month = datetime.now().strftime('%Y-%m')
        usage_key = f"usage:{user_id}:{month}"
        
        try:
            total_tokens = int(self.redis_client.get(f"{usage_key}:tokens") or 0)
            total_cost = float(self.redis_client.get(f"{usage_key}:cost") or 0)
            
            return {
                "month": month,
                "total_tokens": total_tokens,
                "total_cost": round(total_cost, 2),
            }
        
        except Exception as e:
            return {"error": str(e)}
    
    async def check_cost_limit(
        self,
        user_id: str,
        tier: RateLimitTier
    ) -> tuple[bool, Dict]:
        """Check if user has exceeded monthly cost limit"""
        
        if not self.redis_client:
            return True, {"message": "Cost check unavailable"}
        
        month = datetime.now().strftime('%Y-%m')
        usage_key = f"usage:{user_id}:{month}"
        
        try:
            current_cost = float(
                self.redis_client.get(f"{usage_key}:cost") or 0
            )
            limit = self.config.COST_LIMITS[tier]
            
            if current_cost >= limit:
                return False, {
                    "message": "Monthly cost limit exceeded",
                    "limit": limit,
                    "current": round(current_cost, 2),
                }
            
            return True, {
                "remaining": round(limit - current_cost, 2),
                "limit": limit,
                "current": round(current_cost, 2),
            }
        
        except Exception as e:
            return True, {"message": "Cost check failed"}


class RateLimitMiddleware:
    """FastAPI middleware for rate limiting"""
    
    def __init__(self, limiter: RateLimiter):
        self.limiter = limiter
    
    async def __call__(self, request, call_next):
        """Check rate limit before processing request"""
        
        # Extract user ID from token (would come from auth)
        user_id = request.headers.get("X-User-ID", "anonymous")
        tier = RateLimitTier(
            request.headers.get("X-User-Tier", "free")
        )
        
        # Check rate limit
        allowed, info = await self.limiter.check_rate_limit(user_id, tier)
        
        if not allowed:
            return {
                "error": "Rate limit exceeded",
                "detail": info,
                "status_code": 429
            }
        
        # Add rate limit headers to response
        response = await call_next(request)
        response.headers["X-RateLimit-Remaining"] = str(info.get("remaining", 0))
        response.headers["X-RateLimit-Limit"] = str(info.get("limit", 0))
        
        return response


# ============================================
# Cost Dashboard
# ============================================

class CostDashboard:
    """Dashboard for cost tracking and visualization"""
    
    def __init__(self, limiter: RateLimiter):
        self.limiter = limiter
    
    async def get_user_stats(self, user_id: str) -> Dict:
        """Get user cost statistics"""
        
        usage = await self.limiter.get_usage(user_id)
        
        return {
            "user_id": user_id,
            "usage": usage,
            "breakdown": {
                "free_tier": 0,  # Ollama usage
                "paid_tier": usage.get("total_cost", 0),
            },
            "alerts": self._get_alerts(usage),
        }
    
    def _get_alerts(self, usage: Dict) -> list:
        """Generate alerts based on usage"""
        
        alerts = []
        total_cost = usage.get("total_cost", 0)
        
        if total_cost > 50:
            alerts.append({
                "level": "warning",
                "message": f"High spending: ${total_cost:.2f}"
            })
        
        if total_cost > 90:
            alerts.append({
                "level": "error",
                "message": "Approaching monthly limit"
            })
        
        return alerts


if __name__ == "__main__":
    import asyncio
    
    async def test():
        limiter = RateLimiter()
        
        # Test rate limit
        allowed, info = await limiter.check_rate_limit(
            "user-123",
            RateLimitTier.FREE
        )
        print(f"Rate limit check: {allowed}, {info}")
        
        # Test usage tracking
        usage = await limiter.track_usage(
            "user-123",
            "gpt-3.5-turbo",
            input_tokens=100,
            output_tokens=50
        )
        print(f"Usage tracked: {usage}")
        
        # Get usage stats
        stats = await limiter.get_usage("user-123")
        print(f"Usage stats: {stats}")
    
    asyncio.run(test())
