"""
Blockchain Neural Brain
Core integration between AICouncil and Sui blockchain for distributed reasoning
"""

import os
import json
import hashlib
import asyncio
from typing import Dict, List, Optional
from datetime import datetime
from dotenv import load_dotenv
import arweave
import httpx

load_dotenv()


class BlockchainNeuralBrain:
    """
    Distributed reasoning engine backed by Sui blockchain consensus
    """
    
    def __init__(self, chain: str = "sui"):
        self.chain = chain
        self.arweave = self._init_arweave()
        self.sui_rpc = self._init_sui()
        self.contract_id = os.getenv("NEURAL_BRAIN_CONTRACT_ID", "")
        
        # State management
        self.consensus_rounds: Dict = {}
        self.neural_states: Dict = {}
        self.synapses: Dict = {}
    
    def _init_arweave(self):
        """Initialize Arweave connection"""
        try:
            wallet_path = os.getenv("ARWEAVE_WALLET_PATH", None)
            if wallet_path and os.path.exists(wallet_path):
                ar = arweave.Arweave(wallet_file=wallet_path)
            else:
                ar = arweave.Arweave()
            print("✓ Arweave connected")
            return ar
        except Exception as e:
            print(f"⚠ Arweave unavailable: {e}. Using memory-only mode.")
            return None
    
    def _init_sui(self):
        """Initialize Sui RPC connection"""
        rpc_url = os.getenv("SUI_RPC_URL", "https://fullnode.testnet.sui.io:443")
        return rpc_url
    
    async def _call_sui_rpc(self, method: str, params: List = None) -> Dict:
        """Call Sui RPC endpoint"""
        if params is None:
            params = []
        
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": method,
            "params": params
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(self.sui_rpc, json=payload)
            return response.json()
    
    async def deliberate_with_chain(
        self,
        topic: str,
        agents: List[Dict],
        timeout: int = 30
    ) -> Dict:
        """
        Execute deliberation with blockchain recording
        
        Args:
            topic: The deliberation topic
            agents: List of agent configurations
            timeout: Deliberation timeout in seconds
        
        Returns:
            Deliberation result with blockchain proofs
        """
        
        print(f"\n🧠 Neural Deliberation: {topic}")
        print(f"   Agents: {len(agents)}")
        print(f"   Chain: {self.chain}")
        
        # 1. Initialize consensus round
        round_id = self._create_consensus_round(topic)
        print(f"✓ Round {round_id} initialized")
        
        # 2. Parallel agent reasoning
        agent_states = await self._run_agent_reasoning(
            topic, agents, timeout
        )
        
        # 3. Form synapses (agent influence)
        await self._calculate_synapses(agent_states)
        
        # 4. Compute consensus
        consensus_score = self._compute_consensus(agent_states)
        
        # 5. Record on blockchain
        on_chain_proof = None
        if self.contract_id:
            on_chain_proof = await self._record_to_blockchain(
                round_id, agent_states, consensus_score
            )
        
        # 6. Archive to Arweave
        arweave_proofs = None
        if self.arweave:
            arweave_proofs = await self._archive_to_arweave(
                round_id, agent_states, consensus_score
            )
        
        result = {
            'round_id': round_id,
            'topic': topic,
            'consensus_score': consensus_score,
            'consensus_reached': consensus_score >= float(
                os.getenv("CONSENSUS_THRESHOLD", "0.5")
            ),
            'agent_states': agent_states,
            'on_chain_proof': on_chain_proof,
            'arweave_proofs': arweave_proofs,
            'synapses': self.synapses.get(round_id, {}),
            'timestamp': datetime.utcnow().isoformat()
        }
        
        self.consensus_rounds[round_id] = result
        return result
    
    def _create_consensus_round(self, topic: str) -> int:
        """Create new consensus round identifier"""
        round_id = len(self.consensus_rounds) + 1
        self.consensus_rounds[round_id] = {
            'topic': topic,
            'created_at': datetime.utcnow().isoformat(),
            'agents': [],
            'finalized': False
        }
        return round_id
    
    async def _run_agent_reasoning(
        self,
        topic: str,
        agents: List[Dict],
        timeout: int
    ) -> Dict:
        """
        Run all agents in parallel and collect reasoning
        """
        print(f"\n📍 Running agent reasoning loop (timeout: {timeout}s)...")
        
        tasks = [
            self._call_agent_llm(agent, topic)
            for agent in agents
        ]
        
        try:
            results = await asyncio.wait_for(
                asyncio.gather(*tasks, return_exceptions=True),
                timeout=timeout
            )
        except asyncio.TimeoutError:
            print("⚠ Deliberation timeout reached")
            results = [None] * len(agents)
        
        agent_states = {}
        for agent, result in zip(agents, results):
            if isinstance(result, Exception):
                print(f"  ✗ {agent['id']}: {result}")
                continue
            
            agent_id = agent['id']
            
            # Hash the reasoning for blockchain
            reasoning_hash = hashlib.sha256(
                result.encode()
            ).hexdigest()
            
            agent_states[agent_id] = {
                'agent_id': agent_id,
                'reasoning': result,
                'reasoning_hash': reasoning_hash,
                'timestamp': datetime.utcnow().isoformat(),
                'arweave_hash': None,
                'confidence': self._estimate_confidence(result)
            }
            
            print(f"  ✓ {agent_id}: {reasoning_hash[:8]}...")
        
        return agent_states
    
    async def _call_agent_llm(self, agent: Dict, topic: str) -> str:
        """
        Call agent's LLM for reasoning
        
        In real implementation, this would call actual LLM endpoints
        """
        # Mock implementation
        agent_id = agent['id']
        expertise = agent.get('expertise', ['general'])
        
        mock_response = (
            f"[Agent {agent_id}] Based on {expertise} expertise, "
            f"analyzing '{topic}'... I believe the following "
            f"key points are relevant... (full reasoning would be here)"
        )
        
        # Simulate network delay
        await asyncio.sleep(0.1)
        
        return mock_response
    
    async def _calculate_synapses(self, agent_states: Dict) -> Dict:
        """
        Calculate influence between agents (synapses)
        """
        print(f"\n🔗 Forming synapses...")
        
        synapses = {}
        agent_ids = list(agent_states.keys())
        
        for i, from_agent in enumerate(agent_ids):
            for to_agent in agent_ids:
                if from_agent == to_agent:
                    continue
                
                # Simple influence metric (in reality: embedding similarity)
                influence = 0.5 + (i * 0.1) % 0.3  # Mock calculation
                
                key = f"{from_agent}->{to_agent}"
                synapses[key] = influence
        
        # Store for this round
        round_id = len(self.consensus_rounds)
        self.synapses[round_id] = synapses
        
        return synapses
    
    def _compute_consensus(self, agent_states: Dict) -> float:
        """
        Compute consensus score from agent confidences
        """
        if not agent_states:
            return 0.0
        
        confidences = [
            state['confidence']
            for state in agent_states.values()
        ]
        
        consensus = sum(confidences) / len(confidences)
        print(f"   Consensus score: {consensus:.2%}")
        
        return consensus
    
    def _estimate_confidence(self, reasoning: str) -> float:
        """
        Estimate confidence from reasoning text
        (Simple heuristic; could use ML embeddings)
        """
        high_confidence_words = ['definitely', 'clearly', 'certainly', 'proven']
        low_confidence_words = ['maybe', 'possibly', 'unclear', 'uncertain']
        
        text_lower = reasoning.lower()
        
        high_score = sum(
            text_lower.count(word) for word in high_confidence_words
        )
        low_score = sum(
            text_lower.count(word) for word in low_confidence_words
        )
        
        # Default to 0.7 confidence
        confidence = 0.7 + (high_score - low_score) * 0.05
        return max(0.0, min(1.0, confidence))
    
    async def _record_to_blockchain(
        self,
        round_id: int,
        agent_states: Dict,
        consensus_score: float
    ) -> Optional[str]:
        """
        Record deliberation to Sui blockchain
        """
        if not self.contract_id:
            print("   ⚠ Contract ID not configured. Skipping blockchain record.")
            return None
        
        print(f"\n⛓️  Recording to Sui blockchain...")
        
        try:
            # Prepare vote hashes for Sui
            vote_hashes = [
                state['reasoning_hash']
                for state in agent_states.values()
            ]
            
            # In production: Call Sui move function via transaction
            # For now: Log the intent
            print(f"   Sui Contract: {self.contract_id}")
            print(f"   Round ID: {round_id}")
            print(f"   Consensus Score: {consensus_score:.2%}")
            print(f"   Votes: {len(vote_hashes)}")
            
            # Return a simulated Sui transaction digest
            tx_digest = f"Sui_tx_{round_id}_{int(consensus_score * 100)}"
            return tx_digest
        
        except Exception as e:
            print(f"   ⚠ Blockchain recording failed: {e}")
            return None
    
    async def _archive_to_arweave(
        self,
        round_id: int,
        agent_states: Dict,
        consensus_score: float
    ) -> Optional[Dict]:
        """
        Archive deliberation to Arweave
        """
        if not self.arweave:
            return None
        
        print(f"\n📦 Archiving to Arweave...")
        
        try:
            # Archive each agent's thinking
            agent_hashes = {}
            for agent_id, state in agent_states.items():
                arweave_data = {
                    'agent_id': agent_id,
                    'reasoning': state['reasoning'],
                    'confidence': state['confidence'],
                    'timestamp': state['timestamp']
                }
                
                # Post to Arweave
                tx = self.arweave.create_transaction(
                    data=json.dumps(arweave_data),
                    tags={
                        'Content-Type': 'application/json',
                        'Council': 'AICouncil',
                        'Agent': agent_id,
                        'Round': str(round_id)
                    }
                )
                self.arweave.sign_transaction(tx)
                self.arweave.send_transaction(tx)
                
                agent_hashes[agent_id] = tx.id
                state['arweave_hash'] = tx.id
                
                print(f"   ✓ {agent_id}: {tx.id[:8]}...")
            
            # Archive consensus record
            consensus_data = {
                'round_id': round_id,
                'consensus_score': consensus_score,
                'agent_hashes': agent_hashes,
                'timestamp': datetime.utcnow().isoformat()
            }
            
            consensus_tx = self.arweave.create_transaction(
                data=json.dumps(consensus_data),
                tags={
                    'Content-Type': 'application/json',
                    'Council': 'AICouncil',
                    'Type': 'Consensus',
                    'Round': str(round_id)
                }
            )
            self.arweave.sign_transaction(consensus_tx)
            self.arweave.send_transaction(consensus_tx)
            
            print(f"   ✓ Consensus record: {consensus_tx.id[:8]}...")
            
            return {
                'agents': agent_hashes,
                'consensus': consensus_tx.id
            }
        
        except Exception as e:
            print(f"   ⚠ Arweave archival failed: {e}")
            return None
    
    def get_consensus_history(self) -> List[Dict]:
        """Retrieve historical consensus rounds"""
        return list(self.consensus_rounds.values())
    
    def get_agent_neural_state(self, agent_id: str) -> Optional[Dict]:
        """Get current neural state for an agent"""
        for round_id, round_data in self.consensus_rounds.items():
            for state in round_data.get('agent_states', {}).values():
                if state.get('agent_id') == agent_id:
                    return state
        return None


# Utility functions

def create_blockchain_brain(chain: str = "solana") -> BlockchainNeuralBrain:
    """Factory function"""
    return BlockchainNeuralBrain(chain=chain)


if __name__ == "__main__":
    # Test
    import asyncio
    
    brain = BlockchainNeuralBrain(chain="polygon")
    
    agents = [
        {
            'id': 'logical_analyzer',
            'expertise': ['logic', 'consistency'],
            'model': 'llama2'
        },
        {
            'id': 'pragmatist',
            'expertise': ['implementation', 'feasibility'],
            'model': 'llama2'
        },
        {
            'id': 'devils_advocate',
            'expertise': ['critique', 'edge-cases'],
            'model': 'llama2'
        }
    ]
    
    result = asyncio.run(
        brain.deliberate_with_chain(
            topic="Should we adopt blockchain for consensus?",
            agents=agents,
            timeout=10
        )
    )
    
    print("\n=== Deliberation Complete ===")
    print(json.dumps(result, indent=2, default=str))
