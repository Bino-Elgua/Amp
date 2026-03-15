/**
 * ÀṣẹMirror Indexer
 * Syncs GitHub repos + local folders → creates semantic embeddings → stores in Qdrant
 */

import { LLMClient, EmbeddingResponse } from "./llm-sdk";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

export interface IndexedDocument {
  id: string;
  repo: string;
  file: string;
  content: string;
  type: "code" | "markdown" | "voice" | "image";
  tags: string[];
  embedding: number[];
  lastUpdated: string;
}

export class MirrorIndexer {
  private llmClient: LLMClient;
  private qdrantUrl: string;
  private documents: Map<string, IndexedDocument> = new Map();

  constructor(llmClient: LLMClient, qdrantUrl: string) {
    this.llmClient = llmClient;
    this.qdrantUrl = qdrantUrl;
  }

  /**
   * Sync all GitHub repos
   */
  async syncGitHubRepos(repos: string[], baseDir: string): Promise<void> {
    for (const repo of repos) {
      const repoPath = path.join(baseDir, repo.split("/")[1]);
      console.log(`Syncing ${repo}...`);

      if (!fs.existsSync(repoPath)) {
        execSync(`git clone https://github.com/${repo}.git ${repoPath}`);
      } else {
        execSync(`cd ${repoPath} && git pull origin main || git pull origin master`);
      }

      // Index files in repo
      await this.indexDirectory(repoPath, repo);
    }
  }

  /**
   * Recursively index all files in a directory
   */
  async indexDirectory(dir: string, repoName: string): Promise<void> {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip hidden dirs and node_modules
      if (entry.name.startsWith(".") || entry.name === "node_modules") {
        continue;
      }

      if (entry.isDirectory()) {
        await this.indexDirectory(fullPath, repoName);
      } else {
        await this.indexFile(fullPath, repoName);
      }
    }
  }

  /**
   * Index a single file
   */
  async indexFile(filePath: string, repoName: string): Promise<void> {
    const ext = path.extname(filePath).toLowerCase();
    const relPath = filePath.replace(/.*\/(jbino85\/[^/]+)/, "$1");

    // Only index code + markdown
    const supportedExts = [
      ".ts", ".js", ".jl", ".go", ".py", ".md", ".json", ".sol", ".move",
      ".rs", ".txt", ".yaml", ".yml", ".toml",
    ];

    if (!supportedExts.includes(ext)) {
      return;
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      if (content.length < 50) return; // Skip tiny files

      const id = `${repoName}:${relPath}`;
      const type = ext === ".md" ? "markdown" : "code";

      // Create semantic chunks (split on blank lines or functions)
      const chunks = this.chunkContent(content);

      for (let i = 0; i < chunks.length; i++) {
        const chunkId = `${id}:chunk-${i}`;
        const chunk = chunks[i];

        // Get embedding
        const embedding = await this.llmClient.embed({ text: chunk });
        const tags = this.extractTags(chunk);

        const doc: IndexedDocument = {
          id: chunkId,
          repo: repoName,
          file: relPath,
          content: chunk,
          type: type,
          tags,
          embedding: embedding.embeddings[0],
          lastUpdated: new Date().toISOString(),
        };

        this.documents.set(chunkId, doc);
        console.log(`  ✓ Indexed ${chunkId}`);
      }
    } catch (err) {
      console.error(`Error indexing ${filePath}:`, err);
    }
  }

  /**
   * Smart chunking: split on blank lines, max 1000 chars per chunk
   */
  private chunkContent(content: string): string[] {
    const chunks: string[] = [];
    const lines = content.split("\n");
    let current = "";

    for (const line of lines) {
      if (current.length + line.length > 1000 && current.length > 0) {
        chunks.push(current);
        current = "";
      }
      current += line + "\n";
    }

    if (current.length > 50) {
      chunks.push(current);
    }

    return chunks;
  }

  /**
   * Extract semantic tags from content
   */
  private extractTags(content: string): string[] {
    const tags = new Set<string>();

    // Detect language
    if (content.includes("function") || content.includes("const ")) tags.add("javascript");
    if (content.includes("def ")) tags.add("python");
    if (content.includes("func ")) tags.add("go");
    if (content.includes("function ") && content.includes("Julia")) tags.add("julia");
    if (content.includes("contract ")) tags.add("solidity");
    if (content.includes("module ")) tags.add("move");

    // Detect Technosis concepts
    if (content.includes("Àṣẹ") || content.includes("ashe")) tags.add("ashe");
    if (content.includes("1440")) tags.add("1440-wallets");
    if (content.includes("Orisha") || content.includes("Orishas")) tags.add("orishas");
    if (content.includes("tithe")) tags.add("tithe");
    if (content.includes("genesis")) tags.add("genesis");
    if (content.includes("opcode")) tags.add("opcode");
    if (content.includes("oso-lang")) tags.add("oso-lang");
    if (content.includes("Techgnosis") || content.includes("TechGnØŞ"))
      tags.add("techgnosis");
    if (content.includes("handshake")) tags.add("handshake");

    return Array.from(tags);
  }

  /**
   * Upload all indexed documents to Qdrant
   */
  async uploadToQdrant(): Promise<void> {
    console.log(`Uploading ${this.documents.size} documents to Qdrant...`);

    const points = Array.from(this.documents.values()).map((doc, idx) => ({
      id: idx + 1,
      vector: doc.embedding,
      payload: {
        id: doc.id,
        repo: doc.repo,
        file: doc.file,
        content: doc.content,
        type: doc.type,
        tags: doc.tags,
        lastUpdated: doc.lastUpdated,
      },
    }));

    try {
      // Create collection
      await fetch(`${this.qdrantUrl}/collections/technosis`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vectors: {
            size: points[0].vector.length,
            distance: "Cosine",
          },
        }),
      });

      // Upload points in batches
      const batchSize = 100;
      for (let i = 0; i < points.length; i += batchSize) {
        const batch = points.slice(i, i + batchSize);
        await fetch(`${this.qdrantUrl}/collections/technosis/points`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ points: batch }),
        });
        console.log(`  Uploaded ${Math.min(i + batchSize, points.length)}/${points.length}`);
      }

      console.log("✓ Upload complete");
    } catch (err) {
      console.error("Error uploading to Qdrant:", err);
    }
  }

  /**
   * Semantic search
   */
  async search(query: string, topK: number = 10): Promise<IndexedDocument[]> {
    const queryEmbedding = await this.llmClient.embed({ text: query });
    const queryVec = queryEmbedding.embeddings[0];

    // Score all documents by cosine similarity
    const scored = Array.from(this.documents.values()).map(doc => ({
      doc,
      score: this.cosineSimilarity(queryVec, doc.embedding),
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(x => x.doc);
  }

  /**
   * Cosine similarity
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magA * magB);
  }
}

/**
 * CLI: Index everything
 */
export async function startIndexing(config: {
  llmProvider: string;
  apiKey: string;
  repos: string[];
  baseDir: string;
  qdrantUrl: string;
}) {
  const llmClient = new LLMClient({
    provider: config.llmProvider as any,
    apiKey: config.apiKey,
  });

  const indexer = new MirrorIndexer(llmClient, config.qdrantUrl);

  console.log("🔮 ÀṣẹMirror Indexing Starting...\n");
  await indexer.syncGitHubRepos(config.repos, config.baseDir);
  await indexer.uploadToQdrant();
  console.log("\n✨ Indexing complete!");
}
