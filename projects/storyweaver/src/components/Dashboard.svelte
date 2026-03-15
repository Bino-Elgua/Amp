<script>
  import { createEventDispatcher } from 'svelte'
  
  const dispatch = createEventDispatcher()
  
  let projects = []
  let showNewProjectModal = false
  let selectedInputType = null
</script>

<div class="dashboard">
  <header class="header">
    <div class="title-section">
      <h1>📖 My Projects</h1>
      <p>Create illustrated storybooks from voice, text, files, or conversations</p>
    </div>
    <button class="btn-primary" on:click={() => showNewProjectModal = true}>
      ✨ New Project
    </button>
  </header>
  
  {#if projects.length === 0}
    <section class="empty-state">
      <div class="empty-icon">📚</div>
      <h2>No projects yet</h2>
      <p>Start by creating a new project. Choose your input method:</p>
      
      <div class="input-methods">
        <div class="method-card" on:click={() => dispatch('newProject', 'voice')}>
          <div class="method-icon">🎤</div>
          <div class="method-title">Voice Recording</div>
          <div class="method-desc">Transcribe and transform audio into a story</div>
        </div>
        
        <div class="method-card" on:click={() => dispatch('newProject', 'text')}>
          <div class="method-icon">📝</div>
          <div class="method-title">Text Input</div>
          <div class="method-desc">Write a prompt or story seed</div>
        </div>
        
        <div class="method-card" on:click={() => dispatch('newProject', 'file')}>
          <div class="method-icon">📄</div>
          <div class="method-title">Upload File</div>
          <div class="method-desc">PDF, Word, Markdown, or text files</div>
        </div>
        
        <div class="method-card" on:click={() => dispatch('newProject', 'chat')}>
          <div class="method-icon">💬</div>
          <div class="method-title">Chat Conversation</div>
          <div class="method-desc">Convert chat logs or message exports</div>
        </div>
      </div>
    </section>
  {:else}
    <section class="projects-grid">
      {#each projects as project (project.id)}
        <div class="project-card">
          <div class="project-image">
            {#if project.coverImage}
              <img src={project.coverImage} alt={project.title} />
            {:else}
              <div class="placeholder-image">📖</div>
            {/if}
          </div>
          
          <div class="project-info">
            <h3>{project.title}</h3>
            <p class="project-meta">
              <span class="type">{project.type}</span>
              <span class="date">{new Date(project.createdAt).toLocaleDateString()}</span>
            </p>
            <p class="project-desc">{project.description || 'No description'}</p>
            
            <div class="project-stats">
              <span>📄 {project.pageCount || 0} pages</span>
              <span>🖼️ {project.imageCount || 0} images</span>
            </div>
            
            <div class="project-actions">
              <button class="btn-secondary">Open</button>
              <button class="btn-secondary">Edit</button>
              <button class="btn-secondary">Export</button>
            </div>
          </div>
        </div>
      {/each}
    </section>
  {/if}
</div>

<style>
  .dashboard {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 40px;
    border-bottom: 1px solid #2a2f4a;
    gap: 20px;
  }
  
  .title-section h1 {
    margin: 0 0 8px;
    font-size: 32px;
  }
  
  .title-section p {
    margin: 0;
    color: #a0a0b0;
    font-size: 14px;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #6a7abf, #8a9acf);
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.2s;
  }
  
  .btn-primary:hover {
    transform: scale(1.02);
  }
  
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
  }
  
  .empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }
  
  .empty-state h2 {
    font-size: 28px;
    margin: 0 0 8px;
  }
  
  .empty-state p {
    color: #a0a0b0;
    margin: 0 0 40px;
  }
  
  .input-methods {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    width: 100%;
    max-width: 1000px;
  }
  
  .method-card {
    background: #1a1f3a;
    border: 2px solid #2a2f4a;
    border-radius: 12px;
    padding: 30px 20px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .method-card:hover {
    border-color: #4a5a9f;
    background: #2a2f4a;
    transform: translateY(-4px);
  }
  
  .method-icon {
    font-size: 40px;
  }
  
  .method-title {
    font-weight: 600;
    font-size: 16px;
  }
  
  .method-desc {
    color: #a0a0b0;
    font-size: 13px;
  }
  
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    padding: 40px;
  }
  
  .project-card {
    background: #1a1f3a;
    border: 1px solid #2a2f4a;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
  }
  
  .project-card:hover {
    border-color: #4a5a9f;
    transform: translateY(-4px);
  }
  
  .project-image {
    width: 100%;
    height: 160px;
    background: #2a2f4a;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .placeholder-image {
    font-size: 48px;
  }
  
  .project-info {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }
  
  .project-info h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  .project-meta {
    display: flex;
    gap: 12px;
    margin: 0;
    font-size: 12px;
    color: #8a8a9a;
  }
  
  .project-desc {
    color: #a0a0b0;
    font-size: 13px;
    margin: 0;
    flex: 1;
  }
  
  .project-stats {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #a0a0b0;
  }
  
  .project-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  
  .btn-secondary {
    flex: 1;
    padding: 8px 12px;
    background: #2a2f4a;
    color: #e0e0e0;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .btn-secondary:hover {
    background: #4a5a9f;
  }
</style>
