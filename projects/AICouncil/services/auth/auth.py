"""
Supabase Authentication Service
Task 13: User accounts & multi-tenancy
"""

import os
from typing import Optional, Dict, List
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr, Field
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.security import OAuth2PasswordBearer, HTTPBearer
from fastapi.responses import JSONResponse
import jwt
import httpx


# ============================================
# Configuration
# ============================================

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://project.supabase.co")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret")
JWT_EXPIRY = int(os.getenv("JWT_EXPIRY", "86400"))  # 24 hours


# ============================================
# Data Models
# ============================================

class User(BaseModel):
    """User profile"""
    id: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    is_admin: bool = False


class SignUpRequest(BaseModel):
    """Sign up request"""
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: Optional[str] = None


class LoginRequest(BaseModel):
    """Login request"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Auth token response"""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int
    user: User


class OAuthCallback(BaseModel):
    """OAuth callback data"""
    provider: str  # 'github', 'google', etc.
    code: str
    state: Optional[str] = None


# ============================================
# FastAPI App
# ============================================

app = FastAPI(
    title="AICouncil Auth Service",
    description="Multi-tenant authentication & user management",
    version="0.1.0"
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


# ============================================
# Authentication Functions
# ============================================

async def verify_token(token: str = Depends(oauth2_scheme)) -> Dict:
    """Verify JWT token"""
    
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return payload
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def create_access_token(user_id: str, email: str) -> str:
    """Create JWT access token"""
    
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(seconds=JWT_EXPIRY),
        "iat": datetime.utcnow(),
    }
    
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token


# ============================================
# Endpoints
# ============================================

@app.get("/health")
async def health():
    """Health check"""
    return {
        "status": "healthy",
        "service": "auth",
        "supabase": "connected" if SUPABASE_URL else "not configured"
    }


@app.post("/auth/signup", response_model=TokenResponse)
async def signup(request: SignUpRequest):
    """Register new user"""
    
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise HTTPException(
            status_code=503,
            detail="Authentication not configured"
        )
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SUPABASE_URL}/auth/v1/signup",
                headers={
                    "apikey": SUPABASE_ANON_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "email": request.email,
                    "password": request.password,
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get("message", "Sign up failed")
                )
            
            user_data = response.json()
            user_id = user_data["user"]["id"]
            
            # Create access token
            token = create_access_token(user_id, request.email)
            
            return TokenResponse(
                access_token=token,
                refresh_token=user_data.get("session", {}).get("refresh_token"),
                expires_in=JWT_EXPIRY,
                user=User(
                    id=user_id,
                    email=request.email,
                    full_name=request.full_name,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                )
            )
    
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Auth service error: {e}")


@app.post("/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Login user"""
    
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise HTTPException(status_code=503, detail="Auth not configured")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
                headers={
                    "apikey": SUPABASE_ANON_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "email": request.email,
                    "password": request.password,
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid email or password"
                )
            
            user_data = response.json()
            user_id = user_data["user"]["id"]
            
            # Create custom JWT
            token = create_access_token(user_id, request.email)
            
            return TokenResponse(
                access_token=token,
                refresh_token=user_data.get("refresh_token"),
                expires_in=JWT_EXPIRY,
                user=User(
                    id=user_id,
                    email=request.email,
                    full_name=user_data["user"].get("user_metadata", {}).get("full_name"),
                    created_at=datetime.fromisoformat(user_data["user"]["created_at"]),
                    updated_at=datetime.fromisoformat(user_data["user"]["updated_at"]),
                )
            )
    
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Auth service error: {e}")


@app.post("/auth/oauth/callback")
async def oauth_callback(request: OAuthCallback):
    """OAuth provider callback"""
    
    # TODO: Phase 4 - Implement OAuth flow
    # For now, return mock response
    
    return {
        "status": "oauth_flow_started",
        "provider": request.provider,
        "message": "Complete OAuth flow in browser"
    }


@app.get("/auth/me")
async def get_current_user(token_data: Dict = Depends(verify_token)):
    """Get current user info"""
    
    return {
        "user_id": token_data.get("sub"),
        "email": token_data.get("email"),
    }


@app.post("/auth/logout")
async def logout(token_data: Dict = Depends(verify_token)):
    """Logout user"""
    
    # In production: blacklist token in Redis
    return {"message": "Logged out successfully"}


@app.get("/auth/users", dependencies=[Depends(verify_token)])
async def list_users(token_data: Dict = Depends(verify_token)):
    """List users (admin only)"""
    
    # Check if user is admin
    # TODO: Phase 4 - Implement role checking
    
    return {
        "users": [],
        "total": 0,
    }


@app.get("/auth/profile")
async def get_profile(token_data: Dict = Depends(verify_token)):
    """Get user profile"""
    
    user_id = token_data.get("sub")
    
    return {
        "id": user_id,
        "email": token_data.get("email"),
        "preferences": {
            "theme": "dark",
            "notifications": True,
        },
        "usage": {
            "api_calls": 0,
            "total_cost": 0.0,
        }
    }


@app.put("/auth/profile")
async def update_profile(
    updates: Dict,
    token_data: Dict = Depends(verify_token)
):
    """Update user profile"""
    
    user_id = token_data.get("sub")
    
    # TODO: Phase 4 - Persist to database
    
    return {
        "message": "Profile updated",
        "user_id": user_id,
        "updates": updates
    }


# ============================================
# Error Handlers
# ============================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8002,
        log_level="info"
    )
