/// NeuralBrain Smart Contract for Sui
/// Distributed AI consensus engine with on-chain provenance
module neural_brain::neural_consensus {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use sui::event;
    use std::string::{Self, String};
    use std::vector;

    /// Represents an agent in the neural network
    public struct Agent has key, store {
        id: UID,
        name: String,
        controller: address,
        model_hash: vector<u8>,
        reputation: u64,
        participation_count: u64,
        active: bool,
    }

    /// Agent's current neural state (thinking)
    public struct NeuronState has key, store {
        id: UID,
        agent_id: ID,
        thought_hash: vector<u8>,
        confidence: u64,
        timestamp: u64,
        ipfs_cid: String,
    }

    /// Connection between agents (influence)
    public struct Synapse has key, store {
        id: UID,
        from_agent: ID,
        to_agent: ID,
        message_hash: vector<u8>,
        weight: u64,
        timestamp: u64,
    }

    /// A round of consensus deliberation
    public struct ConsensusRound has key, store {
        id: UID,
        topic: String,
        votes: Table<ID, vector<u8>>,
        consensus_score: u64,
        finalized: bool,
        created_at: u64,
        finalized_at: u64,
    }

    /// Central registry for agents
    public struct AgentRegistry has key {
        id: UID,
        agents: Table<ID, Agent>,
        agent_count: u64,
        admin: address,
    }

    /// Next consensus round ID counter
    public struct RoundCounter has key {
        id: UID,
        next_id: u64,
    }

    // === Events ===

    public struct AgentRegistered has copy, drop {
        agent_id: ID,
        controller: address,
        timestamp: u64,
    }

    public struct NeuralActivity has copy, drop {
        agent_id: ID,
        thought_hash: vector<u8>,
        confidence: u64,
        ipfs_cid: String,
        timestamp: u64,
    }

    public struct SynapseFormed has copy, drop {
        from_agent: ID,
        to_agent: ID,
        weight: u64,
        timestamp: u64,
    }

    public struct ConsensusFinalized has copy, drop {
        round_id: ID,
        consensus_score: u64,
        finalized: bool,
        timestamp: u64,
    }

    // === Initialization ===

    fun init(ctx: &mut TxContext) {
        let registry = AgentRegistry {
            id: object::new(ctx),
            agents: table::new(ctx),
            agent_count: 0,
            admin: tx_context::sender(ctx),
        };

        let counter = RoundCounter {
            id: object::new(ctx),
            next_id: 1,
        };

        transfer::share_object(registry);
        transfer::share_object(counter);
    }

    // === Agent Management ===

    public entry fun register_agent(
        registry: &mut AgentRegistry,
        name: String,
        model_hash: vector<u8>,
        ctx: &mut TxContext,
    ) {
        let agent = Agent {
            id: object::new(ctx),
            name,
            controller: tx_context::sender(ctx),
            model_hash,
            reputation: 1000, // Start with 100%
            participation_count: 0,
            active: true,
        };

        let agent_id = object::uid_to_inner(&agent.id);

        event::emit(AgentRegistered {
            agent_id,
            controller: tx_context::sender(ctx),
            timestamp: tx_context::epoch(ctx),
        });

        table::add(&mut registry.agents, agent_id, agent);
        registry.agent_count = registry.agent_count + 1;
    }

    public entry fun deactivate_agent(
        registry: &mut AgentRegistry,
        agent_id: ID,
        ctx: &mut TxContext,
    ) {
        assert!(registry.admin == tx_context::sender(ctx), 1001);
        let agent = table::borrow_mut(&mut registry.agents, agent_id);
        agent.active = false;
    }

    // === Neural Activity ===

    public entry fun record_neural_activity(
        registry: &AgentRegistry,
        agent_id: ID,
        thought_hash: vector<u8>,
        confidence: u64,
        ipfs_cid: String,
        ctx: &mut TxContext,
    ) {
        assert!(confidence <= 1000, 1002); // 0-1000 scale
        let _agent = table::borrow(&registry.agents, agent_id);

        let neuron = NeuronState {
            id: object::new(ctx),
            agent_id,
            thought_hash: thought_hash,
            confidence,
            timestamp: tx_context::epoch(ctx),
            ipfs_cid: ipfs_cid,
        };

        event::emit(NeuralActivity {
            agent_id,
            thought_hash,
            confidence,
            ipfs_cid,
            timestamp: tx_context::epoch(ctx),
        });

        transfer::share_object(neuron);
    }

    // === Synapses (Influence) ===

    public entry fun form_synapse(
        registry: &AgentRegistry,
        from_agent: ID,
        to_agent: ID,
        message_hash: vector<u8>,
        weight: u64,
        ctx: &mut TxContext,
    ) {
        assert!(weight <= 1000, 1003); // 0-1000 scale
        assert!(from_agent != to_agent, 1004);

        let _from = table::borrow(&registry.agents, from_agent);
        let _to = table::borrow(&registry.agents, to_agent);

        let synapse = Synapse {
            id: object::new(ctx),
            from_agent,
            to_agent,
            message_hash,
            weight,
            timestamp: tx_context::epoch(ctx),
        };

        event::emit(SynapseFormed {
            from_agent,
            to_agent,
            weight,
            timestamp: tx_context::epoch(ctx),
        });

        transfer::share_object(synapse);
    }

    // === Consensus ===

    public entry fun create_consensus_round(
        counter: &mut RoundCounter,
        topic: String,
        ctx: &mut TxContext,
    ) {
        let round_id = counter.next_id;
        counter.next_id = counter.next_id + 1;

        let consensus = ConsensusRound {
            id: object::new(ctx),
            topic,
            votes: table::new(ctx),
            consensus_score: 0,
            finalized: false,
            created_at: tx_context::epoch(ctx),
            finalized_at: 0,
        };

        transfer::share_object(consensus);
    }

    public entry fun record_vote(
        round: &mut ConsensusRound,
        agent_id: ID,
        vote_hash: vector<u8>,
    ) {
        assert!(!round.finalized, 1005);
        table::add(&mut round.votes, agent_id, vote_hash);
    }

    public entry fun finalize_consensus(
        registry: &mut AgentRegistry,
        round: &mut ConsensusRound,
        consensus_score: u64,
        ctx: &mut TxContext,
    ) {
        assert!(!round.finalized, 1005);
        assert!(consensus_score <= 1000, 1002);
        assert!(registry.admin == tx_context::sender(ctx), 1001);

        round.consensus_score = consensus_score;
        round.finalized = true;
        round.finalized_at = tx_context::epoch(ctx);

        let round_id = object::uid_to_inner(&round.id);

        event::emit(ConsensusFinalized {
            round_id,
            consensus_score,
            finalized: true,
            timestamp: tx_context::epoch(ctx),
        });

        // Reward participating agents
        if (consensus_score >= 500) {
            // Reward logic here
        }
    }

    // === View Functions ===

    public fun get_agent_count(registry: &AgentRegistry): u64 {
        registry.agent_count
    }

    public fun is_agent_active(registry: &AgentRegistry, agent_id: ID): bool {
        let agent = table::borrow(&registry.agents, agent_id);
        agent.active
    }

    public fun get_agent_reputation(registry: &AgentRegistry, agent_id: ID): u64 {
        let agent = table::borrow(&registry.agents, agent_id);
        agent.reputation
    }

    public fun get_agent_participation(registry: &AgentRegistry, agent_id: ID): u64 {
        let agent = table::borrow(&registry.agents, agent_id);
        agent.participation_count
    }
}
