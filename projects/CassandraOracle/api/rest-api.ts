// REST API - Express server for Cassandra Oracle

import express, { Express, Request, Response } from 'express';
import { Logger } from '../core/logger.ts';
import { OracleCore } from '../core/oracle-core.ts';
import { PredictionEngine } from '../core/prediction-engine.ts';
import { VectorDBClient } from '../core/vectordb-client.ts';
import { BlockchainLogger } from '../blockchain/prediction-logger.ts';
import { OracleMonitor } from '../monitoring/oracle-monitor.ts';

const logger = new Logger('RestAPI');

export class CassandraAPI {
  private app: Express;
  private oracle: OracleCore;
  private predictor: PredictionEngine;
  private vectordb: VectorDBClient;
  private blockchain: BlockchainLogger;
  private monitor: OracleMonitor;

  constructor(
    oracle: OracleCore,
    predictor: PredictionEngine,
    vectordb: VectorDBClient,
    blockchain: BlockchainLogger,
    monitor: OracleMonitor
  ) {
    this.app = express();
    this.oracle = oracle;
    this.predictor = predictor;
    this.vectordb = vectordb;
    this.blockchain = blockchain;
    this.monitor = monitor;

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logging middleware
    this.app.use((req, res, next) => {
      logger.debug(`${req.method} ${req.path}`);
      next();
    });

    // Error handling
    this.app.use((err: any, req: Request, res: Response, next: any) => {
      logger.error(`Error: ${err.message}`);
      res.status(500).json({ error: err.message });
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'healthy', timestamp: new Date() });
    });

    // Oracle status
    this.app.get('/api/oracle/status', (req: Request, res: Response) => {
      const state = this.oracle.getState();
      const metrics = this.oracle.getMetrics();
      res.json({ state, metrics });
    });

    // Get all predictions
    this.app.get('/api/predictions', (req: Request, res: Response) => {
      const state = this.oracle.getState();
      const { filter } = req.query;

      let predictions = state.predictions;
      if (filter) {
        predictions = predictions.filter(p => p.status === filter);
      }

      res.json({
        total: predictions.length,
        predictions: predictions.map(p => ({
          id: p.id,
          paradigmName: p.paradigmName,
          paradigmType: p.paradigmType,
          probability: p.probability,
          status: p.status,
          timeline: p.timeline,
          impactScore: p.impactScore,
        })),
      });
    });

    // Get single prediction
    this.app.get('/api/predictions/:id', (req: Request, res: Response) => {
      const state = this.oracle.getState();
      const prediction = state.predictions.find(p => p.id === req.params.id);

      if (!prediction) {
        return res.status(404).json({ error: 'Prediction not found' });
      }

      res.json(prediction);
    });

    // Get blockchain proof
    this.app.get('/api/blockchain/proof/:predictionId', (req: Request, res: Response) => {
      const state = this.oracle.getState();
      const prediction = state.predictions.find(p => p.id === req.params.predictionId);

      if (!prediction || !prediction.blockchainCommitment) {
        return res.status(404).json({ error: 'Proof not found' });
      }

      res.json(prediction.blockchainCommitment);
    });

    // Get deployment history
    this.app.get('/api/deployments', (req: Request, res: Response) => {
      const state = this.oracle.getState();
      const deployed = state.predictions.filter(p => p.status === 'deployed');

      res.json({
        total: deployed.length,
        deployments: deployed.map(p => ({
          id: p.id,
          paradigmName: p.paradigmName,
          deployedAt: p.updatedAt,
          impactScore: p.impactScore,
        })),
      });
    });

    // Get system metrics
    this.app.get('/api/metrics', (req: Request, res: Response) => {
      const metrics = this.oracle.getMetrics();
      res.json(metrics);
    });

    // Get system health
    this.app.get('/api/health/detailed', (req: Request, res: Response) => {
      const latestMetrics = this.monitor.getLatestMetrics();
      const stats = this.monitor.getMetricsStats();

      res.json({
        latest: latestMetrics,
        stats,
        timestamp: new Date(),
      });
    });

    // Trigger prediction cycle
    this.app.post('/api/oracle/predict', async (req: Request, res: Response) => {
      try {
        const predictions = await this.predictor.generatePredictions();
        res.json({
          success: true,
          predictions_generated: predictions.length,
          predictions: predictions.map(p => ({
            id: p.id,
            paradigmName: p.paradigmName,
            probability: p.probability,
          })),
        });
      } catch (error) {
        res.status(500).json({ error: String(error) });
      }
    });

    // Get emergent patterns
    this.app.get('/api/patterns', async (req: Request, res: Response) => {
      try {
        const patterns = await this.vectordb.detectEmergentPatterns();
        res.json({
          total: patterns.length,
          patterns,
        });
      } catch (error) {
        res.status(500).json({ error: String(error) });
      }
    });

    // Search similar predictions
    this.app.post('/api/search', async (req: Request, res: Response) => {
      try {
        const { query, limit } = req.body;
        const results = await this.vectordb.searchSimilarPatterns(query, limit || 5);
        res.json({ results });
      } catch (error) {
        res.status(500).json({ error: String(error) });
      }
    });

    // Get accuracy report
    this.app.get('/api/accuracy', (req: Request, res: Response) => {
      const state = this.oracle.getState();
      res.json({
        accuracy_metrics: state.accuracy_metrics,
        learning_history: state.learning_history.slice(-10), // Last 10 cycles
      });
    });
  }

  start(port: number = parseInt(process.env.API_PORT || '4000', 10)): void {
    this.app.listen(port, () => {
      logger.info(`API server listening on port ${port}`);
    });
  }

  getApp(): Express {
    return this.app;
  }
}
