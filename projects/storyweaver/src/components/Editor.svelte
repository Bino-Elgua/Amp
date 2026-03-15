<script>
  import { createEventDispatcher } from 'svelte'
  
  const dispatch = createEventDispatcher()
  
  export let project
  
  let step = 'input' // input, settings, preview, generating
  let inputData = ''
  let uploadedFile = null
  let settings = {
    genre: 'fantasy',
    tone: 'whimsical',
    targetAudience: 'all-ages',
    visualStyle: 'illustrated',
    storyLength: 'medium',
    language: 'en'
  }
  let generatedStory = null
  let generationProgress = 0
  
  const handleFileUpload = (event) => {
    uploadedFile = event.target.files[0]
  }
  
  const handleInputSubmit = () => {
    if (inputData || uploadedFile) {
      step = 'settings'
    }
  }
  
  const handleSettingsChange = (key, value) => {
    settings[key] = value
  }
  
  const generateStory = async () => {
    step = 'generating'
    
    // Simulate generation progress
    for (let i = 0; i <= 100; i += 10) {
      generationProgress = i
      await new Promise(r => setTimeout(r, 300))
    }
    
    // Mock generated story
    generatedStory = {
      title: 'The Wizard\'s Journey',
      chapters: [
        {
          title: 'Chapter 1: The Beginning',
          content: 'In a land of ancient magic, a young wizard discovered their true power...',
          image: '🧙'
        },
        {
          title: 'Chapter 2: The Challenge',
          content: 'A mysterious force threatened the kingdom...',
          image: '⚡'
        }
      ],
      characters: [
        { name: 'Aldric', role: 'Protagonist', description: 'A young wizard with untapped power' }
      ],
      metadata: {
        pageCount: 8,
        readingTime: '15 min',
        genre: settings.genre,
        tone: settings.tone
      }
    }
    
    step = 'preview'
  }


</script>

<div class="editor">
  <div class="progress-bar">
    <div class="step" class:active={step === 'input'}>
      <span class="number">1</span>
      <span class="label">Input</span>
    </div>
    <div class="connector" class:active={['settings', 'preview', 'generating'].includes(step)}></div>
    <div class="step" class:active={['settings', 'preview', 'generating'].includes(step)}>
      <span class="number">2</span>
      <span class="label">Settings</span>
    </div>
    <div class="connector" class:active={['preview', 'generating'].includes(step)}></div>
    <div class="step" class:active={['preview', 'generating'].includes(step)}>
      <span class="number">3</span>
      <span class="label">Generate</span>
    </div>
    <div class="connector" class:active={step === 'preview'}></div>
    <div class="step" class:active={step === 'preview'}>
      <span class="number">4</span>
      <span class="label">Preview</span>
    </div>
  </div>
  
  <div class="content">
    {#if step === 'input'}
      <div class="input-section">
        <h2>📥 Provide Your Content</h2>
        <p>Choose your input method: {project.type}</p>
        
        {#if project.type === 'text' || project.type === 'chat'}
          <textarea
            placeholder="Paste your text, chat logs, or story prompt..."
            bind:value={inputData}
            rows="12"
          ></textarea>
        {:else if project.type === 'voice'}
          <div class="upload-area">
            <div class="upload-icon">🎤</div>
            <p>Upload audio file (MP3, WAV, M4A)</p>
            <input type="file" accept="audio/*" on:change={handleFileUpload} />
          </div>
        {:else if project.type === 'file'}
          <div class="upload-area">
            <div class="upload-icon">📄</div>
            <p>Upload document (PDF, Word, Markdown, TXT)</p>
            <input type="file" accept=".pdf,.doc,.docx,.md,.txt" on:change={handleFileUpload} />
          </div>
        {/if}
        
        <div class="input-actions">
          <button class="btn-secondary" on:click={() => dispatch('back')}>← Back</button>
          <button 
            class="btn-primary" 
            on:click={handleInputSubmit}
            disabled={!inputData && !uploadedFile}
          >
            Continue →
          </button>
        </div>
      </div>
    
    {:else if step === 'settings'}
      <div class="settings-section">
        <h2>⚙️ Story Settings</h2>
        <p>Customize how your story will be generated</p>
        
        <div class="settings-grid">
          <div class="setting">
            <label>Genre</label>
            <select value={settings.genre} on:change={(e) => handleSettingsChange('genre', e.target.value)}>
              <option value="fantasy">Fantasy</option>
              <option value="sci-fi">Sci-Fi</option>
              <option value="romance">Romance</option>
              <option value="mystery">Mystery</option>
              <option value="historical">Historical</option>
              <option value="memoir">Memoir</option>
            </select>
          </div>
          
          <div class="setting">
            <label>Tone</label>
            <select value={settings.tone} on:change={(e) => handleSettingsChange('tone', e.target.value)}>
              <option value="whimsical">Whimsical</option>
              <option value="serious">Serious</option>
              <option value="dark">Dark</option>
              <option value="inspirational">Inspirational</option>
              <option value="humorous">Humorous</option>
            </select>
          </div>
          
          <div class="setting">
            <label>Target Audience</label>
            <select value={settings.targetAudience} on:change={(e) => handleSettingsChange('targetAudience', e.target.value)}>
              <option value="children">Children</option>
              <option value="teens">Teens</option>
              <option value="adults">Adults</option>
              <option value="all-ages">All Ages</option>
            </select>
          </div>
          
          <div class="setting">
            <label>Visual Style</label>
            <select value={settings.visualStyle} on:change={(e) => handleSettingsChange('visualStyle', e.target.value)}>
              <option value="illustrated">Illustrated</option>
              <option value="photorealistic">Photorealistic</option>
              <option value="hand-drawn">Hand-Drawn</option>
              <option value="minimalist">Minimalist</option>
              <option value="abstract">Abstract</option>
            </select>
          </div>
          
          <div class="setting">
            <label>Story Length</label>
            <select value={settings.storyLength} on:change={(e) => handleSettingsChange('storyLength', e.target.value)}>
              <option value="short">Short (3-5 pages)</option>
              <option value="medium">Medium (8-12 pages)</option>
              <option value="long">Long (15+ pages)</option>
            </select>
          </div>
          
          <div class="setting">
            <label>Language</label>
            <select value={settings.language} on:change={(e) => handleSettingsChange('language', e.target.value)}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
        </div>
        
        <div class="settings-actions">
          <button class="btn-secondary" on:click={() => step = 'input'}>← Back</button>
          <button class="btn-primary" on:click={generateStory}>Generate Story →</button>
        </div>
      </div>
    
    {:else if step === 'generating'}
      <div class="generating-section">
        <h2>✨ Generating Your Story</h2>
        <p>This may take a few moments...</p>
        
        <div class="progress-steps">
          <div class="progress-step" class:complete={generationProgress >= 25}>
            <div class="progress-dot"></div>
            <div class="progress-label">Analyzing input</div>
          </div>
          <div class="progress-step" class:complete={generationProgress >= 50}>
            <div class="progress-dot"></div>
            <div class="progress-label">Generating story</div>
          </div>
          <div class="progress-step" class:complete={generationProgress >= 75}>
            <div class="progress-dot"></div>
            <div class="progress-label">Creating illustrations</div>
          </div>
          <div class="progress-step" class:complete={generationProgress >= 100}>
            <div class="progress-dot"></div>
            <div class="progress-label">Finalizing</div>
          </div>
        </div>
        
        <div class="progress-bar-visual">
          <div class="progress-fill" style="width: {generationProgress}%"></div>
        </div>
        <p class="progress-text">{generationProgress}% Complete</p>
      </div>
    
    {:else if step === 'preview' && generatedStory}
      <div class="preview-section">
        <h2>👁️ Preview Your Story</h2>
        
        <div class="story-preview">
          <h3>{generatedStory.title}</h3>
          <div class="story-meta">
            <span>📄 {generatedStory.metadata.pageCount} pages</span>
            <span>⏱️ {generatedStory.metadata.readingTime}</span>
            <span>🎨 {generatedStory.metadata.genre}</span>
          </div>
          
          <div class="chapters-preview">
            {#each generatedStory.chapters as chapter}
              <div class="chapter-preview">
                <div class="chapter-image">{chapter.image}</div>
                <div class="chapter-info">
                  <h4>{chapter.title}</h4>
                  <p>{chapter.content.substring(0, 100)}...</p>
                </div>
              </div>
            {/each}
          </div>
          
          <div class="characters-preview">
            <h4>Characters</h4>
            {#each generatedStory.characters as char}
              <div class="character">
                <span class="char-name">{char.name}</span>
                <span class="char-role">{char.role}</span>
              </div>
            {/each}
          </div>
        </div>
        
        <div class="preview-actions">
          <button class="btn-secondary" on:click={() => step = 'settings'}>← Edit Settings</button>
          <button class="btn-primary">Save & Continue →</button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .editor {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  
  .progress-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 30px;
    border-bottom: 1px solid #2a2f4a;
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    opacity: 0.4;
    transition: opacity 0.2s;
  }
  
  .step.active {
    opacity: 1;
  }
  
  .step .number {
    width: 32px;
    height: 32px;
    background: #2a2f4a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
  }
  
  .step.active .number {
    background: linear-gradient(135deg, #6a7abf, #8a9acf);
    color: white;
  }
  
  .step .label {
    font-size: 12px;
    color: #a0a0b0;
  }
  
  .connector {
    width: 40px;
    height: 2px;
    background: #2a2f4a;
    opacity: 0.4;
  }
  
  .connector.active {
    background: linear-gradient(135deg, #6a7abf, #8a9acf);
    opacity: 1;
  }
  
  .content {
    flex: 1;
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .input-section,
  .settings-section,
  .preview-section {
    width: 100%;
    max-width: 800px;
  }
  
  .input-section h2,
  .settings-section h2,
  .preview-section h2 {
    margin: 0 0 8px;
    font-size: 28px;
  }
  
  .input-section p,
  .settings-section p,
  .preview-section p {
    color: #a0a0b0;
    margin: 0 0 24px;
  }
  
  textarea {
    width: 100%;
    background: #1a1f3a;
    color: #e0e0e0;
    border: 1px solid #2a2f4a;
    border-radius: 8px;
    padding: 16px;
    font-family: monospace;
    font-size: 14px;
    resize: vertical;
    margin-bottom: 24px;
  }
  
  textarea:focus {
    outline: none;
    border-color: #4a5a9f;
  }
  
  .upload-area {
    background: #1a1f3a;
    border: 2px dashed #2a2f4a;
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    margin-bottom: 24px;
  }
  
  .upload-area:hover {
    border-color: #4a5a9f;
    background: #2a2f4a;
  }
  
  .upload-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }
  
  .upload-area p {
    margin: 0 0 12px;
  }
  
  .upload-area input {
    display: block;
    width: 100%;
  }
  
  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .setting {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .setting label {
    font-weight: 600;
    font-size: 13px;
    color: #a0a0b0;
  }
  
  .setting select {
    background: #1a1f3a;
    color: #e0e0e0;
    border: 1px solid #2a2f4a;
    border-radius: 6px;
    padding: 10px;
    font-size: 14px;
  }
  
  .setting select:focus {
    outline: none;
    border-color: #4a5a9f;
  }
  
  .input-actions,
  .settings-actions,
  .preview-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #6a7abf, #8a9acf);
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: scale(1.02);
  }
  
  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-secondary {
    background: #2a2f4a;
    color: #e0e0e0;
  }
  
  .btn-secondary:hover {
    background: #3a3f4a;
  }
  
  .generating-section {
    text-align: center;
    width: 100%;
    max-width: 600px;
  }
  
  .generating-section h2 {
    margin: 0 0 8px;
    font-size: 28px;
  }
  
  .progress-steps {
    display: flex;
    justify-content: space-between;
    margin: 40px 0;
    gap: 12px;
  }
  
  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    opacity: 0.4;
  }
  
  .progress-step.complete {
    opacity: 1;
  }
  
  .progress-dot {
    width: 24px;
    height: 24px;
    background: #2a2f4a;
    border-radius: 50%;
    transition: all 0.3s;
  }
  
  .progress-step.complete .progress-dot {
    background: linear-gradient(135deg, #6a7abf, #8a9acf);
  }
  
  .progress-label {
    font-size: 12px;
    color: #a0a0b0;
  }
  
  .progress-bar-visual {
    width: 100%;
    height: 8px;
    background: #2a2f4a;
    border-radius: 4px;
    overflow: hidden;
    margin: 20px 0;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6a7abf, #8a9acf);
    transition: width 0.3s;
  }
  
  .progress-text {
    color: #a0a0b0;
    font-size: 14px;
    margin: 0;
  }
  
  .story-preview {
    background: #1a1f3a;
    border: 1px solid #2a2f4a;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
  }
  
  .story-preview h3 {
    margin: 0 0 12px;
    font-size: 24px;
  }
  
  .story-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #2a2f4a;
    font-size: 13px;
    color: #a0a0b0;
  }
  
  .chapters-preview {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }
  
  .chapter-preview {
    display: flex;
    gap: 12px;
    padding: 12px;
    background: #2a2f4a;
    border-radius: 8px;
  }
  
  .chapter-image {
    font-size: 32px;
  }
  
  .chapter-info h4 {
    margin: 0 0 4px;
    font-size: 13px;
  }
  
  .chapter-info p {
    margin: 0;
    font-size: 12px;
    color: #a0a0b0;
  }
  
  .characters-preview {
    padding-top: 16px;
    border-top: 1px solid #2a2f4a;
  }
  
  .characters-preview h4 {
    margin: 0 0 12px;
    font-size: 14px;
  }
  
  .character {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background: #2a2f4a;
    border-radius: 6px;
    margin-bottom: 8px;
    font-size: 12px;
  }
  
  .char-name {
    font-weight: 600;
  }
  
  .char-role {
    color: #a0a0b0;
  }
</style>
