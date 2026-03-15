"""Council operations handlers"""

from typing import Optional, Dict, Any, List
from datetime import datetime
import logging
import uuid

logger = logging.getLogger(__name__)

# In-memory storage (replace with DB in production)
_sessions = {}
_agents = {}


async def trigger_deliberation(request: Any) -> Dict[str, Any]:
    """Trigger a new council deliberation"""
    session_id = str(uuid.uuid4())
    
    session = {
        "session_id": session_id,
        "status": "active",
        "question": request.question,
        "agent_count": request.agent_count,
        "consensus_score": 0.0,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "votes": [],
        "summary": None,
        "context": request.context,
        "rag_enabled": request.rag_enabled,
    }
    
    _sessions[session_id] = session
    logger.info(f"Deliberation triggered: {session_id}")
    
    return {
        "session_id": session_id,
        "status": "active",
        "message": "Deliberation started"
    }


async def get_session(session_id: str) -> Dict[str, Any]:
    """Get session details"""
    if session_id not in _sessions:
        return {"error": "Session not found"}, 404
    
    return _sessions[session_id]


async def list_sessions(status: Optional[str] = None, limit: int = 50, offset: int = 0) -> Dict[str, Any]:
    """List council sessions"""
    sessions = list(_sessions.values())
    
    if status:
        sessions = [s for s in sessions if s["status"] == status]
    
    sessions.sort(key=lambda x: x["created_at"], reverse=True)
    paginated = sessions[offset:offset+limit]
    
    return {
        "total": len(sessions),
        "limit": limit,
        "offset": offset,
        "sessions": paginated
    }


async def pause_session(session_id: str) -> Dict[str, Any]:
    """Pause an active deliberation"""
    if session_id not in _sessions:
        return {"error": "Session not found"}, 404
    
    _sessions[session_id]["status"] = "paused"
    _sessions[session_id]["updated_at"] = datetime.now()
    
    logger.info(f"Session paused: {session_id}")
    return {"session_id": session_id, "status": "paused"}


async def resume_session(session_id: str) -> Dict[str, Any]:
    """Resume a paused deliberation"""
    if session_id not in _sessions:
        return {"error": "Session not found"}, 404
    
    _sessions[session_id]["status"] = "active"
    _sessions[session_id]["updated_at"] = datetime.now()
    
    logger.info(f"Session resumed: {session_id}")
    return {"session_id": session_id, "status": "active"}


async def cancel_session(session_id: str) -> Dict[str, Any]:
    """Cancel a session"""
    if session_id not in _sessions:
        return {"error": "Session not found"}, 404
    
    _sessions[session_id]["status"] = "cancelled"
    _sessions[session_id]["updated_at"] = datetime.now()
    
    logger.info(f"Session cancelled: {session_id}")
    return {"session_id": session_id, "status": "cancelled"}


async def get_transcript(session_id: str) -> Dict[str, Any]:
    """Get full deliberation transcript"""
    if session_id not in _sessions:
        return {"error": "Session not found"}, 404
    
    session = _sessions[session_id]
    return {
        "session_id": session_id,
        "question": session["question"],
        "votes": session["votes"],
        "summary": session["summary"],
        "consensus_score": session["consensus_score"]
    }


async def interrupt_session(session_id: str) -> Dict[str, Any]:
    """Force halt a deliberation"""
    if session_id not in _sessions:
        return {"error": "Session not found"}, 404
    
    _sessions[session_id]["status"] = "interrupted"
    _sessions[session_id]["updated_at"] = datetime.now()
    
    logger.info(f"Session interrupted: {session_id}")
    return {"session_id": session_id, "status": "interrupted"}


async def list_agents() -> Dict[str, Any]:
    """List all council agents"""
    return {
        "agents": list(_agents.values()),
        "total": len(_agents)
    }


async def register_agent(config: Any) -> Dict[str, Any]:
    """Register a custom agent"""
    agent_id = str(uuid.uuid4())
    
    agent = {
        "agent_id": agent_id,
        "name": config.name,
        "role": config.role,
        "model": config.model,
        "system_prompt": config.system_prompt,
        "temperature": config.temperature,
        "enabled": config.enabled,
        "created_at": datetime.now(),
        "performance_score": 0.0
    }
    
    _agents[agent_id] = agent
    logger.info(f"Agent registered: {agent_id}")
    
    return {"agent_id": agent_id, "status": "registered"}


async def get_agent(agent_id: str) -> Dict[str, Any]:
    """Get agent details"""
    if agent_id not in _agents:
        return {"error": "Agent not found"}, 404
    
    return _agents[agent_id]


async def update_agent(agent_id: str, config: Any) -> Dict[str, Any]:
    """Update agent configuration"""
    if agent_id not in _agents:
        return {"error": "Agent not found"}, 404
    
    agent = _agents[agent_id]
    agent.update({
        "name": config.name,
        "model": config.model,
        "system_prompt": config.system_prompt,
        "temperature": config.temperature,
        "enabled": config.enabled,
    })
    
    logger.info(f"Agent updated: {agent_id}")
    return {"agent_id": agent_id, "status": "updated"}


async def delete_agent(agent_id: str) -> Dict[str, Any]:
    """Remove an agent"""
    if agent_id not in _agents:
        return {"error": "Agent not found"}, 404
    
    del _agents[agent_id]
    logger.info(f"Agent deleted: {agent_id}")
    return {"agent_id": agent_id, "status": "deleted"}


async def test_agent(agent_id: str, test_prompt: str) -> Dict[str, Any]:
    """Test an agent with a prompt"""
    if agent_id not in _agents:
        return {"error": "Agent not found"}, 404
    
    # Simulate agent test
    return {
        "agent_id": agent_id,
        "test_prompt": test_prompt,
        "response": f"Test response from {_agents[agent_id]['name']}",
        "status": "success"
    }


async def get_agent_performance(agent_id: str) -> Dict[str, Any]:
    """Get agent performance metrics"""
    if agent_id not in _agents:
        return {"error": "Agent not found"}, 404
    
    agent = _agents[agent_id]
    return {
        "agent_id": agent_id,
        "name": agent["name"],
        "performance_score": agent.get("performance_score", 0.0),
        "decisions_made": 42,
        "accuracy": 0.92,
        "avg_confidence": 0.87,
        "trend": "improving"
    }


async def enable_agent(agent_id: str) -> Dict[str, Any]:
    """Enable an agent"""
    if agent_id not in _agents:
        return {"error": "Agent not found"}, 404
    
    _agents[agent_id]["enabled"] = True
    return {"agent_id": agent_id, "status": "enabled"}


async def disable_agent(agent_id: str) -> Dict[str, Any]:
    """Disable an agent"""
    if agent_id not in _agents:
        return {"error": "Agent not found"}, 404
    
    _agents[agent_id]["enabled"] = False
    return {"agent_id": agent_id, "status": "disabled"}


async def get_agent_history(agent_id: str, limit: int) -> Dict[str, Any]:
    """Get agent decision history"""
    if agent_id not in _agents:
        return {"error": "Agent not found"}, 404
    
    return {
        "agent_id": agent_id,
        "decisions": [],
        "total": 0
    }


async def recompute_consensus(session_id: str) -> Dict[str, Any]:
    """Recompute consensus scores"""
    if session_id not in _sessions:
        return {"error": "Session not found"}, 404
    
    # Simulate consensus recomputation
    _sessions[session_id]["consensus_score"] = 0.75
    return {
        "session_id": session_id,
        "consensus_score": 0.75,
        "status": "recomputed"
    }


async def get_consensus_metrics(session_id: Optional[str] = None) -> Dict[str, Any]:
    """Get current consensus metrics"""
    if session_id:
        if session_id not in _sessions:
            return {"error": "Session not found"}, 404
        
        session = _sessions[session_id]
        return {
            "session_id": session_id,
            "consensus_score": session.get("consensus_score", 0.0),
            "agent_count": session.get("agent_count", 0),
            "disagreement_level": 0.25
        }
    
    return {
        "global_consensus_avg": 0.72,
        "sessions_analyzed": len(_sessions),
        "trending": "stable"
    }


async def set_consensus_threshold(threshold: float) -> Dict[str, Any]:
    """Adjust consensus threshold"""
    return {
        "threshold": threshold,
        "status": "updated",
        "message": f"Consensus threshold set to {threshold}"
    }


async def override_vote(session_id: str, agent_id: str, new_vote: str) -> Dict[str, Any]:
    """Admin override a vote"""
    if session_id not in _sessions:
        return {"error": "Session not found"}, 404
    
    logger.warning(f"Vote overridden in {session_id} for agent {agent_id}")
    return {
        "session_id": session_id,
        "agent_id": agent_id,
        "new_vote": new_vote,
        "status": "overridden"
    }


async def list_disagreements(threshold: float) -> Dict[str, Any]:
    """List high-disagreement sessions"""
    disagreements = []
    for session_id, session in _sessions.items():
        if session.get("consensus_score", 100) < (100 - threshold):
            disagreements.append({
                "session_id": session_id,
                "consensus_score": session.get("consensus_score", 0),
                "question": session["question"]
            })
    
    return {
        "threshold": threshold,
        "disagreements": disagreements,
        "total": len(disagreements)
    }
