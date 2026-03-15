<script>
  import { onMount } from 'svelte'
  import axios from 'axios'
  
  export let story = null
  export let storyId = null
  
  let loading = false
  let bookGenerating = false
  
  const API_URL = 'http://localhost:5000/api'
  
  const generateBook = async () => {
    if (!storyId) return
    
    bookGenerating = true
    try {
      const res = await axios.post(`${API_URL}/stories/${storyId}/generate-book`)
      console.log('Book generation started:', res.data)
    } catch (e) {
      console.error('Error:', e)
    } finally {
      bookGenerating = false
    }
  }
</script>

<div class="story-panel">
  <div class="header">
    <h2>{story?.title || 'Story'}</h2>
    <button class="btn-primary" on:click={generateBook} disabled={bookGenerating}>
      {#if bookGenerating}
        📖 Generating...
      {:else}
        📖 Generate Book
      {/if}
    </button>
  </div>
  
  <div class="content">
    {#if story}
      <div class="story-info">
        <p><strong>Status:</strong> {story.status}</p>
        <p><strong>Chapters:</strong> {story.chapters?.length || 0}</p>
        <p><strong>Created:</strong> {new Date(story.created_at).toLocaleDateString()}</p>
      </div>
      
      {#if story.chapters && story.chapters.length > 0}
        <div class="chapters">
          <h3>Chapters</h3>
          {#each story.chapters as chapter, idx}
            <div class="chapter">
              <h4>Chapter {idx + 1}: {chapter.title}</h4>
              <p>{chapter.text.substring(0, 200)}...</p>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .story-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #0a0e27;
  }
  
  .header {
    padding: 16px;
    border-bottom: 1px solid #2a2f4a;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header h2 {
    margin: 0;
  }
  
  .content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }
  
  .story-info {
    background: #1a1f3a;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 16px;
  }
  
  .story-info p {
    margin: 4px 0;
    color: #a0a0b0;
  }
  
  .chapters {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .chapters h3 {
    margin: 0 0 8px 0;
  }
  
  .chapter {
    background: #1a1f3a;
    padding: 12px;
    border-radius: 6px;
  }
  
  .chapter h4 {
    margin: 0 0 8px 0;
  }
  
  .chapter p {
    margin: 0;
    color: #a0a0b0;
    font-size: 14px;
  }
  
  .btn-primary {
    background: #5a6aaf;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    white-space: nowrap;
  }
  
  .btn-primary:hover:not(:disabled) {
    background: #6a7abf;
  }
  
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
