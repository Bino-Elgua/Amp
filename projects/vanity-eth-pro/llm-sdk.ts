/**
 * ÀṣẹMirror — Multi-LLM Provider SDK
 * Choose between OpenAI, Claude, Gemini, Mistral, Groq, Cohere
 * Unified interface for embeddings + chat completions
 */

export type LLMProvider = 
  | "openai" 
  | "claude" 
  | "gemini" 
  | "mistral" 
  | "groq" 
  | "cohere";

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model?: string;
  baseURL?: string;
}

export interface EmbeddingRequest {
  text: string | string[];
  model?: string;
}

export interface EmbeddingResponse {
  embeddings: number[][];
  usage: { tokens: number };
}

export interface ChatRequest {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  content: string;
  usage: { inputTokens: number; outputTokens: number };
}

/**
 * LLM Provider Factory
 */
export class LLMClient {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    if (!config.apiKey) throw new Error(`API key required for ${config.provider}`);
  }

  async embed(req: EmbeddingRequest): Promise<EmbeddingResponse> {
    switch (this.config.provider) {
      case "openai":
        return this.openaiEmbed(req);
      case "cohere":
        return this.cohereEmbed(req);
      case "gemini":
        return this.geminiEmbed(req);
      case "mistral":
        return this.mistralEmbed(req);
      default:
        throw new Error(`Embeddings not supported for ${this.config.provider}`);
    }
  }

  async chat(req: ChatRequest): Promise<ChatResponse> {
    switch (this.config.provider) {
      case "openai":
        return this.openaiChat(req);
      case "claude":
        return this.claudeChat(req);
      case "gemini":
        return this.geminiChat(req);
      case "mistral":
        return this.mistralChat(req);
      case "groq":
        return this.groqChat(req);
      case "cohere":
        return this.cohereChat(req);
      default:
        throw new Error(`Unknown provider: ${this.config.provider}`);
    }
  }

  // ============ OpenAI (GPT-4, GPT-4o, GPT-3.5-turbo) ============
  private async openaiEmbed(req: EmbeddingRequest): Promise<EmbeddingResponse> {
    const texts = Array.isArray(req.text) ? req.text : [req.text];
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: req.model || "text-embedding-3-small",
        input: texts,
      }),
    });
    const data = await response.json();
    return {
      embeddings: data.data.map((item: any) => item.embedding),
      usage: { tokens: data.usage.total_tokens },
    };
  }

  private async openaiChat(req: ChatRequest): Promise<ChatResponse> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || "gpt-4o",
        messages: req.messages,
        temperature: req.temperature || 0.7,
        max_tokens: req.maxTokens || 1024,
      }),
    });
    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
      },
    };
  }

  // ============ Anthropic Claude (Claude 3, Claude 3.5) ============
  private async claudeChat(req: ChatRequest): Promise<ChatResponse> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.config.model || "claude-3-5-sonnet-20241022",
        max_tokens: req.maxTokens || 1024,
        system: req.messages.find(m => m.role === "system")?.content || "",
        messages: req.messages.filter(m => m.role !== "system"),
      }),
    });
    const data = await response.json();
    return {
      content: data.content[0].text,
      usage: {
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
      },
    };
  }

  // ============ Google Gemini (Gemini 2.0, Gemini 1.5) ============
  private async geminiChat(req: ChatRequest): Promise<ChatResponse> {
    const model = this.config.model || "gemini-2.0-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: req.messages.map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: {
            temperature: req.temperature || 0.7,
            maxOutputTokens: req.maxTokens || 1024,
          },
        }),
      }
    );
    const data = await response.json();
    return {
      content: data.candidates[0].content.parts[0].text,
      usage: {
        inputTokens: data.usageMetadata.promptTokenCount,
        outputTokens: data.usageMetadata.candidatesTokenCount,
      },
    };
  }

  private async geminiEmbed(req: EmbeddingRequest): Promise<EmbeddingResponse> {
    const texts = Array.isArray(req.text) ? req.text : [req.text];
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:batchEmbed?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: texts.map(text => ({ input: { content: text } })),
        }),
      }
    );
    const data = await response.json();
    return {
      embeddings: data.embeddings.map((e: any) => e.values),
      usage: { tokens: texts.length },
    };
  }

  // ============ Mistral AI (Mistral Large, Mistral Medium) ============
  private async mistralChat(req: ChatRequest): Promise<ChatResponse> {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || "mistral-large-latest",
        messages: req.messages,
        temperature: req.temperature || 0.7,
        max_tokens: req.maxTokens || 1024,
      }),
    });
    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
      },
    };
  }

  private async mistralEmbed(req: EmbeddingRequest): Promise<EmbeddingResponse> {
    const texts = Array.isArray(req.text) ? req.text : [req.text];
    const response = await fetch("https://api.mistral.ai/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: req.model || "mistral-embed",
        input: texts,
      }),
    });
    const data = await response.json();
    return {
      embeddings: data.data.map((item: any) => item.embedding),
      usage: { tokens: data.usage.prompt_tokens },
    };
  }

  // ============ Groq (LLaMA, Mixtral) ============
  private async groqChat(req: ChatRequest): Promise<ChatResponse> {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || "mixtral-8x7b-32768",
        messages: req.messages,
        temperature: req.temperature || 0.7,
        max_tokens: req.maxTokens || 1024,
      }),
    });
    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
      },
    };
  }

  // ============ Cohere (Command, Rerank) ============
  private async cohereChat(req: ChatRequest): Promise<ChatResponse> {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.config.model || "command-r-plus",
        messages: req.messages.map(m => ({
          role: m.role,
          message: m.content,
        })),
        temperature: req.temperature || 0.7,
        max_tokens: req.maxTokens || 1024,
      }),
    });
    const data = await response.json();
    return {
      content: data.text,
      usage: {
        inputTokens: 0,
        outputTokens: 0,
      },
    };
  }

  private async cohereEmbed(req: EmbeddingRequest): Promise<EmbeddingResponse> {
    const texts = Array.isArray(req.text) ? req.text : [req.text];
    const response = await fetch("https://api.cohere.ai/v1/embed", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: req.model || "embed-english-v3.0",
        texts: texts,
        input_type: "search_document",
      }),
    });
    const data = await response.json();
    return {
      embeddings: data.embeddings,
      usage: { tokens: texts.length },
    };
  }
}

/**
 * Easy multi-provider configuration
 */
export const LLM_PRESETS = {
  openai: {
    embedding: "text-embedding-3-small",
    chat: "gpt-4o",
  },
  claude: {
    chat: "claude-3-5-sonnet-20241022",
  },
  gemini: {
    embedding: "embedding-001",
    chat: "gemini-2.0-flash",
  },
  mistral: {
    embedding: "mistral-embed",
    chat: "mistral-large-latest",
  },
  groq: {
    chat: "mixtral-8x7b-32768",
  },
  cohere: {
    embedding: "embed-english-v3.0",
    chat: "command-r-plus",
  },
};

/**
 * Usage example:
 * 
 * const client = new LLMClient({
 *   provider: "openai",
 *   apiKey: process.env.OPENAI_API_KEY,
 * });
 * 
 * const response = await client.chat({
 *   messages: [
 *     { role: "system", content: "You are a Technosis oracle" },
 *     { role: "user", content: "What is the 7-layer stack?" }
 *   ]
 * });
 */
