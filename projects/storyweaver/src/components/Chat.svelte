<script>
  import { createEventDispatcher } from 'svelte'
  
  export let messages = []
  export let storyId = null
  
  const dispatch = createEventDispatcher()
  
  let inputValue = ''
  let loading = false
  let chatContainer
  
  const sendMessage = async () => {
    if (!inputValue.trim()) return
    
    loading = true
    dispatch('message', inputValue)
    inputValue = ''
    
    // Auto-scroll to bottom
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }, 100)
    
    loading = false
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
</script>

<div class="chat-window">
  <div class="chat-header">
    <h2>Story Chat</h2>
    {#if storyId}
      <span class="story-id">Story #{storyId}</span>
    {/if}
  </div>
  
  <div class="messages" bind:this={chatContainer}>
    {#each messages as msg (msg)}
      <div class="message" class:user={msg.role === 'user'} class:error={msg.role === 'error'}>
        <div class="avatar">
          {#if msg.role === 'user'}
            👤
          {:else if msg.role === 'error'}
            ⚠️
          {:else}
            🤖
          {/if}
        </div>
        <div class="content">
          {msg.content}
        </div>
      </div>
    {/each}
    
    {#if loading}
      <div class="message loading">
        <div class="avatar">🤖</div>
        <div class="content">
          <div class="typing">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <div class="input-area">
    <textarea
      bind:value={inputValue}
      on:keypress={handleKeyPress}
      placeholder="Tell me your story..."
      rows="3"
    ></textarea>
    <button on:click={sendMessage} disabled={!inputValue.trim() || loading}>
      Send
    </button>
  </div>
</div>

<style>
  .chat-window {
    display: flex;
    flex-direction: column;
    flex: 1;
    background: #0a0e27;
    border-right: 1px solid #2a2f4a;
  }
  
  .chat-header {
    padding: 16px;
    border-bottom: 1px solid #2a2f4a;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .chat-header h2 {
    margin: 0;
    font-size: 18px;
  }
  
  .story-id {
    font-size: 12px;
    color: #a0a0b0;
    background: #1a1f3a;
    padding: 4px 8px;
    border-radius: 4px;
  }
  
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .message {
    display: flex;
    gap: 8px;
    animation: slideIn 0.2s ease-out;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .message.user {
    flex-direction: row-reverse;
  }
  
  .avatar {
    font-size: 24px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .content {
    max-width: 70%;
    padding: 10px 12px;
    border-radius: 8px;
    background: #1a1f3a;
    line-height: 1.5;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
  
  .message.user .content {
    background: #4a5a9f;
    color: #fff;
  }
  
  .message.error .content {
    background: #5a3a3a;
    color: #ffaaaa;
  }
  
  .message.loading .content {
    padding: 10px 16px;
  }
  
  .typing {
    display: flex;
    gap: 4px;
  }
  
  .typing span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #a0a0b0;
    animation: typing 1.4s infinite;
  }
  
  .typing span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .typing span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes typing {
    0%, 60%, 100% {
      opacity: 0.5;
      transform: translateY(0);
    }
    30% {
      opacity: 1;
      transform: translateY(-8px);
    }
  }
  
  .input-area {
    padding: 16px;
    border-top: 1px solid #2a2f4a;
    display: flex;
    gap: 8px;
  }
  
  textarea {
    flex: 1;
    background: #1a1f3a;
    color: #e0e0e0;
    border: 1px solid #2a2f4a;
    border-radius: 6px;
    padding: 10px 12px;
    resize: none;
    font-family: inherit;
    font-size: 14px;
    transition: border-color 0.2s;
  }
  
  textarea:focus {
    outline: none;
    border-color: #4a5a9f;
  }
  
  button {
    background: #5a6aaf;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  button:hover:not(:disabled) {
    background: #6a7abf;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
