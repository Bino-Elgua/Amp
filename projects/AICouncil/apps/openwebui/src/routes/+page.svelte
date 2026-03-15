<script>
	import { onMount } from 'svelte';
	import BlockchainProofDisplay from '$lib/BlockchainProofDisplay.svelte';

	let messages = [];
	let inputValue = '';
	let isLoading = false;
	let useBlockchainMode = false;
	let blockchainResult = null;
	let messagesContainer;

	// Available agents
	let numAgents = 3;
	const agentOptions = [1, 2, 3, 4, 5];

	onMount(() => {
		// Load initial message
		messages = [
			{
				id: 1,
				role: 'assistant',
				content: '🏛️ Welcome to AICouncil! Ask me anything and I\'ll gather consensus from multiple agents.',
				timestamp: new Date()
			}
		];
	});

	async function handleSubmit() {
		if (!inputValue.trim()) return;

		const userMessage = {
			id: messages.length + 1,
			role: 'user',
			content: inputValue,
			timestamp: new Date()
		};

		messages = [...messages, userMessage];
		inputValue = '';
		isLoading = true;
		blockchainResult = null;

		// Scroll to bottom
		setTimeout(() => {
			if (messagesContainer) {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}
		}, 0);

		try {
			const endpoint = useBlockchainMode
				? '/api/council/deliberate-blockchain'
				: '/api/council/deliberate';

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					topic: userMessage.content,
					num_agents: numAgents,
					timeout: 30
				})
			});

			if (!response.ok) {
				throw new Error(`API error: ${response.statusText}`);
			}

			const data = await response.json();

			if (useBlockchainMode) {
				blockchainResult = data;
				const summary = data.chairman_summary || 'Council deliberation complete.';
				const assistantMessage = {
					id: messages.length + 1,
					role: 'assistant',
					content: summary,
					timestamp: new Date(),
					isBlockchain: true,
					data: data
				};
				messages = [...messages, assistantMessage];
			} else {
				const assistantMessage = {
					id: messages.length + 1,
					role: 'assistant',
					content: data.chairman_summary || 'Council deliberation complete.',
					timestamp: new Date(),
					votes: data.votes,
					consensusScore: data.consensus_score
				};
				messages = [...messages, assistantMessage];
			}
		} catch (error) {
			const errorMessage = {
				id: messages.length + 1,
				role: 'assistant',
				content: `❌ Error: ${error.message}`,
				timestamp: new Date(),
				isError: true
			};
			messages = [...messages, errorMessage];
		} finally {
			isLoading = false;
			setTimeout(() => {
				if (messagesContainer) {
					messagesContainer.scrollTop = messagesContainer.scrollHeight;
				}
			}, 0);
		}
	}

	function handleKeydown(e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}

	function toggleBlockchainMode() {
		useBlockchainMode = !useBlockchainMode;
		blockchainResult = null;
	}
</script>

<div class="chat-container">
	<!-- Header -->
	<div class="chat-header">
		<div class="header-content">
			<h1>🏛️ AICouncil</h1>
			<p>Distributed Epistemic Consensus Engine</p>
		</div>
		<div class="header-status">
			<span class="mode-badge" class:blockchain={useBlockchainMode}>
				{useBlockchainMode ? '⛓️ Blockchain Mode' : '💬 Regular Mode'}
			</span>
		</div>
	</div>

	<!-- Messages Area -->
	<div class="messages-wrapper" bind:this={messagesContainer}>
		<div class="messages">
			{#each messages as message (message.id)}
				<div class="message-group" class:user={message.role === 'user'}>
					<div class="message-content">
						<div class="message-bubble" class:user={message.role === 'user'} class:error={message.isError}>
							{@html message.content.replace(/\n/g, '<br>')}
						</div>

						{#if message.votes && message.votes.length > 0}
							<div class="votes-summary">
								<div class="consensus-badge">
									<span class="score">{(message.consensusScore * 100).toFixed(0)}%</span>
									<span class="label">Consensus</span>
								</div>
								<div class="votes-list">
									{#each message.votes as vote}
										<div class="vote-item">
											<span class="agent-id">{vote.agent_id}</span>
											<span class="position {vote.position}">{vote.position.toUpperCase()}</span>
											<span class="confidence">{(vote.confidence * 100).toFixed(0)}%</span>
										</div>
									{/each}
								</div>
							</div>
						{/if}

						{#if message.isBlockchain && blockchainResult}
							<div class="blockchain-proof-wrapper">
								<BlockchainProofDisplay deliberationResult={blockchainResult} />
							</div>
						{/if}
					</div>
					<div class="message-time">
						{message.timestamp.toLocaleTimeString()}
					</div>
				</div>
			{/each}

			{#if isLoading}
				<div class="message-group">
					<div class="message-content">
						<div class="message-bubble loading">
							<span class="loader"></span>
							<span>Council deliberating...</span>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Input Area -->
	<div class="input-area">
		<!-- Mode and Agent Controls -->
		<div class="controls">
			<div class="mode-control">
				<label class="blockchain-toggle">
					<input type="checkbox" bind:checked={useBlockchainMode} />
					<span>🧠 Blockchain Mode</span>
				</label>
				<p class="mode-description">
					{#if useBlockchainMode}
						Records consensus on blockchain with permanent archival
					{:else}
						Regular AI consensus without blockchain recording
					{/if}
				</p>
			</div>

			<div class="agent-control">
				<label for="agent-count">Agents ({numAgents})</label>
				<div class="agent-buttons">
					{#each agentOptions as num}
						<button
							class="agent-btn {num === numAgents ? 'active' : ''}"
							on:click={() => (numAgents = num)}
						>
							{num}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Input Field -->
		<div class="input-wrapper">
			<textarea
				bind:value={inputValue}
				placeholder="Ask the council something... (Shift+Enter for new line)"
				disabled={isLoading}
				on:keydown={handleKeydown}
			/>
			<button
				class="send-btn {useBlockchainMode ? 'blockchain' : ''}"
				on:click={handleSubmit}
				disabled={isLoading || !inputValue.trim()}
			>
				{#if isLoading}
					<span class="spinner"></span>
				{:else}
					{useBlockchainMode ? '⛓️' : '💬'} Send
				{/if}
			</button>
		</div>

		<!-- Info Text -->
		<div class="input-info">
			<p>
				{#if useBlockchainMode}
					💾 Responses will be recorded on blockchain and archived permanently
				{:else}
					📝 Regular deliberation mode - no blockchain recording
				{/if}
			</p>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
			sans-serif;
		background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
		color: #ccc;
	}

	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
		color: #ccc;
	}

	/* Header */
	.chat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		background: rgba(0, 0, 0, 0.4);
		border-bottom: 2px solid rgba(0, 212, 255, 0.3);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.header-content h1 {
		margin: 0;
		font-size: 1.8rem;
		color: #00d4ff;
		font-weight: 700;
	}

	.header-content p {
		margin: 0.3rem 0 0 0;
		font-size: 0.9rem;
		color: #888;
	}

	.mode-badge {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: rgba(100, 100, 150, 0.3);
		color: #888;
		border-radius: 20px;
		font-size: 0.85rem;
		font-weight: bold;
		border: 1px solid rgba(100, 100, 150, 0.5);
		transition: all 0.3s;
	}

	.mode-badge.blockchain {
		background: rgba(0, 212, 255, 0.2);
		color: #00d4ff;
		border-color: rgba(0, 212, 255, 0.5);
	}

	/* Messages */
	.messages-wrapper {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem;
		scroll-behavior: smooth;
	}

	.messages {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.message-group {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.3rem;
	}

	.message-group.user {
		align-items: flex-end;
	}

	.message-content {
		max-width: 75%;
		width: 100%;
	}

	.message-group.user .message-content {
		max-width: 75%;
		align-self: flex-end;
	}

	.message-bubble {
		padding: 0.9rem 1.2rem;
		border-radius: 12px;
		background: rgba(50, 50, 80, 0.6);
		border: 1px solid rgba(0, 212, 255, 0.2);
		word-wrap: break-word;
		line-height: 1.5;
		color: #ccc;
	}

	.message-bubble.user {
		background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 150, 200, 0.2));
		border-color: rgba(0, 212, 255, 0.5);
		color: #e0e0e0;
	}

	.message-bubble.error {
		background: rgba(255, 0, 110, 0.2);
		border-color: rgba(255, 0, 110, 0.5);
		color: #ff6e9e;
	}

	.message-bubble.loading {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		color: #00d4ff;
	}

	.loader {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid rgba(0, 212, 255, 0.3);
		border-top-color: #00d4ff;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.message-time {
		font-size: 0.75rem;
		color: #666;
		margin-top: 0.3rem;
	}

	.message-group.user .message-time {
		text-align: right;
	}

	/* Votes Summary */
	.votes-summary {
		margin-top: 0.8rem;
		padding: 0.8rem;
		background: rgba(0, 212, 255, 0.1);
		border-left: 3px solid #00d4ff;
		border-radius: 4px;
	}

	.consensus-badge {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin-bottom: 0.6rem;
	}

	.consensus-badge .score {
		font-size: 1.8rem;
		font-weight: bold;
		color: #00d4ff;
	}

	.consensus-badge .label {
		font-size: 0.85rem;
		color: #888;
	}

	.votes-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 0.5rem;
	}

	.vote-item {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		padding: 0.4rem;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 3px;
	}

	.agent-id {
		color: #00d4ff;
		font-weight: bold;
		flex: 1;
	}

	.position {
		padding: 0 0.4rem;
		border-radius: 3px;
		font-weight: bold;
	}

	.position.agree {
		background: rgba(0, 212, 0, 0.2);
		color: #00d400;
	}

	.position.partial {
		background: rgba(255, 165, 0, 0.2);
		color: #ffa500;
	}

	.confidence {
		color: #888;
		min-width: 40px;
		text-align: right;
	}

	/* Blockchain Proof Wrapper */
	.blockchain-proof-wrapper {
		margin-top: 1rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 8px;
	}

	/* Input Area */
	.input-area {
		padding: 1.5rem;
		background: rgba(0, 0, 0, 0.4);
		border-top: 2px solid rgba(0, 212, 255, 0.3);
		flex-shrink: 0;
	}

	.controls {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.mode-control {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.blockchain-toggle {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		cursor: pointer;
		padding: 0.6rem;
		background: rgba(50, 50, 80, 0.4);
		border-radius: 6px;
		border: 1px solid rgba(0, 212, 255, 0.2);
		transition: all 0.3s;
		width: fit-content;
	}

	.blockchain-toggle:hover {
		background: rgba(50, 50, 80, 0.6);
		border-color: rgba(0, 212, 255, 0.4);
	}

	.blockchain-toggle input {
		width: 16px;
		height: 16px;
		cursor: pointer;
		accent-color: #00d4ff;
	}

	.blockchain-toggle span {
		color: #ccc;
		font-weight: 500;
	}

	.mode-description {
		margin: 0;
		font-size: 0.8rem;
		color: #888;
		padding-left: 0.6rem;
	}

	.agent-control {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.agent-control label {
		font-size: 0.9rem;
		font-weight: 600;
		color: #00d4ff;
	}

	.agent-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.agent-btn {
		padding: 0.5rem 0.8rem;
		background: rgba(50, 50, 80, 0.4);
		color: #888;
		border: 1px solid rgba(0, 212, 255, 0.2);
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.3s;
	}

	.agent-btn:hover {
		background: rgba(50, 50, 80, 0.6);
		border-color: rgba(0, 212, 255, 0.4);
		color: #ccc;
	}

	.agent-btn.active {
		background: rgba(0, 212, 255, 0.2);
		color: #00d4ff;
		border-color: rgba(0, 212, 255, 0.6);
	}

	/* Input Wrapper */
	.input-wrapper {
		display: flex;
		gap: 0.8rem;
	}

	textarea {
		flex: 1;
		min-height: 60px;
		max-height: 120px;
		padding: 0.9rem;
		background: rgba(30, 30, 50, 0.6);
		color: #ccc;
		border: 1px solid rgba(0, 212, 255, 0.3);
		border-radius: 8px;
		font-family: inherit;
		font-size: 0.95rem;
		resize: vertical;
		transition: all 0.3s;
	}

	textarea:focus {
		outline: none;
		background: rgba(30, 30, 50, 0.8);
		border-color: rgba(0, 212, 255, 0.6);
		box-shadow: 0 0 12px rgba(0, 212, 255, 0.2);
	}

	textarea:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.send-btn {
		padding: 0.9rem 1.6rem;
		background: linear-gradient(135deg, rgba(100, 100, 150, 0.5), rgba(100, 100, 150, 0.3));
		color: #888;
		border: 1px solid rgba(100, 100, 150, 0.5);
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.95rem;
		transition: all 0.3s;
		min-width: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
	}

	.send-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, rgba(100, 100, 150, 0.7), rgba(100, 100, 150, 0.5));
		border-color: rgba(100, 100, 150, 0.7);
		color: #ccc;
	}

	.send-btn.blockchain {
		background: linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 150, 200, 0.2));
		color: #00d4ff;
		border-color: rgba(0, 212, 255, 0.5);
	}

	.send-btn.blockchain:hover:not(:disabled) {
		background: linear-gradient(135deg, rgba(0, 212, 255, 0.5), rgba(0, 150, 200, 0.3));
		border-color: rgba(0, 212, 255, 0.8);
		box-shadow: 0 0 12px rgba(0, 212, 255, 0.3);
	}

	.send-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.spinner {
		display: inline-block;
		width: 14px;
		height: 14px;
		border: 2px solid rgba(0, 212, 255, 0.3);
		border-top-color: #00d4ff;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.input-info {
		margin-top: 0.8rem;
		text-align: center;
	}

	.input-info p {
		margin: 0;
		font-size: 0.85rem;
		color: #666;
	}

	/* Scrollbar Styling */
	.messages-wrapper::-webkit-scrollbar {
		width: 8px;
	}

	.messages-wrapper::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 4px;
	}

	.messages-wrapper::-webkit-scrollbar-thumb {
		background: rgba(0, 212, 255, 0.3);
		border-radius: 4px;
		transition: background 0.3s;
	}

	.messages-wrapper::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 212, 255, 0.5);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.controls {
			grid-template-columns: 1fr;
		}

		.message-content {
			max-width: 90% !important;
		}

		.agent-buttons {
			justify-content: flex-start;
		}

		.chat-header {
			padding: 1rem;
		}

		.input-area {
			padding: 1rem;
		}

		.messages-wrapper {
			padding: 1rem;
		}
	}
</style>
