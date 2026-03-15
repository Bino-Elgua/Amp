"""
Test suite for blockchain neural integration
"""

import asyncio
import json
from blockchain_core import BlockchainNeuralBrain


async def test_basic_deliberation():
    """Test basic blockchain-backed deliberation"""
    print("\n=== Test 1: Basic Deliberation ===\n")
    
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
    
    result = await brain.deliberate_with_chain(
        topic="Should we implement blockchain consensus for AI systems?",
        agents=agents,
        timeout=10
    )
    
    assert result['consensus_score'] > 0
    assert result['topic'] == "Should we implement blockchain consensus for AI systems?"
    assert len(result['agent_states']) == 3
    
    print(f"✓ Consensus score: {result['consensus_score']:.2%}")
    print(f"✓ Agents participated: {len(result['agent_states'])}")
    print(f"✓ Arweave archive: {result['arweave_proofs'] is not None}")
    print(f"✓ Blockchain proof: {result['on_chain_proof'] is not None}")


async def test_synapses():
    """Test synapse (influence) formation"""
    print("\n=== Test 2: Synapse Formation ===\n")
    
    brain = BlockchainNeuralBrain()
    
    agents = [
        {'id': 'agent_a', 'expertise': ['a']},
        {'id': 'agent_b', 'expertise': ['b']},
    ]
    
    result = await brain.deliberate_with_chain(
        topic="Test topic",
        agents=agents,
        timeout=5
    )
    
    round_id = result['round_id']
    synapses = brain.synapses.get(round_id, {})
    
    print(f"✓ Round {round_id} synapses:")
    for key, weight in synapses.items():
        print(f"  {key}: {weight:.3f}")
    
    assert len(synapses) > 0


async def test_consensus_history():
    """Test consensus round history"""
    print("\n=== Test 3: Consensus History ===\n")
    
    brain = BlockchainNeuralBrain()
    
    # Run multiple deliberations
    topics = [
        "First deliberation",
        "Second deliberation",
        "Third deliberation"
    ]
    
    agents = [
        {'id': 'agent_1', 'expertise': ['logic']},
        {'id': 'agent_2', 'expertise': ['pragmatism']},
    ]
    
    for topic in topics:
        await brain.deliberate_with_chain(
            topic=topic,
            agents=agents,
            timeout=5
        )
    
    history = brain.get_consensus_history()
    
    print(f"✓ Total rounds: {len(history)}")
    for round_data in history:
        print(f"  Round {round_data.get('round_id', '?')}: {round_data['topic']}")
    
    assert len(history) >= 3


async def test_agent_neural_state():
    """Test agent neural state tracking"""
    print("\n=== Test 4: Agent Neural State ===\n")
    
    brain = BlockchainNeuralBrain()
    
    agents = [
        {'id': 'analyzer', 'expertise': ['analysis']},
        {'id': 'thinker', 'expertise': ['philosophy']},
    ]
    
    result = await brain.deliberate_with_chain(
        topic="What is consciousness?",
        agents=agents,
        timeout=5
    )
    
    for agent in agents:
        state = brain.get_agent_neural_state(agent['id'])
        if state:
            print(f"✓ {agent['id']}:")
            print(f"    Confidence: {state['confidence']:.2%}")
            print(f"    Hash: {state['reasoning_hash'][:8]}...")
            print(f"    Timestamp: {state['timestamp']}")


async def test_confidence_estimation():
    """Test confidence scoring heuristics"""
    print("\n=== Test 5: Confidence Estimation ===\n")
    
    brain = BlockchainNeuralBrain()
    
    test_cases = [
        ("This is definitely true", 0.7),  # High confidence words
        ("Maybe this could be true", 0.3),  # Low confidence words
        ("It's unclear what will happen", 0.3),  # Uncertainty
        ("This is certainly the case", 0.8),  # High confidence
        ("Generic analysis without markers", 0.7),  # Default
    ]
    
    for reasoning, expected_range in test_cases:
        confidence = brain._estimate_confidence(reasoning)
        print(f"  '{reasoning}'")
        print(f"    → {confidence:.2%}\n")


def test_consensus_round_creation():
    """Test consensus round initialization"""
    print("\n=== Test 6: Consensus Round Creation ===\n")
    
    brain = BlockchainNeuralBrain()
    
    topic = "Test consensus"
    round_id = brain._create_consensus_round(topic)
    
    assert round_id == 1
    
    round_data = brain.consensus_rounds[round_id]
    print(f"✓ Round ID: {round_id}")
    print(f"✓ Topic: {round_data['topic']}")
    print(f"✓ Created at: {round_data['created_at']}")
    
    # Create another
    round_id_2 = brain._create_consensus_round("Second topic")
    assert round_id_2 == 2


async def test_full_workflow():
    """Test complete workflow end-to-end"""
    print("\n=== Test 7: Full Workflow ===\n")
    
    brain = BlockchainNeuralBrain(chain="polygon")
    
    print("1️⃣  Initializing neural brain...")
    
    agents = [
        {
            'id': 'logic_engine',
            'expertise': ['reasoning', 'logic'],
            'model': 'llama2'
        },
        {
            'id': 'pragmatic_evaluator',
            'expertise': ['feasibility', 'implementation'],
            'model': 'mistral'
        },
        {
            'id': 'ethics_advisor',
            'expertise': ['ethics', 'risk'],
            'model': 'llama2'
        },
        {
            'id': 'domain_expert',
            'expertise': ['domain-specific', 'best-practices'],
            'model': 'neural-chat'
        }
    ]
    
    print(f"2️⃣  Summoning {len(agents)} agents...\n")
    
    result = await brain.deliberate_with_chain(
        topic="How should AI governance be structured globally?",
        agents=agents,
        timeout=15
    )
    
    print(f"\n3️⃣  Deliberation Complete!")
    print(f"   Consensus: {result['consensus_score']:.1%}")
    print(f"   Reached: {result['consensus_reached']}")
    print(f"   Agents: {len(result['agent_states'])}")
    
    print(f"\n4️⃣  Generating proofs...")
    if result['on_chain_proof']:
        print(f"   ✓ On-chain TX: {result['on_chain_proof'][:16]}...")
    
    if result['arweave_proofs']:
        print(f"   ✓ Arweave archive: {result['arweave_proofs']['consensus'][:8]}...")
        for agent_id in result['arweave_proofs']['agents']:
            print(f"     - {agent_id}")
    
    print(f"\n5️⃣  Synapse analysis...")
    round_id = result['round_id']
    synapses = brain.synapses.get(round_id, {})
    
    max_influence = max(synapses.values()) if synapses else 0
    min_influence = min(synapses.values()) if synapses else 0
    avg_influence = sum(synapses.values()) / len(synapses) if synapses else 0
    
    print(f"   Total synapses: {len(synapses)}")
    print(f"   Influence range: {min_influence:.2f} → {max_influence:.2f}")
    print(f"   Average: {avg_influence:.2f}")
    
    return result


# ============ Run Tests ============

async def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🧠  BLOCKCHAIN NEURAL INTEGRATION TEST SUITE")
    print("="*60)
    
    try:
        # Basic tests
        await test_basic_deliberation()
        await test_synapses()
        await test_consensus_history()
        await test_agent_neural_state()
        await test_confidence_estimation()
        test_consensus_round_creation()
        
        # Full workflow test
        result = await test_full_workflow()
        
        print("\n" + "="*60)
        print("✅ ALL TESTS PASSED")
        print("="*60)
        
        # Print summary JSON
        print("\n📋 RESULT SUMMARY:")
        summary = {
            'round_id': result['round_id'],
            'consensus_score': result['consensus_score'],
            'consensus_reached': result['consensus_reached'],
            'agents': len(result['agent_states']),
            'on_chain_proof': result['on_chain_proof'] is not None,
            'arweave_archive': result['arweave_proofs'] is not None,
            'timestamp': result['timestamp']
        }
        print(json.dumps(summary, indent=2, default=str))
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
