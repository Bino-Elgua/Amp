<script>
	/**
	 * BlockchainProofDisplay Component
	 * Displays blockchain proofs and IPFS archives from neural deliberation
	 */

	import { onMount } from 'svelte';

	export let deliberationResult = null;
	export let showDetails = false;

	let chain = 'sui_testnet';
	let explorerUrl = '';
	let arweaveGateway = 'https://arweave.net/';

	$: if (deliberationResult?.on_chain_proof) {
		explorerUrl = getExplorerUrl(deliberationResult.on_chain_proof);
	}

	function getExplorerUrl(txHash) {
		const explorers = {
			sui_testnet: 'https://suiscan.xyz/testnet/tx/',
			sui_mainnet: 'https://suiscan.xyz/mainnet/tx/',
			polygon_mumbai: 'https://mumbai.polygonscan.com/tx/',
			polygon_mainnet: 'https://polygonscan.com/tx/',
			solana_devnet: 'https://solana.fm/tx/',
			solana_mainnet: 'https://solana.fm/tx/'
		};

		const baseUrl = explorers[chain] || explorers.sui_testnet;
		return baseUrl + txHash;
	}

	function getArweaveUrl(hash) {
		return arweaveGateway + hash;
	}

	function copyToClipboard(text) {
		navigator.clipboard.writeText(text);
	}

	function toggleDetails() {
		showDetails = !showDetails;
	}
</script>

<div class="blockchain-proof-container">
	{#if deliberationResult}
		<!-- Main Proof Display -->
		<div class="proof-card">
			<div class="proof-header">
				<h3>🧠 Neural Deliberation Complete</h3>
				<span class="badge" class:success={deliberationResult.consensus_reached}>
					{deliberationResult.consensus_score > 0.7
						? '✅ Consensus'
						: deliberationResult.consensus_score > 0.5
							? '⚠️ Partial'
							: '❌ Disagree'}
				</span>
			</div>

			<div class="consensus-score">
				<div class="score-display">
					<span class="percentage">{(deliberationResult.consensus_score * 100).toFixed(0)}%</span>
					<span class="label">Agreement</span>
				</div>
				<div class="score-bar">
					<div
						class="score-fill"
						style="width: {deliberationResult.consensus_score * 100}%"
					/>
				</div>
			</div>

			<!-- On-Chain Proof -->
			{#if deliberationResult.on_chain_proof}
				<div class="proof-section">
					<div class="section-header">
						<h4>⛓️ On-Chain Proof</h4>
						<span class="chain-badge">{chain}</span>
					</div>
					<div class="proof-content">
						<div class="proof-item">
							<span class="label">Transaction Hash:</span>
							<code class="hash">{deliberationResult.on_chain_proof.slice(0, 10)}...{deliberationResult.on_chain_proof.slice(-8)}</code>
							<button
								class="copy-btn"
								on:click={() => copyToClipboard(deliberationResult.on_chain_proof)}
								title="Copy full hash"
							>
								📋
							</button>
						</div>
						<a
							href={explorerUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="explorer-link"
						>
							View on Explorer →
						</a>
					</div>
				</div>
			{/if}

			<!-- Arweave Archives -->
			{#if deliberationResult.arweave_proofs}
				<div class="proof-section">
					<div class="section-header">
						<h4>📦 Arweave Permanent Archive</h4>
						<span class="count-badge">{Object.keys(deliberationResult.arweave_proofs.agents || {}).length} agents</span>
					</div>
					<div class="proof-content">
						{#if deliberationResult.arweave_proofs.consensus}
							<div class="proof-item">
								<span class="label">Consensus Record:</span>
								<code class="hash">{deliberationResult.arweave_proofs.consensus.slice(0, 8)}...</code>
								<a
									href={getArweaveUrl(deliberationResult.arweave_proofs.consensus)}
									target="_blank"
									rel="noopener noreferrer"
									class="arweave-link"
									title="View on Arweave"
								>
									🔗
								</a>
							</div>
						{/if}

						<div class="agent-archives">
							<span class="sub-label">Agent Reasoning (Permanent):</span>
							<ul>
								{#each Object.entries(deliberationResult.arweave_proofs.agents || {}) as [agentId, hash]}
									<li>
										<span class="agent-id">{agentId}</span>
										<code class="hash">{hash.slice(0, 8)}...</code>
										<a
											href={getArweaveUrl(hash)}
											target="_blank"
											rel="noopener noreferrer"
											class="arweave-link"
											title="View on Arweave"
										>
											🔗
										</a>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			{/if}

			<!-- Agent Votes -->
			{#if deliberationResult.votes && deliberationResult.votes.length > 0}
				<div class="proof-section">
					<div class="section-header">
						<h4>🗳️ Agent Votes</h4>
					</div>
					<div class="votes-grid">
						{#each deliberationResult.votes as vote}
							<div class="vote-card">
								<div class="vote-header">
									<span class="agent-name">{vote.agent_id}</span>
									<span class="position-badge" class:agree={vote.position === 'agree'}>
										{vote.position.toUpperCase()}
									</span>
								</div>
								<div class="confidence-bar">
									<div class="confidence-fill" style="width: {vote.confidence * 100}%" />
									<span class="confidence-label">{(vote.confidence * 100).toFixed(0)}%</span>
								</div>
								<p class="reasoning">{vote.reasoning}</p>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Synapses (Agent Influence) -->
			{#if deliberationResult.synapses && Object.keys(deliberationResult.synapses).length > 0}
				<div class="proof-section">
					<div class="section-header">
						<h4>🔗 Agent Influence Network</h4>
						<button class="toggle-btn" on:click={toggleDetails}>
							{showDetails ? '▼ Hide' : '▶ Show'} Details
						</button>
					</div>
					{#if showDetails}
						<div class="synapses-list">
							{#each Object.entries(deliberationResult.synapses) as [connection, weight]}
								<div class="synapse-item">
									<span class="connection">{connection}</span>
									<div class="weight-bar">
										<div class="weight-fill" style="width: {weight * 100}%" />
									</div>
									<span class="weight-label">{(weight * 100).toFixed(0)}%</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Summary -->
			{#if deliberationResult.chairman_summary}
				<div class="proof-section summary-section">
					<h4>📋 Summary</h4>
					<p>{deliberationResult.chairman_summary}</p>
					{#if deliberationResult.recommendation}
						<div class="recommendation">
							<strong>Recommendation:</strong> {deliberationResult.recommendation}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Metadata -->
			<div class="metadata">
				<span class="meta-item">Round: {deliberationResult.round_id}</span>
				<span class="meta-item">{new Date(deliberationResult.timestamp).toLocaleString()}</span>
			</div>
		</div>
	{:else}
		<div class="empty-state">
			<p>No deliberation results yet</p>
		</div>
	{/if}
</div>

<style>
	.blockchain-proof-container {
		width: 100%;
		max-width: 900px;
		margin: 1rem 0;
	}

	.proof-card {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		border: 2px solid #00d4ff;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1);
	}

	.proof-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid rgba(0, 212, 255, 0.3);
		padding-bottom: 1rem;
	}

	.proof-header h3 {
		margin: 0;
		color: #00d4ff;
		font-size: 1.3rem;
	}

	.badge {
		padding: 0.4rem 0.8rem;
		border-radius: 20px;
		background: #ff006e;
		color: white;
		font-weight: bold;
		font-size: 0.85rem;
	}

	.badge.success {
		background: #00d400;
	}

	.consensus-score {
		margin: 1.5rem 0;
	}

	.score-display {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.percentage {
		font-size: 2.5rem;
		font-weight: bold;
		color: #00d4ff;
	}

	.label {
		color: #888;
		font-size: 0.9rem;
	}

	.score-bar {
		width: 100%;
		height: 8px;
		background: rgba(0, 212, 255, 0.2);
		border-radius: 4px;
		overflow: hidden;
	}

	.score-fill {
		height: 100%;
		background: linear-gradient(90deg, #00d4ff, #00d400);
		transition: width 0.3s ease;
	}

	.proof-section {
		margin: 1.5rem 0;
		padding: 1rem;
		background: rgba(0, 212, 255, 0.05);
		border-left: 3px solid #00d4ff;
		border-radius: 4px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.section-header h4 {
		margin: 0;
		color: #00d4ff;
	}

	.chain-badge,
	.count-badge {
		background: rgba(0, 212, 255, 0.2);
		color: #00d4ff;
		padding: 0.3rem 0.6rem;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: bold;
	}

	.proof-content {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.proof-item {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		padding: 0.5rem;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 4px;
	}

	.proof-item .label {
		color: #888;
		flex-shrink: 0;
	}

	code.hash {
		font-family: 'Monaco', 'Courier New', monospace;
		background: rgba(0, 212, 255, 0.1);
		color: #00d4ff;
		padding: 0.3rem 0.6rem;
		border-radius: 3px;
		flex-grow: 1;
	}

	.copy-btn,
	.arweave-link {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		padding: 0.2rem 0.5rem;
		transition: transform 0.2s;
	}

	.copy-btn:hover,
	.arweave-link:hover {
		transform: scale(1.2);
	}

	.explorer-link {
		display: inline-block;
		color: #00d4ff;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border: 1px solid #00d4ff;
		border-radius: 4px;
		transition: all 0.3s;
		font-weight: bold;
	}

	.explorer-link:hover {
		background: rgba(0, 212, 255, 0.2);
		transform: translateX(4px);
	}

	.agent-archives {
		margin-top: 0.8rem;
	}

	.sub-label {
		color: #888;
		font-size: 0.85rem;
		display: block;
		margin-bottom: 0.5rem;
	}

	.agent-archives ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.agent-archives li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 3px;
	}

	.agent-id {
		color: #00d4ff;
		font-size: 0.85rem;
		font-weight: bold;
		flex-shrink: 0;
	}

	.votes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.vote-card {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(0, 212, 255, 0.3);
		padding: 1rem;
		border-radius: 8px;
	}

	.vote-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.8rem;
	}

	.agent-name {
		color: #00d4ff;
		font-weight: bold;
	}

	.position-badge {
		background: #ff006e;
		color: white;
		padding: 0.2rem 0.6rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: bold;
	}

	.position-badge.agree {
		background: #00d400;
	}

	.confidence-bar {
		position: relative;
		height: 6px;
		background: rgba(0, 212, 255, 0.2);
		border-radius: 3px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.confidence-fill {
		height: 100%;
		background: linear-gradient(90deg, #00d4ff, #00d400);
		transition: width 0.3s ease;
	}

	.confidence-label {
		font-size: 0.7rem;
		color: #888;
		margin-top: 0.2rem;
		display: block;
		text-align: right;
	}

	.reasoning {
		color: #ccc;
		font-size: 0.85rem;
		margin: 0.5rem 0 0 0;
		line-height: 1.4;
	}

	.toggle-btn {
		background: rgba(0, 212, 255, 0.2);
		color: #00d4ff;
		border: 1px solid #00d4ff;
		padding: 0.3rem 0.8rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: bold;
		transition: all 0.3s;
	}

	.toggle-btn:hover {
		background: rgba(0, 212, 255, 0.4);
	}

	.synapses-list {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.synapse-item {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}

	.connection {
		color: #888;
		font-size: 0.85rem;
		flex-shrink: 0;
		min-width: 100px;
		font-family: 'Monaco', monospace;
	}

	.weight-bar {
		flex-grow: 1;
		height: 4px;
		background: rgba(0, 212, 255, 0.2);
		border-radius: 2px;
		overflow: hidden;
	}

	.weight-fill {
		height: 100%;
		background: #00d4ff;
		transition: width 0.3s ease;
	}

	.weight-label {
		color: #00d4ff;
		font-size: 0.8rem;
		font-weight: bold;
		flex-shrink: 0;
		min-width: 35px;
		text-align: right;
	}

	.summary-section {
		border-left-color: #00d400;
	}

	.summary-section p {
		color: #ccc;
		line-height: 1.6;
		margin: 0.5rem 0;
	}

	.recommendation {
		background: rgba(0, 212, 0, 0.1);
		color: #00d400;
		padding: 0.8rem;
		border-radius: 4px;
		margin-top: 0.8rem;
		border-left: 3px solid #00d400;
	}

	.metadata {
		display: flex;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(0, 212, 255, 0.2);
		margin-top: 1rem;
		font-size: 0.8rem;
		color: #888;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		color: #888;
	}
</style>
