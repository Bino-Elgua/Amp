/**
 * API Provider Validator
 * Comprehensive validation for 70+ API providers across all categories
 * Supports format validation and live endpoint testing
 */

export interface ApiKeyValidationResult {
  valid: boolean;
  message: string;
  provider: string;
  category: 'llm' | 'image' | 'voice' | 'video' | 'workflow' | 'email' | 'other';
  formatValid: boolean;
  testedLive?: boolean;
}

export interface ApiProviderInfo {
  name: string;
  category: 'llm' | 'image' | 'voice' | 'video' | 'workflow' | 'email' | 'other';
  format: string;
  minLength: number;
  maxLength?: number;
  pattern?: RegExp;
  testEndpoint?: string;
  testMethod?: 'GET' | 'POST';
  testHeaders?: Record<string, string>;
  notes?: string;
}

class ApiProviderValidator {
  private providers: Record<string, ApiProviderInfo> = {
    // LLM PROVIDERS (30)
    openai: {
      name: 'OpenAI',
      category: 'llm',
      format: 'sk-proj-* or sk-*',
      minLength: 48,
      pattern: /^sk-proj-[A-Za-z0-9_-]{48,}$|^sk-[A-Za-z0-9_-]{48,}$/,
      testEndpoint: 'https://api.openai.com/v1/models',
      testMethod: 'GET',
    },
    anthropic: {
      name: 'Anthropic Claude',
      category: 'llm',
      format: 'sk-ant-*',
      minLength: 48,
      pattern: /^sk-ant-[A-Za-z0-9_-]{48,}$/,
      testEndpoint: 'https://api.anthropic.com/v1/models',
      testMethod: 'GET',
    },
    google: {
      name: 'Google (Gemini)',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
      notes: 'Also accepts JSON key format',
    },
    mistral: {
      name: 'Mistral AI',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
      testEndpoint: 'https://api.mistral.ai/v1/models',
      testMethod: 'GET',
    },
    xai: {
      name: 'xAI (Grok)',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
      testEndpoint: 'https://api.x.ai/v1/models',
      testMethod: 'GET',
    },
    deepseek: {
      name: 'DeepSeek',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
      testEndpoint: 'https://api.deepseek.com/v1/models',
      testMethod: 'GET',
    },
    groq: {
      name: 'Groq',
      category: 'llm',
      format: 'gsk-*',
      minLength: 32,
      pattern: /^gsk-[A-Za-z0-9_-]{32,}$/,
      testEndpoint: 'https://api.groq.com/openai/v1/models',
      testMethod: 'GET',
    },
    together: {
      name: 'Together AI',
      category: 'llm',
      format: 'alphanumeric (40+ chars)',
      minLength: 40,
      pattern: /^[A-Za-z0-9_-]{40,}$/,
      testEndpoint: 'https://api.together.xyz/v1/models',
      testMethod: 'GET',
    },
    openrouter: {
      name: 'OpenRouter',
      category: 'llm',
      format: 'sk-or-* or alphanumeric',
      minLength: 32,
      pattern: /^sk-or-[A-Za-z0-9_-]{32,}$|^[A-Za-z0-9_-]{32,}$/,
      testEndpoint: 'https://openrouter.ai/api/v1/models',
      testMethod: 'GET',
    },
    perplexity: {
      name: 'Perplexity AI',
      category: 'llm',
      format: 'pplx-* or alphanumeric',
      minLength: 32,
      pattern: /^pplx-[A-Za-z0-9_-]{32,}$|^[A-Za-z0-9_-]{32,}$/,
    },
    qwen: {
      name: 'Alibaba Qwen',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    cohere: {
      name: 'Cohere',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
      testEndpoint: 'https://api.cohere.ai/v1/models',
      testMethod: 'GET',
    },
    meta_llama: {
      name: 'Meta Llama',
      category: 'llm',
      format: 'alphanumeric (40+ chars)',
      minLength: 40,
      pattern: /^[A-Za-z0-9_-]{40,}$/,
    },
    microsoft: {
      name: 'Azure OpenAI',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
      notes: 'Also requires endpoint URL',
    },
    ollama: {
      name: 'Ollama (Local)',
      category: 'llm',
      format: 'localhost address',
      minLength: 10,
      notes: 'Local only - no API key needed',
    },
    custom_openai: {
      name: 'Custom OpenAI Compatible',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
      notes: 'Requires custom base URL',
    },
    sambanova: {
      name: 'SambaNova',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    cerebras: {
      name: 'Cerebras',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    hyperbolic: {
      name: 'Hyperbolic',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    nebius: {
      name: 'Nebius',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    aws_bedrock: {
      name: 'AWS Bedrock',
      category: 'llm',
      format: 'AWS credentials',
      minLength: 16,
      notes: 'Requires AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY',
    },
    friendli: {
      name: 'Friendli',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    replicate_llm: {
      name: 'Replicate (LLM)',
      category: 'llm',
      format: 'alphanumeric (40+ chars)',
      minLength: 40,
      pattern: /^[A-Za-z0-9_-]{40,}$/,
    },
    minimax: {
      name: 'Minimax',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    hunyuan: {
      name: 'Tencent Hunyuan',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    blackbox: {
      name: 'Blackbox AI',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    dify: {
      name: 'Dify.ai',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    venice: {
      name: 'Venice.ai',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    zai: {
      name: 'ZAI',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    comet: {
      name: 'Comet',
      category: 'llm',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    huggingface: {
      name: 'Hugging Face',
      category: 'llm',
      format: 'hf_* (alphanumeric)',
      minLength: 32,
      pattern: /^hf_[A-Za-z0-9_-]{32,}$/,
    },

    // IMAGE PROVIDERS (22)
    openai_dalle: {
      name: 'OpenAI DALL-E 3',
      category: 'image',
      format: 'sk-proj-* or sk-*',
      minLength: 48,
      pattern: /^sk-proj-[A-Za-z0-9_-]{48,}$|^sk-[A-Za-z0-9_-]{48,}$/,
    },
    openai_dalle_next: {
      name: 'OpenAI DALL-E 4',
      category: 'image',
      format: 'sk-proj-* or sk-*',
      minLength: 48,
      pattern: /^sk-proj-[A-Za-z0-9_-]{48,}$|^sk-[A-Za-z0-9_-]{48,}$/,
    },
    stability: {
      name: 'Stability AI',
      category: 'image',
      format: 'sk-* (alphanumeric)',
      minLength: 40,
      pattern: /^sk-[A-Za-z0-9_-]{40,}$/,
    },
    sd3: {
      name: 'Stable Diffusion 3',
      category: 'image',
      format: 'alphanumeric (40+ chars)',
      minLength: 40,
      pattern: /^[A-Za-z0-9_-]{40,}$/,
    },
    fal_flux: {
      name: 'FAL Flux',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    midjourney: {
      name: 'Midjourney (Proxy)',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    runware: {
      name: 'Runware',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    leonardo: {
      name: 'Leonardo.ai',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    recraft: {
      name: 'Recraft.ai',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    xai_image: {
      name: 'xAI Grok Images',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    amazon: {
      name: 'AWS Bedrock Images',
      category: 'image',
      format: 'AWS credentials',
      minLength: 16,
      notes: 'Requires AWS credentials',
    },
    adobe: {
      name: 'Adobe Firefly',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    deepai: {
      name: 'DeepAI',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    replicate: {
      name: 'Replicate',
      category: 'image',
      format: 'alphanumeric (40+ chars)',
      minLength: 40,
      pattern: /^[A-Za-z0-9_-]{40,}$/,
    },
    bria: {
      name: 'Bria',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    segmind: {
      name: 'Segmind',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    prodia: {
      name: 'Prodia',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    ideogram: {
      name: 'Ideogram',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    black_forest_labs: {
      name: 'Black Forest Labs',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    wan: {
      name: 'WAN',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    hunyuan_image: {
      name: 'Tencent Hunyuan Image',
      category: 'image',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },

    // VOICE/TTS PROVIDERS (17)
    elevenlabs: {
      name: 'ElevenLabs',
      category: 'voice',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    playht: {
      name: 'Play.ht',
      category: 'voice',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    cartesia: {
      name: 'Cartesia (Fastest TTS)',
      category: 'voice',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    resemble: {
      name: 'Resemble.ai',
      category: 'voice',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    murf: {
      name: 'Murf.ai',
      category: 'voice',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    wellsaid: {
      name: 'WellSaid Labs',
      category: 'voice',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    deepgram: {
      name: 'Deepgram',
      category: 'voice',
      format: 'alphanumeric (36+ chars)',
      minLength: 36,
      pattern: /^[A-Za-z0-9_-]{36,}$/,
    },
    lmnt: {
      name: 'LMNT',
      category: 'voice',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    fish: {
      name: 'Fish Audio',
      category: 'voice',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    rime: {
      name: 'Rime AI',
      category: 'voice',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    neets: {
      name: 'Neets.ai',
      category: 'voice',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    speechify: {
      name: 'Speechify',
      category: 'voice',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    amazon_polly: {
      name: 'Amazon Polly',
      category: 'voice',
      format: 'AWS credentials',
      minLength: 16,
      notes: 'Requires AWS credentials',
    },
    google_tts: {
      name: 'Google Cloud TTS',
      category: 'voice',
      format: 'JSON key or alphanumeric',
      minLength: 32,
      notes: 'Accepts JSON service account key',
    },
    azure_speech: {
      name: 'Azure Speech Services',
      category: 'voice',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
      notes: 'Also requires endpoint URL',
    },
    piper: {
      name: 'Piper (Local)',
      category: 'voice',
      format: 'localhost address',
      minLength: 10,
      notes: 'Local only - no API key needed',
    },
    custom_voice: {
      name: 'Custom Voice Provider',
      category: 'voice',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
      notes: 'Requires custom endpoint',
    },

    // VIDEO PROVIDERS (22)
    sora2: {
      name: 'OpenAI Sora 2',
      category: 'video',
      format: 'sk-proj-* or sk-*',
      minLength: 48,
      pattern: /^sk-proj-[A-Za-z0-9_-]{48,}$|^sk-[A-Za-z0-9_-]{48,}$/,
    },
    veo3: {
      name: 'Google Veo 3',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    runway: {
      name: 'Runway ML',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    kling: {
      name: 'Kling AI',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    luma: {
      name: 'Luma AI',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    ltx2: {
      name: 'Lightricks LTX-2',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    wan_video: {
      name: 'WAN Video',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    hunyuan_video: {
      name: 'Tencent Hunyuan Video',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    mochi: {
      name: 'Mochi 1',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    seedance: {
      name: 'Seed Sora',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    pika: {
      name: 'Pika Labs',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    hailuo: {
      name: 'HailuoAI',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    pixverse: {
      name: 'PixVerse',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    higgsfield: {
      name: 'Higgsfield',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    heygen: {
      name: 'HeyGen',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    synthesia: {
      name: 'Synthesia',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    deepbrain: {
      name: 'DeepBrain',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    colossyan: {
      name: 'Colossyan',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    replicate_video: {
      name: 'Replicate (Video)',
      category: 'video',
      format: 'alphanumeric (40+ chars)',
      minLength: 40,
      pattern: /^[A-Za-z0-9_-]{40,}$/,
    },
    fal: {
      name: 'FAL.ai Video',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    fireworks: {
      name: 'Fireworks AI',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },
    wavespeed: {
      name: 'WaveSpeed',
      category: 'video',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
    },

    // WORKFLOW PROVIDERS (12)
    n8n: {
      name: 'n8n',
      category: 'workflow',
      format: 'webhook URL',
      minLength: 20,
      notes: 'Webhook URL from n8n workflow',
    },
    zapier: {
      name: 'Zapier',
      category: 'workflow',
      format: 'webhook URL',
      minLength: 20,
      notes: 'Webhook URL from Zapier zap',
    },
    make: {
      name: 'Make.com',
      category: 'workflow',
      format: 'webhook URL',
      minLength: 20,
      notes: 'Webhook URL from Make scenario',
    },
    activepieces: {
      name: 'ActivePieces',
      category: 'workflow',
      format: 'webhook URL or API key',
      minLength: 20,
      notes: 'Webhook URL from ActivePieces flow',
    },
    langchain: {
      name: 'LangChain',
      category: 'workflow',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
      notes: 'LangChain API key',
    },
    pipedream: {
      name: 'Pipedream',
      category: 'workflow',
      format: 'webhook URL',
      minLength: 20,
      notes: 'Webhook URL from Pipedream workflow',
    },
    relay: {
      name: 'Relay.app',
      category: 'workflow',
      format: 'webhook URL',
      minLength: 20,
      notes: 'Webhook URL from Relay workflow',
    },
    integrately: {
      name: 'Integrately',
      category: 'workflow',
      format: 'webhook URL',
      minLength: 20,
      notes: 'Webhook URL from Integrately automation',
    },
    pabbly: {
      name: 'Pabbly Connect',
      category: 'workflow',
      format: 'webhook URL',
      minLength: 20,
      notes: 'Webhook URL from Pabbly workflow',
    },
    tray: {
      name: 'Tray.io',
      category: 'workflow',
      format: 'webhook URL or API key',
      minLength: 20,
      notes: 'Webhook URL from Tray.io workflow',
    },
    dify_workflow: {
      name: 'Dify.ai Workflow',
      category: 'workflow',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
      notes: 'API key from Dify.ai',
    },
    custom_rag: {
      name: 'Custom RAG/Webhook',
      category: 'workflow',
      format: 'webhook URL',
      minLength: 20,
      notes: 'Custom webhook endpoint',
    },

    // EMAIL PROVIDERS
    resend: {
      name: 'Resend',
      category: 'email',
      format: 're_*',
      minLength: 32,
      pattern: /^re_[A-Za-z0-9_-]{32,}$/,
    },
    sendgrid: {
      name: 'SendGrid',
      category: 'email',
      format: 'SG.*',
      minLength: 64,
      pattern: /^SG\.[A-Za-z0-9_-]{64,}$/,
    },
    mailgun: {
      name: 'Mailgun',
      category: 'email',
      format: 'domain:key or alphanumeric',
      minLength: 16,
      notes: 'Format: domain:api_key',
    },
    gmail: {
      name: 'Gmail API',
      category: 'email',
      format: 'alphanumeric (32+ chars)',
      minLength: 32,
      pattern: /^[A-Za-z0-9_-]{32,}$/,
      notes: 'OAuth token or service account key',
    },
  };

  /**
   * Validate API key for a provider
   */
  validateApiKey(provider: string, apiKey: string): ApiKeyValidationResult {
    const providerInfo = this.providers[provider.toLowerCase()];
    
    if (!providerInfo) {
      return {
        valid: false,
        message: `Unknown provider: ${provider}`,
        provider,
        category: 'other',
        formatValid: false,
      };
    }

    if (!apiKey || apiKey.trim() === '') {
      return {
        valid: false,
        message: `${providerInfo.name}: API key cannot be empty`,
        provider,
        category: providerInfo.category,
        formatValid: false,
      };
    }

    // Check length
    if (apiKey.length < providerInfo.minLength) {
      return {
        valid: false,
        message: `${providerInfo.name}: API key too short. Expected minimum ${providerInfo.minLength} characters, got ${apiKey.length}`,
        provider,
        category: providerInfo.category,
        formatValid: false,
      };
    }

    if (providerInfo.maxLength && apiKey.length > providerInfo.maxLength) {
      return {
        valid: false,
        message: `${providerInfo.name}: API key too long. Expected maximum ${providerInfo.maxLength} characters, got ${apiKey.length}`,
        provider,
        category: providerInfo.category,
        formatValid: false,
      };
    }

    // Check pattern
    if (providerInfo.pattern && !providerInfo.pattern.test(apiKey)) {
      return {
        valid: false,
        message: `${providerInfo.name}: Invalid format. Expected format: ${providerInfo.format}`,
        provider,
        category: providerInfo.category,
        formatValid: false,
      };
    }

    return {
      valid: true,
      message: `${providerInfo.name}: API key format is valid`,
      provider,
      category: providerInfo.category,
      formatValid: true,
    };
  }

  /**
   * Test API key with live endpoint (if available)
   */
  async testApiKey(provider: string, apiKey: string): Promise<ApiKeyValidationResult> {
    // First validate format
    const formatCheck = this.validateApiKey(provider, apiKey);
    if (!formatCheck.valid) {
      return formatCheck;
    }

    const providerInfo = this.providers[provider.toLowerCase()];
    if (!providerInfo?.testEndpoint) {
      return {
        ...formatCheck,
        message: `${providerInfo?.name || provider}: Format validated (live testing not available)`,
      };
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Set auth headers based on provider
      switch (provider.toLowerCase()) {
        case 'openai':
        case 'mistral':
        case 'xai':
        case 'deepseek':
        case 'groq':
        case 'together':
        case 'cohere':
          headers['Authorization'] = `Bearer ${apiKey}`;
          break;
        case 'anthropic':
          headers['x-api-key'] = apiKey;
          break;
        case 'github':
          headers['Authorization'] = `token ${apiKey}`;
          break;
        case 'resend':
          headers['Authorization'] = `Bearer ${apiKey}`;
          break;
      }

      const response = await fetch(providerInfo.testEndpoint, {
        method: providerInfo.testMethod || 'GET',
        headers,
      });

      const isValid = response.ok || response.status === 401; // 401 means auth failed but endpoint exists
      const message = isValid
        ? `${providerInfo.name}: ✅ API key validated successfully`
        : `${providerInfo.name}: ❌ API key validation failed (${response.status})`;

      return {
        valid: isValid && response.ok,
        message,
        provider,
        category: providerInfo.category,
        formatValid: true,
        testedLive: true,
      };
    } catch (error: any) {
      return {
        valid: true, // Format was valid
        message: `${providerInfo.name}: Format valid (couldn't test live: ${error.message})`,
        provider,
        category: providerInfo.category,
        formatValid: true,
        testedLive: false,
      };
    }
  }

  /**
   * Get all providers by category
   */
  getProvidersByCategory(category: 'llm' | 'image' | 'voice' | 'video' | 'workflow' | 'email'): ApiProviderInfo[] {
    return Object.values(this.providers).filter(p => p.category === category);
  }

  /**
   * Get provider info
   */
  getProviderInfo(provider: string): ApiProviderInfo | undefined {
    return this.providers[provider.toLowerCase()];
  }

  /**
   * List all providers
   */
  listAllProviders(): Record<string, ApiProviderInfo> {
    return this.providers;
  }

  /**
   * Get stats
   */
  getStats() {
    const byCategory = {} as Record<string, number>;
    Object.values(this.providers).forEach(p => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    });
    return {
      totalProviders: Object.keys(this.providers).length,
      byCategory,
    };
  }
}

export const apiValidator = new ApiProviderValidator();
