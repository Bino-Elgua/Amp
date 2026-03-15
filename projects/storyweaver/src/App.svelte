<script>
  import { onMount } from 'svelte'
  import axios from 'axios'
  import Dashboard from './components/Dashboard.svelte'
  import Editor from './components/Editor.svelte'
  import Reader from './components/Reader.svelte'
  import Settings from './components/Settings.svelte'
  
  let currentView = 'dashboard' // dashboard, editor, reader, settings
  let currentProject = null
  let projects = []
  let darkMode = true
  
  const API_URL = 'http://localhost:5000/api'
  
  onMount(async () => {
    try {
      const res = await axios.get(`${API_URL}/health`)
      console.log('Backend connected:', res.data)
    } catch (e) {
      console.error('Backend error:', e)
    }
  })
  
  const handleNewProject = (type) => {
    // Open editor with new project
    currentView = 'editor'
    currentProject = {
      id: Date.now(),
      type: type, // 'voice', 'text', 'file', 'chat'
      status: 'setup'
    }
  }
  
  const handleOpenProject = (project) => {
    currentProject = project
    currentView = 'reader'
  }
  
  const handleEdit = () => {
    currentView = 'editor'
  }
</script>

<main class:dark={darkMode}>
  <nav class="sidebar">
    <div class="logo">
      <span class="icon">📖</span>
      <span class="name">StoryWeaver</span>
    </div>
    
    <div class="nav-items">
      <button
        class="nav-btn"
        class:active={currentView === 'dashboard'}
        on:click={() => currentView = 'dashboard'}
      >
        <span class="icon">📚</span>
        <span>Projects</span>
      </button>
      
      <button
        class="nav-btn"
        class:active={currentView === 'editor'}
        on:click={() => currentView = 'editor'}
        disabled={!currentProject}
      >
        <span class="icon">✏️</span>
        <span>Editor</span>
      </button>
      
      <button
        class="nav-btn"
        class:active={currentView === 'reader'}
        on:click={() => currentView = 'reader'}
        disabled={!currentProject}
      >
        <span class="icon">👁️</span>
        <span>Read</span>
      </button>
      
      <button
        class="nav-btn"
        class:active={currentView === 'settings'}
        on:click={() => currentView = 'settings'}
      >
        <span class="icon">⚙️</span>
        <span>Settings</span>
      </button>
    </div>
  </nav>
  
  <div class="main">
    {#if currentView === 'dashboard'}
      <Dashboard on:newProject={(e) => handleNewProject(e.detail)} />
    {:else if currentView === 'editor' && currentProject}
      <Editor project={currentProject} on:back={() => currentView = 'dashboard'} />
    {:else if currentView === 'reader' && currentProject}
      <Reader project={currentProject} on:edit={handleEdit} on:back={() => currentView = 'dashboard'} />
    {:else if currentView === 'settings'}
      <Settings />
    {:else}
      <div class="placeholder">
        <h1>Select a project to begin</h1>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    display: flex;
    width: 100%;
    height: 100vh;
    background: #0a0e27;
    color: #e0e0e0;
  }
  
  .sidebar {
    width: 280px;
    background: #1a1f3a;
    border-right: 1px solid #2a2f4a;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    overflow-y: auto;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 1px solid #2a2f4a;
  }
  
  .logo .icon {
    font-size: 28px;
  }
  
  .logo .name {
    font-size: 20px;
    font-weight: bold;
    background: linear-gradient(135deg, #6a7abf, #8a9acf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .nav-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .nav-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    border: none;
    color: #a0a0b0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    font-size: 14px;
    font-weight: 500;
  }
  
  .nav-btn:hover:not(:disabled) {
    background: #2a2f4a;
    color: #fff;
  }
  
  .nav-btn.active {
    background: #4a5a9f;
    color: #fff;
  }
  
  .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .nav-btn .icon {
    font-size: 18px;
  }
  
  .main {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  
  .placeholder {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6a6a7a;
  }
  
  @media (max-width: 768px) {
    .sidebar {
      width: 70px;
      padding: 10px;
    }
    
    .logo .name {
      display: none;
    }
    
    .nav-btn span:last-child {
      display: none;
    }
  }
</style>
