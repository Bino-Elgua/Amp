<script>
  let darkMode = true
  let apiKey = ''
  let defaultGenre = 'fantasy'
  let defaultTone = 'whimsical'
</script>

<div class="settings">
  <div class="settings-header">
    <h1>⚙️ Settings</h1>
    <p>Customize your StoryWeaver experience</p>
  </div>
  
  <div class="settings-content">
    <section class="settings-section">
      <h2>Appearance</h2>
      <div class="setting">
        <label>Dark Mode</label>
        <input type="checkbox" bind:checked={darkMode} />
      </div>
    </section>
    
    <section class="settings-section">
      <h2>API Keys (Optional)</h2>
      <p>For advanced features like image generation</p>
      <div class="setting">
        <label>OpenAI API Key</label>
        <input type="password" bind:value={apiKey} placeholder="sk-..." />
      </div>
    </section>
    
    <section class="settings-section">
      <h2>Story Defaults</h2>
      <div class="setting">
        <label>Default Genre</label>
        <select bind:value={defaultGenre}>
          <option value="fantasy">Fantasy</option>
          <option value="sci-fi">Sci-Fi</option>
          <option value="romance">Romance</option>
        </select>
      </div>
      <div class="setting">
        <label>Default Tone</label>
        <select bind:value={defaultTone}>
          <option value="whimsical">Whimsical</option>
          <option value="serious">Serious</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </section>
  </div>
</div>

<style>
  .settings {
    flex: 1;
    overflow-y: auto;
  }
  
  .settings-header {
    padding: 40px;
    border-bottom: 1px solid #2a2f4a;
  }
  
  .settings-header h1 {
    margin: 0 0 8px;
    font-size: 32px;
  }
  
  .settings-header p {
    margin: 0;
    color: #a0a0b0;
  }
  
  .settings-content {
    padding: 40px;
    max-width: 600px;
  }
  
  .settings-section {
    margin-bottom: 40px;
  }
  
  .settings-section h2 {
    margin: 0 0 16px;
    font-size: 18px;
  }
  
  .settings-section p {
    margin: 0 0 16px;
    color: #a0a0b0;
    font-size: 13px;
  }
  
  .setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #2a2f4a;
  }
  
  .setting label {
    font-weight: 500;
  }
  
  .setting input[type="checkbox"],
  .setting input[type="password"],
  .setting input[type="text"],
  .setting select {
    background: #1a1f3a;
    color: #e0e0e0;
    border: 1px solid #2a2f4a;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 13px;
  }
</style>
