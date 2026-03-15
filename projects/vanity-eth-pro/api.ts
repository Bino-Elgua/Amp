/**
 * ÀṣẹMirror API Server (Cloudflare Workers)
 * Endpoints: search, chat, timeline, visualizations
 */

import { LLMClient } from "./llm-sdk";

interface PhoneRequest {
  phoneKey: string;
  action: string;
  query?: string;
  messages?: any[];
}

interface PhoneResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Validate phone key (simple token-based auth for now)
 */
function validatePhoneKey(key: string, storedKey: string): boolean {
  return key === storedKey;
}

/**
 * Main request handler
 */
export async function handleRequest(
  request: Request,
  env: any
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const body = (await request.json()) as PhoneRequest;

    // Auth
    if (!validatePhoneKey(body.phoneKey, env.PHONE_KEY)) {
      return jsonResponse({ success: false, error: "Invalid phone key" }, 401);
    }

    const llmClient = new LLMClient({
      provider: env.LLM_PROVIDER,
      apiKey: env[`${env.LLM_PROVIDER.toUpperCase()}_API_KEY`],
    });

    // Route by action
    switch (body.action) {
      case "search":
        return await handleSearch(body.query, llmClient, env);
      case "chat":
        return await handleChat(body.messages, llmClient);
      case "timeline":
        return await handleTimeline();
      case "visualize":
        return await handleVisualize(body.query);
      default:
        return jsonResponse(
          { success: false, error: "Unknown action" },
          400
        );
    }
  } catch (err) {
    return jsonResponse(
      { success: false, error: (err as Error).message },
      500
    );
  }
}

/**
 * Search endpoint — semantic search + chat synthesis
 */
async function handleSearch(
  query: string,
  llmClient: LLMClient,
  env: any
): Promise<Response> {
  // Query Qdrant for top-k semantically similar documents
  const searchResponse = await fetch(
    `${env.QDRANT_URL}/collections/technosis/points/search`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vector: await getQueryEmbedding(query, llmClient),
        limit: 10,
        with_payload: true,
      }),
    }
  );

  const searchResults = await searchResponse.json();

  // Use LLM to synthesize answer from top results
  const context = searchResults.result
    .map((r: any) => r.payload.content)
    .join("\n\n");

  const synthesis = await llmClient.chat({
    messages: [
      {
        role: "system",
        content:
          "You are a Technosis oracle. Answer based on context, honoring Yorùbá cosmology.",
      },
      {
        role: "user",
        content: `Query: ${query}\n\nContext:\n${context}`,
      },
    ],
  });

  return jsonResponse({
    success: true,
    data: {
      answer: synthesis.content,
      sources: searchResults.result.map((r: any) => ({
        file: r.payload.file,
        repo: r.payload.repo,
        relevance: r.score,
      })),
    },
  });
}

/**
 * Chat endpoint — multi-turn conversation
 */
async function handleChat(
  messages: any[],
  llmClient: LLMClient
): Promise<Response> {
  const response = await llmClient.chat({
    messages: [
      {
        role: "system",
        content:
          "You are ÀṣẹMirror, keeper of the Technosis organism. You speak in both technical and sacred language.",
      },
      ...messages,
    ],
  });

  return jsonResponse({
    success: true,
    data: { response: response.content },
  });
}

/**
 * Timeline endpoint — 7-year lock + 90-day phases
 */
async function handleTimeline(): Promise<Response> {
  const genesisDate = new Date("2025-01-01");
  const now = new Date();
  const daysElapsed = Math.floor(
    (now.getTime() - genesisDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysTotal = 7 * 365; // 7-year lock

  const phases = [
    { name: "Phase 1: Genesis", days: 90, color: "#ff0000" },
    { name: "Phase 2: Handshake", days: 90, color: "#ff5500" },
    { name: "Phase 3: Entropy", days: 90, color: "#ffaa00" },
    { name: "Phase 4: VM", days: 90, color: "#ffff00" },
    { name: "Phase 5: Shrine", days: 90, color: "#00ff00" },
    { name: "Phase 6: Council", days: 90, color: "#0000ff" },
    { name: "Phase 7: Journey", days: 90 * 20, color: "#ff00ff" }, // Remaining
  ];

  const priorityItems = [
    { order: 1, title: "Add @genesisFlawToken to compiler", status: "in-progress" },
    { order: 2, title: "Implement wallet derivation (Go FFI)", status: "in-progress" },
    { order: 3, title: "Tithe split routing logic", status: "todo" },
    { order: 4, title: "Sabbath enforcement", status: "todo" },
    { order: 5, title: "Full FFI stubs", status: "todo" },
    { order: 6, title: "L0→L1/L2 integration hooks", status: "todo" },
    { order: 7, title: "Genesis block (ASHE initialization)", status: "todo" },
    { order: 8, title: "Error handling & validation", status: "todo" },
    { order: 9, title: "Consensus layer", status: "todo" },
    { order: 10, title: "Full test coverage", status: "todo" },
  ];

  return jsonResponse({
    success: true,
    data: {
      genesisDate,
      daysElapsed,
      daysTotal,
      percentComplete: (daysElapsed / daysTotal) * 100,
      phases,
      priorityItems,
      nextMilestone: phases[Math.floor(daysElapsed / 90)],
    },
  });
}

/**
 * Visualize endpoint — 7-layer pyramid, 1440 wallets, tithe flow
 */
async function handleVisualize(type: string): Promise<Response> {
  const visualizations: Record<string, any> = {
    "7-layer": {
      type: "pyramid",
      layers: [
        { name: "Physical Genesis", color: "#8b0000" },
        { name: "Oso-lang Compiler", color: "#ff0000" },
        { name: "Entropy Oracle", color: "#ff6666" },
        { name: "Witness Mesh", color: "#ffaa00" },
        { name: "Techgnosis VM", color: "#ffff00" },
        { name: "AIO / SimaaS", color: "#00ff00" },
        { name: "Shrine Economy", color: "#0000ff" },
      ],
    },
    "1440-wallets": {
      type: "tree",
      root: "Genesis Seed (BIPỌ̀N39)",
      children: [
        {
          name: "Council of 12 Lineages",
          wallets: 12,
          yieldAPY: 11.11,
        },
        {
          name: "1440 Soul-Bound Inheritance",
          wallets: 1440,
          lockYears: 7,
          yieldAPY: 11.11,
        },
      ],
    },
    "tithe-flow": {
      type: "flow",
      total: 100,
      splits: [
        { name: "Treasury (Shrines & Robots)", percent: 50, color: "#ffaa00" },
        { name: "1440 Inheritance Vaults", percent: 25, color: "#00ff00" },
        { name: "Council + Entropy", percent: 15, color: "#0000ff" },
        { name: "Burn Void (Blood Sacrifice)", percent: 10, color: "#8b0000" },
      ],
    },
  };

  return jsonResponse({
    success: true,
    data: visualizations[type] || visualizations["7-layer"],
  });
}

/**
 * Helper: Get query embedding from LLM
 */
async function getQueryEmbedding(
  query: string,
  llmClient: LLMClient
): Promise<number[]> {
  const embedding = await llmClient.embed({ text: query });
  return embedding.embeddings[0];
}

/**
 * JSON response helper
 */
function jsonResponse(
  data: any,
  status: number = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
