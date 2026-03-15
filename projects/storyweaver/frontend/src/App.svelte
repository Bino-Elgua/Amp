<script>
  import { onMount } from 'svelte'
  import axios from 'axios'
  import Chat from './components/Chat.svelte'
  import StoryPanel from './components/StoryPanel.svelte'
  
  let currentView = 'chat' // chat, story, settings
  let darkMode = true
  let storyId = null
  let story = null
  let messages = []
  
  const API_URL = 'http://localhost:5000/api'
  
  onMount(async () => {
    // Check backend health
    try {
      const res = await axios.get(`${API_URL}/health`)
      console.log('Backend healthy:', res.data)
    } catch (e) {
      console.error('Backend error:', e)
    }
  })
  
  const newStory = async () => {
    try {
      const res = await axios.post(`${API_URL}/stories`, {
        title: 'New Story'
      })
      storyId = res.data.id
      story = res.data
      messages = []
      currentView = 'chat'
    } catch (e) {
      console.error('Error creating story:', e)
    }
  }
  
  const handleMessage = async (message) => {
    // Add user message
    messages = [...messages, { role: 'user', content: message }]
    
    try {
      const res = await axios.post(`${API_URL}/chat`, {
        message: message,
        story_id: storyId
      })
      
      // Add AI response
      messages = [...messages, { role: 'assistant', content: res.data.response }]
    } catch (e) {
      console.error('Chat error:', e)
      messages = [...messages, { role: 'error', content: 'Error: ' + e.message }]
    }
  }
</script>

<main class:dark={darkMode}>
  <div class="container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">📖 StoryWeaver</div>
      
      <nav class="nav">
        <button
          class:active={currentView === 'chat'}
          on:click={() => currentView = 'chat'}
        >
          💬 Chat
        </button>
        <button
          class:active={currentView === 'story'}
          on:click={() => currentView = 'story'}
        >
          📝 Story
        </button>
        <button
          class:active={currentView === 'settings'}
          on:click={() => currentView = 'settings'}
        >
          ⚙️ Settings
        </button>
      </nav>
      
      <button class="btn-primary" on:click={newStory}>
        ✨ New Story
      </button>
    </aside>
    
    <!-- Main Content -->
    <div class="main">
      {#if currentView === 'chat'}
        <Chat {messages} {storyId} on:message={(e) => handleMessage(e.detail)} />
      {:else if currentView === 'story' && story}
        <StoryPanel {story} {storyId} />
      {:else}
        <div class="placeholder">
          <h1>Welcome to StoryWeaver</h1>
          <p>Create a new story to get started</p>
          <button class="btn-primary" on:click={newStory}>
            Start Writing
          </button>
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  main {
    width: 100vw;
    height: 100vh;
    background: #0a0e27;
    color: #e0e0e0;
  }
  
  main.dark {
    background: #0a0e27;
    color: #e0e0e0;
  }
  
  .container {
    display: flex;
    width: 100%;
    height: 100%;
  }
  
  .sidebar {
    width: 280px;
    background: #1a1f3a;
    border-right: 1px solid #2a2f4a;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
  }
  
  .logo {
    font-size: 24px;
    font-weight: bold;
    padding: 10px 0;
    border-bottom: 1px solid #2a2f4a;
  }
  
  .nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .nav button {
    background: transparent;
    border: none;
    color: #a0a0b0;
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
  }
  
  .nav button:hover {
    background: #2a2f4a;
    color: #fff;
  }
  
  .nav button.active {
    background: #4a5a9f;
    color: #fff;
  }
  
  .btn-primary {
    background: #5a6aaf;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .btn-primary:hover {
    background: #6a7abf;
  }
  
  .main {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  
  .placeholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    text-align: center;
  }
  
  .placeholder h1 {
    font-size: 32px;
  }
  
  .placeholder p {
    color: #a0a0b0;
  }
  
  @media (max-width: 768px) {
    .sidebar {
      width: 60px;
      padding: 10px;
    }
    
    .logo, .nav button span {
      display: none;
    }
  }
</style>
