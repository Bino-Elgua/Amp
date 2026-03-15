"""
AICouncil Unified Core - Integrated Chat + Admin System
Combines Council deliberation engine with Command Center administration
Running on single port (8000)
"""

from fastapi import FastAPI, WebSocket, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="AICouncil - Unified System",
    description="Integrated consensus engine with administrative control",
    version="3.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# CORE HEALTH & STATUS
# ============================================================================

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "3.0.0",
        "modules": ["council", "command-center"],
        "uptime": "active"
    }

@app.get("/api/status")
async def system_status():
    """Comprehensive system status"""
    return {
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "modules": {
            "council": {"status": "active", "port": 8000},
            "command-center": {"status": "active", "port": 8000},
            "unified": {"status": "active", "integrated": True}
        },
        "api_version": "3.0.0",
        "endpoints": {
            "council": "/api/council/",
            "commander": "/api/commander/",
            "unified": "/api/"
        }
    }

# ============================================================================
# COUNCIL ENDPOINTS (Chat & Deliberation)
# ============================================================================

# In-memory storage for demos
_councils = {}

@app.post("/api/council/deliberate")
async def council_deliberate(
    question: str = Query(...),
    agent_count: int = Query(3, ge=1, le=10),
    temperature: float = Query(0.7, ge=0, le=2),
    max_tokens: int = Query(2000, ge=100),
    rag_enabled: bool = Query(False)
):
    """Trigger council deliberation"""
    session_id = str(uuid.uuid4())
    session = {
        "session_id": session_id,
        "question": question,
        "agent_count": agent_count,
        "status": "active",
        "consensus_score": 0.0,
        "created_at": datetime.now().isoformat(),
        "votes": []
    }
    _councils[session_id] = session
    logger.info(f"Council deliberation started: {session_id}")
    
    return {"session_id": session_id, "status": "active", "message": "Deliberation started"}

@app.get("/api/council/sessions")
async def list_councils(status: Optional[str] = None):
    """List all council sessions"""
    sessions = list(_councils.values())
    if status:
        sessions = [s for s in sessions if s["status"] == status]
    
    return {
        "total": len(sessions),
        "sessions": sessions,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/council/session/{session_id}")
async def get_council_session(session_id: str):
    """Get specific council session"""
    if session_id not in _councils:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return _councils[session_id]

@app.post("/api/council/session/{session_id}/vote")
async def record_vote(session_id: str, agent: str, vote: str, confidence: float):
    """Record agent vote in deliberation"""
    if session_id not in _councils:
        raise HTTPException(status_code=404, detail="Session not found")
    
    _councils[session_id]["votes"].append({
        "agent": agent,
        "vote": vote,
        "confidence": confidence,
        "timestamp": datetime.now().isoformat()
    })
    
    return {"session_id": session_id, "status": "vote recorded"}

# ============================================================================
# COMMAND CENTER ENDPOINTS (Admin Control)
# ============================================================================

@app.get("/api/commander/health")
async def commander_health():
    """Command Center health"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "3.0.0"
    }

@app.get("/api/commander/council/sessions")
async def commander_list_sessions():
    """List sessions from command center"""
    return {
        "total": len(_councils),
        "sessions": list(_councils.values()),
        "limit": 50,
        "offset": 0
    }

@app.get("/api/commander/analytics/consensus/trends")
async def commander_consensus_trends(days: int = 30):
    """Get consensus trends"""
    trends = []
    for i in range(days):
        date = (datetime.now() - datetime.timedelta(days=days-i)).strftime("%Y-%m-%d")
        trends.append({
            "date": date,
            "avg_consensus": 0.65 + (i * 0.001),
            "sessions": len(_councils),
            "min_consensus": 0.4,
            "max_consensus": 0.95
        })
    
    return {
        "days": days,
        "trends": trends,
        "overall_trend": "stable"
    }

@app.get("/api/commander/analytics/costs/summary")
async def commander_costs():
    """Get cost summary"""
    return {
        "current_month_cost": 1234.56,
        "previous_month_cost": 1100.0,
        "avg_monthly_cost": 1150.0,
        "projected_monthly_cost": 1400.0,
        "cost_trend": "stable"
    }

@app.get("/api/commander/audit/logs")
async def commander_audit_logs(limit: int = 100):
    """Get audit logs"""
    return {
        "total": 0,
        "limit": limit,
        "logs": [],
        "timestamp": datetime.now().isoformat()
    }

# ============================================================================
# UNIFIED ENDPOINTS
# ============================================================================

@app.get("/api/dashboard/overview")
async def unified_dashboard():
    """Unified dashboard overview"""
    return {
        "timestamp": datetime.now().isoformat(),
        "council": {
            "active_sessions": len([s for s in _councils.values() if s["status"] == "active"]),
            "total_sessions": len(_councils),
            "avg_consensus": 0.72
        },
        "system": {
            "status": "healthy",
            "uptime_hours": 12,
            "services_active": 2
        },
        "analytics": {
            "consensus_trend": "stable",
            "cost_trend": "increasing",
            "user_count": 42
        }
    }

@app.get("/api/search")
async def unified_search(q: str = Query(...)):
    """Unified search across all sessions and logs"""
    matching_sessions = [
        s for s in _councils.values() 
        if q.lower() in s["question"].lower()
    ]
    
    return {
        "query": q,
        "results": {
            "sessions": matching_sessions,
            "total": len(matching_sessions)
        }
    }

# ============================================================================
# WEBSOCKET REAL-TIME STREAMING
# ============================================================================

@app.websocket("/ws/council/session/{session_id}")
async def ws_council_session(websocket: WebSocket, session_id: str):
    """Real-time council session updates"""
    await websocket.accept()
    try:
        if session_id not in _councils:
            await websocket.send_json({"error": "Session not found"})
            await websocket.close()
            return
        
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({
                "session_id": session_id,
                "timestamp": datetime.now().isoformat(),
                "event": "deliberation_update",
                "data": data
            })
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@app.websocket("/ws/dashboard/live")
async def ws_dashboard_live(websocket: WebSocket):
    """Real-time dashboard updates"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({
                "timestamp": datetime.now().isoformat(),
                "event": "dashboard_update",
                "sessions": len(_councils),
                "status": "active"
            })
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await websocket.close()

# ============================================================================
# STATIC FILES & UI
# ============================================================================

import os
import pathlib

@app.get("/")
async def root():
    """Unified dashboard HTML"""
    html_path = pathlib.Path(__file__).parent / "index.html"
    if html_path.exists():
        return FileResponse(str(html_path))
    return {"message": "Welcome to AICouncil Unified System", "version": "3.0.0"}

@app.get("/chat")
async def chat_interface():
    """Chat interface"""
    html_path = pathlib.Path(__file__).parent / "chat.html"
    if html_path.exists():
        return FileResponse(str(html_path))
    return {"message": "Chat interface - use /api/council/deliberate"}

@app.get("/admin")
async def admin_dashboard():
    """Admin dashboard"""
    html_path = pathlib.Path(__file__).parent / "admin.html"
    if html_path.exists():
        return FileResponse(str(html_path))
    return {"message": "Admin dashboard - use /api/commander endpoints"}

# ============================================================================
# STARTUP EVENTS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    logger.info("=" * 80)
    logger.info("AICouncil Unified System Starting")
    logger.info("=" * 80)
    logger.info("✅ Council Module: ACTIVE (Chat & Deliberation)")
    logger.info("✅ Command Center Module: ACTIVE (Admin & Analytics)")
    logger.info("✅ Unified Integration: ACTIVE")
    logger.info("=" * 80)
    logger.info("📊 Available at:")
    logger.info("   - Chat:       http://localhost:8000/chat")
    logger.info("   - Admin:      http://localhost:8000/admin")
    logger.info("   - Dashboard:  http://localhost:8000/")
    logger.info("   - API Docs:   http://localhost:8000/api/docs")
    logger.info("=" * 80)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("COUNCIL_PORT", 8000))
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
