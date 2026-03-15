"""
Blockchain Integration for Council Service
Extends main.py with blockchain-backed deliberation endpoints
"""

import sys
import os
from pathlib import Path

# Add neural-brain to path
neural_brain_path = Path(__file__).parent.parent / "neural-brain"
sys.path.insert(0, str(neural_brain_path))

from fastapi import HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from blockchain_core import BlockchainNeuralBrain


# ============================================
# Data Models (Extended)
# ============================================

class BlockchainDeliberationRequest(BaseModel):
    """Request for blockchain-backed deliberation"""
    topic: str = Field(..., description="Topic to deliberate")
    context: Optional[str] = Field(None, description="Additional context")
    agents: Optional[List[str]] = Field(None, description="Specific agents")
    num_agents: int = Field(default=3, ge=1, le=10)
    timeout: int = Field(default=30, ge=5, le=120)


class BlockchainDeliberationResponse(BaseModel):
    """Response from blockchain deliberation"""
    topic: str
    consensus_score: float
    consensus_reached: bool
    votes: List[dict]
    chairman_summary: str
    recommendation: Optional[str] = None
    
    # Blockchain proofs
    round_id: int
    on_chain_proof: Optional[str] = None
    arweave_proofs: Optional[dict] = None
    synapses: Optional[dict] = None
    timestamp: str


# ============================================
# Blockchain Brain Instance
# ============================================

_blockchain_brain = None


def get_blockchain_brain():
    """Get or create BlockchainNeuralBrain instance"""
    global _blockchain_brain
    if _blockchain_brain is None:
        chain = os.getenv("BLOCKCHAIN_CHAIN", "polygon")
        _blockchain_brain = BlockchainNeuralBrain(chain=chain)
    return _blockchain_brain


# ============================================
# Integration Functions (for main.py)
# ============================================

async def register_blockchain_routes(app):
    """
    Register blockchain-backed deliberation routes
    
    Call this in main.py startup:
        from council_blockchain import register_blockchain_routes
        app.add_event_handler("startup", lambda: register_blockchain_routes(app))
    """
    
    @app.post("/api/council/deliberate-blockchain", response_model=BlockchainDeliberationResponse)
    async def deliberate_blockchain(request: BlockchainDeliberationRequest):
        """
        Run council deliberation with blockchain recording
        
        Returns:
        - Consensus score and decision
        - On-chain transaction hash (Sui)
        - Arweave archive of deliberation
        - Agent influence synapses
        """
        
        if not request.topic or len(request.topic.strip()) == 0:
            raise HTTPException(status_code=400, detail="Topic cannot be empty")
        
        print(f"\n🧠 Blockchain Deliberation: {request.topic}")
        
        # Get available agents
        agents = await get_available_agents(request.num_agents)
        
        # Get blockchain brain
        brain = get_blockchain_brain()
        
        try:
            # Run blockchain-backed deliberation
            result = await brain.deliberate_with_chain(
                topic=request.topic,
                agents=agents,
                timeout=request.timeout
            )
            
            # Build agent votes
            votes = [
                {
                    "agent_id": agent_id,
                    "position": "agree" if state['confidence'] > 0.6 else "partial",
                    "confidence": state['confidence'],
                    "reasoning": state['reasoning'][:200],  # Truncate for API
                    "arweave_hash": state.get('arweave_hash')
                }
                for agent_id, state in result['agent_states'].items()
            ]
            
            # Generate chairman summary
            chairman_summary = f"Council reached {result['consensus_score']:.0%} consensus through blockchain-recorded deliberation. {len(result['agent_states'])} agents participated. All reasoning archived to Arweave with on-chain proofs."
            
            recommendation = (
                "Proceed with proposal" if result['consensus_score'] > 0.7
                else "Further deliberation recommended" if result['consensus_score'] > 0.5
                else "Reject proposal"
            )
            
            return BlockchainDeliberationResponse(
                topic=request.topic,
                consensus_score=result['consensus_score'],
                consensus_reached=result['consensus_reached'],
                votes=votes,
                chairman_summary=chairman_summary,
                recommendation=recommendation,
                round_id=result['round_id'],
                on_chain_proof=result['on_chain_proof'],
                arweave_proofs=result['arweave_proofs'],
                synapses=result['synapses'],
                timestamp=result['timestamp']
            )
        
        except Exception as e:
            print(f"❌ Blockchain deliberation failed: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/api/council/blockchain/status")
    async def blockchain_status():
        """Get blockchain integration status"""
        brain = get_blockchain_brain()
        
        return {
            "status": "ready",
            "blockchain_chain": os.getenv("BLOCKCHAIN_CHAIN", "sui"),
            "contract_address": os.getenv("BRAIN_CONTRACT_ADDRESS", "not_configured"),
            "arweave_enabled": brain.arweave is not None,
            "consensus_rounds": len(brain.consensus_rounds),
            "endpoints": {
                "deliberate": "/api/council/deliberate-blockchain",
                "history": "/api/council/blockchain/history",
                "agent-state": "/api/council/blockchain/agent-state/{agent_id}"
            }
        }
    
    @app.get("/api/council/blockchain/history")
    async def blockchain_history():
        """Get deliberation history"""
        brain = get_blockchain_brain()
        history = brain.get_consensus_history()
        
        return {
            "total_rounds": len(history),
            "rounds": history
        }
    
    @app.get("/api/council/blockchain/agent-state/{agent_id}")
    async def blockchain_agent_state(agent_id: str):
        """Get current neural state for an agent"""
        brain = get_blockchain_brain()
        state = brain.get_agent_neural_state(agent_id)
        
        if not state:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        return state


# ============================================
# Helper Functions
# ============================================

async def get_available_agents(num_agents: int = 3) -> List[dict]:
    """
    Get available agents for deliberation
    In real implementation, fetch from agent registry
    """
    
    default_agents = [
        {
            'id': 'logical_analyzer',
            'name': 'Logical Analyzer',
            'expertise': ['logic', 'consistency', 'structure'],
            'model': 'llama2'
        },
        {
            'id': 'pragmatist',
            'name': 'Pragmatist',
            'expertise': ['implementation', 'feasibility', 'resources'],
            'model': 'llama2'
        },
        {
            'id': 'devils_advocate',
            'name': "Devil's Advocate",
            'expertise': ['critique', 'edge-cases', 'risk-analysis'],
            'model': 'llama2'
        },
        {
            'id': 'ethics_advisor',
            'name': 'Ethics Advisor',
            'expertise': ['ethics', 'safety', 'fairness'],
            'model': 'mistral'
        },
        {
            'id': 'domain_expert',
            'name': 'Domain Expert',
            'expertise': ['domain-specific', 'best-practices', 'standards'],
            'model': 'neural-chat'
        }
    ]
    
    return default_agents[:num_agents]


# ============================================
# Export for main.py
# ============================================

__all__ = [
    'register_blockchain_routes',
    'BlockchainDeliberationRequest',
    'BlockchainDeliberationResponse',
    'get_blockchain_brain'
]
