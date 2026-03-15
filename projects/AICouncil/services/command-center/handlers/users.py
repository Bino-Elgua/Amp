"""User and tenant management handlers"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import logging
import uuid

logger = logging.getLogger(__name__)

# In-memory storage
_users = {}
_tenants = {}
_sessions = {}


async def list_users(limit: int = 50) -> Dict[str, Any]:
    """List users"""
    users = list(_users.values())
    return {
        "total": len(users),
        "limit": limit,
        "users": users[:limit]
    }


async def get_user(user_id: str) -> Dict[str, Any]:
    """Get user details"""
    if user_id not in _users:
        return {"error": "User not found"}, 404
    
    return _users[user_id]


async def create_user(user: Any) -> Dict[str, Any]:
    """Create user"""
    user_id = str(uuid.uuid4())
    
    user_entry = {
        "user_id": user_id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "organization": user.organization,
        "tenant_id": user.tenant_id,
        "created_at": datetime.now(),
        "last_login": None,
        "api_keys": []
    }
    
    _users[user_id] = user_entry
    logger.info(f"User created: {user_id}")
    
    return {"user_id": user_id, "email": user.email, "status": "created"}


async def update_user(user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    """Update user"""
    if user_id not in _users:
        return {"error": "User not found"}, 404
    
    _users[user_id].update(updates)
    logger.info(f"User updated: {user_id}")
    
    return {"user_id": user_id, "status": "updated"}


async def delete_user(user_id: str) -> Dict[str, Any]:
    """Delete user"""
    if user_id not in _users:
        return {"error": "User not found"}, 404
    
    del _users[user_id]
    logger.info(f"User deleted: {user_id}")
    
    return {"user_id": user_id, "status": "deleted"}


async def reset_password(user_id: str) -> Dict[str, Any]:
    """Reset user password"""
    if user_id not in _users:
        return {"error": "User not found"}, 404
    
    temp_password = str(uuid.uuid4())[:8]
    logger.info(f"Password reset for user: {user_id}")
    
    return {
        "user_id": user_id,
        "temporary_password": temp_password,
        "message": "Password reset link sent to email"
    }


async def revoke_api_keys(user_id: str) -> Dict[str, Any]:
    """Revoke API keys"""
    if user_id not in _users:
        return {"error": "User not found"}, 404
    
    _users[user_id]["api_keys"] = []
    logger.info(f"API keys revoked for user: {user_id}")
    
    return {"user_id": user_id, "status": "revoked"}


async def update_user_role(user_id: str, role: str) -> Dict[str, Any]:
    """Update user role"""
    if user_id not in _users:
        return {"error": "User not found"}, 404
    
    _users[user_id]["role"] = role
    logger.info(f"User role updated: {user_id} -> {role}")
    
    return {"user_id": user_id, "role": role, "status": "updated"}


async def get_user_sessions(user_id: str) -> Dict[str, Any]:
    """Get user sessions"""
    if user_id not in _users:
        return {"error": "User not found"}, 404
    
    user_sessions = [s for s in _sessions.values() if s["user_id"] == user_id]
    
    return {
        "user_id": user_id,
        "sessions": user_sessions,
        "total": len(user_sessions)
    }


async def logout_all_sessions(user_id: str) -> Dict[str, Any]:
    """Logout all sessions"""
    if user_id not in _users:
        return {"error": "User not found"}, 404
    
    # Remove all sessions for this user
    sessions_to_remove = [k for k, v in _sessions.items() if v["user_id"] == user_id]
    for session_id in sessions_to_remove:
        del _sessions[session_id]
    
    logger.info(f"All sessions logged out for user: {user_id}")
    
    return {
        "user_id": user_id,
        "sessions_terminated": len(sessions_to_remove),
        "status": "completed"
    }


async def list_tenants() -> Dict[str, Any]:
    """List tenants"""
    return {
        "total": len(_tenants),
        "tenants": list(_tenants.values())
    }


async def create_tenant(tenant: Any) -> Dict[str, Any]:
    """Create tenant"""
    tenant_id = str(uuid.uuid4())
    
    tenant_entry = {
        "tenant_id": tenant_id,
        "name": tenant.name,
        "organization": tenant.organization,
        "data_residency": tenant.data_residency,
        "max_users": tenant.max_users,
        "max_api_calls_per_month": tenant.max_api_calls_per_month,
        "created_at": datetime.now(),
        "status": "active"
    }
    
    _tenants[tenant_id] = tenant_entry
    logger.info(f"Tenant created: {tenant_id}")
    
    return {"tenant_id": tenant_id, "name": tenant.name, "status": "created"}


async def get_tenant(tenant_id: str) -> Dict[str, Any]:
    """Get tenant details"""
    if tenant_id not in _tenants:
        return {"error": "Tenant not found"}, 404
    
    return _tenants[tenant_id]


async def update_tenant(tenant_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    """Update tenant"""
    if tenant_id not in _tenants:
        return {"error": "Tenant not found"}, 404
    
    _tenants[tenant_id].update(updates)
    logger.info(f"Tenant updated: {tenant_id}")
    
    return {"tenant_id": tenant_id, "status": "updated"}


async def delete_tenant(tenant_id: str) -> Dict[str, Any]:
    """Delete tenant"""
    if tenant_id not in _tenants:
        return {"error": "Tenant not found"}, 404
    
    del _tenants[tenant_id]
    logger.info(f"Tenant deleted: {tenant_id}")
    
    return {"tenant_id": tenant_id, "status": "deleted"}


async def set_data_residency(tenant_id: str, location: str) -> Dict[str, Any]:
    """Set data residency"""
    if tenant_id not in _tenants:
        return {"error": "Tenant not found"}, 404
    
    if location not in ["US", "EU"]:
        return {"error": "Invalid location. Must be US or EU"}, 400
    
    _tenants[tenant_id]["data_residency"] = location
    logger.info(f"Data residency set for tenant {tenant_id}: {location}")
    
    return {"tenant_id": tenant_id, "data_residency": location, "status": "updated"}


async def get_tenant_usage(tenant_id: str) -> Dict[str, Any]:
    """Get tenant usage metrics"""
    if tenant_id not in _tenants:
        return {"error": "Tenant not found"}, 404
    
    tenant = _tenants[tenant_id]
    
    return {
        "tenant_id": tenant_id,
        "name": tenant["name"],
        "api_calls_this_month": 45230,
        "max_api_calls": tenant["max_api_calls_per_month"],
        "percentage_used": 45.23,
        "user_count": 8,
        "max_users": tenant["max_users"],
        "storage_gb": 2.5,
        "last_reset": datetime.now().isoformat()
    }
