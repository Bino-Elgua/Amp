<script>
  import { onMount } from 'svelte';

  let settings = {
    llmProvider: 'openai',
    apiKey: '',
    qdrantUrl: 'http://localhost:6333',
    githubRepos: 'jbino85/council,jbino85/oso-lang,jbino85/ifascript,jbino85/techgnosis',
    phoneKey: '',
  };

  let showSettings = false;
  let saveStatus = '';
  let isConfigured = false;

  onMount(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('asemirror_config');
    if (saved) {
      settings = JSON.parse(saved);
      isConfigured = !!settings.apiKey;
    }
  });

  function saveSettings() {
    if (!settings.apiKey) {
      saveStatus = '❌ API key required';
      return;
    }

    localStorage.setItem('asemirror_config', JSON.stringify(settings));
    isConfigured = true;
    saveStatus = '✅ Settings saved!';
    setTimeout(() => {
      saveStatus = '';
      showSettings = false;
    }, 2000);
  }

  function resetSettings() {
    if (confirm('Are you sure? This will clear all settings.')) {
      localStorage.removeItem('asemirror_config');
      settings = {
        llmProvider: 'openai',
        apiKey: '',
        qdrantUrl: 'http://localhost:6333',
        githubRepos: 'jbino85/council,jbino85/oso-lang,jbino85/ifascript,jbino85/techgnosis',
        phoneKey: '',
      };
      isConfigured = false;
      saveStatus = '🔄 Settings reset';
    }
  }
</script>

<div class="settings-container">
  {#if !isConfigured}
    <div class="settings-modal-overlay">
      <div class="settings-modal">
        <h2>⚙️ Configure ÀṣẹMirror</h2>
        <p class="subtitle">Choose your LLM provider & add API key</p>

        <div class="form-group">
          <label>LLM Provider</label>
          <select bind:value={settings.llmProvider}>
            <option value="openai">OpenAI (GPT-4o) - Most capable</option>
            <option value="claude">Claude (Anthropic) - Best reasoning</option>
            <option value="gemini">Gemini (Google) - Cheapest, free tier</option>
            <option value="mistral">Mistral - Privacy-friendly</option>
            <option value="groq">Groq - Fastest, free tier</option>
            <option value="cohere">Cohere - Enterprise</option>
          </select>
          <p class="help-text">
            {#if settings.llmProvider === 'openai'}
              Get key: https://platform.openai.com/api-keys
            {:else if settings.llmProvider === 'claude'}
              Get key: https://console.anthropic.com
            {:else if settings.llmProvider === 'gemini'}
              Get key: https://aistudio.google.com (FREE TIER)
            {:else if settings.llmProvider === 'mistral'}
              Get key: https://console.mistral.ai
            {:else if settings.llmProvider === 'groq'}
              Get key: https://console.groq.com (FREE TIER)
            {:else if settings.llmProvider === 'cohere'}
              Get key: https://dashboard.cohere.ai
            {/if}
          </p>
        </div>

        <div class="form-group">
          <label>API Key</label>
          <input
            type="password"
            placeholder="Paste your API key here"
            bind:value={settings.apiKey}
          />
        </div>

        <div class="form-group">
          <label>Qdrant URL (Vector DB)</label>
          <input
            type="text"
            placeholder="http://localhost:6333"
            bind:value={settings.qdrantUrl}
          />
          <p class="help-text">
            Run locally: <code>docker run -d --name qdrant -p 6333:6333 qdrant/qdrant</code>
          </p>
        </div>

        <div class="form-group">
          <label>GitHub Repos (comma-separated)</label>
          <input
            type="text"
            placeholder="jbino85/council,jbino85/oso-lang,..."
            bind:value={settings.githubRepos}
          />
        </div>

        <div class="form-group">
          <label>Phone Key (optional)</label>
          <input
            type="text"
            placeholder="Your secret key"
            bind:value={settings.phoneKey}
          />
        </div>

        {#if saveStatus}
          <p class="status">{saveStatus}</p>
        {/if}

        <div class="button-group">
          <button class="btn-primary" on:click={saveSettings}>💾 Save Settings</button>
        </div>
      </div>
    </div>
  {:else}
    <button class="btn-settings" on:click={() => (showSettings = !showSettings)}>
      ⚙️ Settings
    </button>

    {#if showSettings}
      <div class="settings-panel">
        <h3>Settings</h3>

        <div class="setting-item">
          <span>LLM Provider:</span>
          <strong>{settings.llmProvider}</strong>
        </div>

        <div class="setting-item">
          <span>Qdrant URL:</span>
          <code>{settings.qdrantUrl}</code>
        </div>

        <div class="setting-item">
          <span>API Key:</span>
          <code>{'*'.repeat(Math.max(settings.apiKey.length - 4, 0))} {settings.apiKey.slice(-4)}</code>
        </div>

        <div class="button-group">
          <button class="btn-secondary" on:click={() => (showSettings = false)}>Close</button>
          <button class="btn-danger" on:click={resetSettings}>🔄 Reset All</button>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .settings-container {
    position: relative;
  }

  .settings-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .settings-modal {
    background: #111;
    border: 2px solid #dc2626;
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(220, 38, 38, 0.3);
  }

  .settings-modal h2 {
    margin: 0 0 0.5rem 0;
    color: #fff;
    font-size: 1.5rem;
  }

  .subtitle {
    color: #999;
    margin: 0 0 1.5rem 0;
    font-size: 0.9rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    color: #fff;
    font-weight: bold;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  input,
  select {
    width: 100%;
    padding: 0.75rem;
    background: #1f2937;
    border: 1px solid #4b5563;
    border-radius: 6px;
    color: #fff;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 8px rgba(220, 38, 38, 0.3);
  }

  .help-text {
    color: #666;
    font-size: 0.75rem;
    margin-top: 0.5rem;
  }

  code {
    background: #0a0a0a;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-size: 0.75rem;
    color: #ffaa00;
  }

  .status {
    text-align: center;
    padding: 0.75rem;
    border-radius: 6px;
    background: #1f2937;
    color: #4ade80;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .button-group {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .btn-primary {
    background: #dc2626;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary:hover {
    background: #b91c1c;
  }

  .btn-secondary {
    background: #4b5563;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: #6b7280;
  }

  .btn-danger {
    background: #8b0000;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-danger:hover {
    background: #a00000;
  }

  .btn-settings {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: #dc2626;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 50px;
    font-weight: bold;
    cursor: pointer;
    z-index: 100;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
  }

  .btn-settings:hover {
    background: #b91c1c;
    box-shadow: 0 6px 16px rgba(220, 38, 38, 0.6);
  }

  .settings-panel {
    position: fixed;
    bottom: 5rem;
    right: 2rem;
    background: #1f2937;
    border: 1px solid #4b5563;
    border-radius: 8px;
    padding: 1rem;
    min-width: 300px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    z-index: 99;
  }

  .settings-panel h3 {
    margin: 0 0 1rem 0;
    color: #fff;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #374151;
    font-size: 0.85rem;
  }

  .setting-item:last-of-type {
    border-bottom: none;
  }

  .setting-item span {
    color: #999;
  }

  .setting-item strong {
    color: #ffaa00;
  }
</style>
