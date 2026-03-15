<script>
  import { createEventDispatcher } from 'svelte'
  
  const dispatch = createEventDispatcher()
  export let project
  
  let currentPage = 0
  let pages = [
    { title: 'The Wizard\'s Journey', content: 'In a land of ancient magic...', image: '🧙' },
    { title: 'Chapter 1', content: 'A young wizard discovered...', image: '⚡' }
  ]
</script>

<div class="reader">
  <div class="reader-header">
    <button class="btn-back" on:click={() => dispatch('back')}>← Back</button>
    <h2>The Wizard's Journey</h2>
    <button class="btn-edit" on:click={() => dispatch('edit')}>✏️ Edit</button>
  </div>
  
  <div class="reader-content">
    <div class="page">
      <div class="page-image">🧙</div>
      <div class="page-text">
        <h3>The Wizard's Journey</h3>
        <p>In a land of ancient magic, a young wizard discovered their true power...</p>
      </div>
    </div>
  </div>
  
  <div class="reader-footer">
    <button disabled={currentPage === 0}>← Previous</button>
    <span class="page-counter">{currentPage + 1} / {pages.length}</span>
    <button disabled={currentPage >= pages.length - 1}>Next →</button>
  </div>
</div>

<style>
  .reader {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .reader-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    border-bottom: 1px solid #2a2f4a;
  }
  
  .btn-back, .btn-edit {
    background: #2a2f4a;
    color: #e0e0e0;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .reader-content {
    flex: 1;
    overflow-y: auto;
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .page {
    background: #1a1f3a;
    border: 1px solid #2a2f4a;
    border-radius: 12px;
    padding: 40px;
    max-width: 600px;
    width: 100%;
  }
  
  .page-image {
    font-size: 80px;
    text-align: center;
    margin-bottom: 24px;
  }
  
  .page-text h3 {
    margin: 0 0 16px;
    font-size: 24px;
  }
  
  .page-text p {
    margin: 0;
    line-height: 1.8;
    color: #d0d0d0;
  }
  
  .reader-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    border-top: 1px solid #2a2f4a;
  }
  
  .page-counter {
    color: #a0a0b0;
    font-size: 14px;
  }
  
  .reader-footer button {
    background: #2a2f4a;
    color: #e0e0e0;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .reader-footer button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
