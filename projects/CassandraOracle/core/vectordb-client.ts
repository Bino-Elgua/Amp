// VECTOR DATABASE CLIENT - Semantic search integration with Qdrant

import { QdrantClient } from '@qdrant/js-client-rest';
import { ParadigmPrediction, EmergentPattern } from './types.ts';
import { Logger } from './logger.ts';
import fetch from 'node-fetch';

export class VectorDBClient {
  private client: QdrantClient;
  private logger: Logger;
  private collectionName: string;

  constructor() {
    this.logger = new Logger('VectorDBClient');
    this.collectionName = process.env.QDRANT_COLLECTION || 'cassandra_predictions';
    
    const url = process.env.QDRANT_URL || 'http://localhost:6333';
    this.client = new QdrantClient({
      url,
      apiKey: process.env.QDRANT_API_KEY,
    });
  }

  async connect(): Promise<void> {
    try {
      // Create collection if it doesn't exist
      await this.createCollection();
      this.logger.info('✓ Connected to Qdrant');
    } catch (error) {
      this.logger.info('⚠️  Qdrant not available (demo mode enabled)');
      // Don't throw - allow graceful degradation
    }
  }

  private async createCollection(): Promise<void> {
    try {
      await this.client.getCollection(this.collectionName);
    } catch {
      // Collection doesn't exist, create it
      await this.client.createCollection(this.collectionName, {
        vectors: {
          size: 1536, // OpenAI embedding size
          distance: 'Cosine',
        },
      });
      this.logger.info(`Created collection: ${this.collectionName}`);
    }
  }

  async storePrediction(prediction: ParadigmPrediction): Promise<void> {
    try {
      const embedding = await this.generateEmbedding(prediction.description);
      
      await this.client.upsert(this.collectionName, {
        points: [
          {
            id: this.hashId(prediction.id),
            vector: embedding,
            payload: {
              prediction_id: prediction.id,
              paradigm_name: prediction.paradigmName,
              paradigm_type: prediction.paradigmType,
              probability: prediction.probability,
              confidence: prediction.confidence,
              description: prediction.description,
              timeline: JSON.stringify(prediction.timeline),
              signals: JSON.stringify(prediction.signals),
              status: prediction.status,
              created_at: prediction.createdAt.getTime(),
            },
          },
        ],
      });

      this.logger.debug(`Stored prediction embedding: ${prediction.paradigmName}`);
    } catch (error) {
      this.logger.error('Failed to store prediction', error);
      throw error;
    }
  }

  async searchSimilarPatterns(description: string, limit: number = 5): Promise<ParadigmPrediction[]> {
    try {
      const embedding = await this.generateEmbedding(description);
      
      const results = await this.client.search(this.collectionName, {
        vector: embedding,
        limit,
        with_payload: true,
      });

      return results.map(r => ({
        id: r.payload?.prediction_id as string,
        paradigmName: r.payload?.paradigm_name as string,
        description: r.payload?.description as string,
        // Map other fields as needed
      })) as any[];
    } catch (error) {
      this.logger.error('Failed to search similar patterns', error);
      return [];
    }
  }

  async detectEmergentPatterns(): Promise<EmergentPattern[]> {
    try {
      // Get all points in collection
      const allPoints = await this.client.scroll(this.collectionName, {
        limit: 100,
      });

      const patterns: Map<string, EmergentPattern> = new Map();

      for (const point of allPoints.points) {
        const paradigmType = point.payload?.paradigm_type as string;
        
        if (!patterns.has(paradigmType)) {
          patterns.set(paradigmType, {
            pattern_id: `pattern_${paradigmType}_${Date.now()}`,
            pattern_type: paradigmType,
            description: `Emerging pattern in ${paradigmType}`,
            first_observed: new Date(),
            last_observed: new Date(),
            frequency: 1,
            related_predictions: [point.payload?.prediction_id as string],
            signal_strength: point.score || 0,
          });
        } else {
          const pattern = patterns.get(paradigmType)!;
          pattern.frequency++;
          pattern.last_observed = new Date();
          pattern.related_predictions.push(point.payload?.prediction_id as string);
          pattern.signal_strength = Math.max(pattern.signal_strength, point.score || 0);
        }
      }

      return Array.from(patterns.values()).filter(p => p.frequency > 2);
    } catch (error) {
      this.logger.error('Failed to detect emergent patterns', error);
      return [];
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Try local Ollama first
      const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
      
      try {
        const response = await fetch(`${ollamaUrl}/api/embed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'nomic-embed-text',
            input: text,
          }),
        } as any);

        if (response.ok) {
          const data = await response.json() as any;
          this.logger.debug('Generated embedding via Ollama');
          return data.embeddings[0] || this.generateRandomEmbedding();
        }
      } catch (e) {
        this.logger.debug('Ollama not available, falling back to random embedding');
      }

      // Fallback to random (for demo purposes)
      return this.generateRandomEmbedding();
    } catch (error) {
      this.logger.error('Failed to generate embedding', error);
      return this.generateRandomEmbedding();
    }
  }

  private generateRandomEmbedding(): number[] {
    // Generate random 1536-dimensional vector (OpenAI compatible)
    return Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
  }

  private hashId(id: string): number {
    // Convert string ID to numeric ID for Qdrant
    return parseInt(id.replace(/\D/g, '').slice(0, 10) || '1', 10);
  }

  async disconnect(): Promise<void> {
    // Qdrant client doesn't need explicit disconnect
    this.logger.info('Disconnected from Qdrant');
  }
}
