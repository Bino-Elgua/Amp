#!/usr/bin/env node
// CASSANDRA - Autonomous Architect Oracle
// Main entry point and orchestration engine

import { config } from 'dotenv';
import { OracleCore } from './oracle-core.ts';
import { VectorDBClient } from './vectordb-client.ts';
import { PredictionEngine } from './prediction-engine.ts';
import { CodeRefactorer } from './code-generator.ts';
import { AutonomousExecutor } from './autonomous-executor.ts';
import { BlockchainLogger } from '../blockchain/prediction-logger.ts';
import { OracleMonitor } from '../monitoring/oracle-monitor.ts';
import { Logger } from './logger.ts';

config();

const logger = new Logger('Cassandra');

class CassandraOracle {
  private core: OracleCore;
  private vectordb: VectorDBClient;
  private predictor: PredictionEngine;
  private refactor: CodeRefactorer;
  private executor: AutonomousExecutor;
  private blockchain: BlockchainLogger;
  private monitor: OracleMonitor;
  private isRunning: boolean = false;

  constructor() {
    this.core = new OracleCore();
    this.vectordb = new VectorDBClient();
    this.predictor = new PredictionEngine(this.vectordb);
    this.refactor = new CodeRefactorer();
    this.executor = new AutonomousExecutor();
    this.blockchain = new BlockchainLogger();
    this.monitor = new OracleMonitor();
  }

  async initialize(): Promise<void> {
    logger.info('🔥 CASSANDRA ORACLE INITIALIZATION');
    logger.info('═══════════════════════════════════════');

    try {
      // 1. Initialize vector database
      logger.info('📡 Connecting to Vector Database...');
      await this.vectordb.connect();
      logger.info('✓ Vector DB connected');

      // 2. Load oracle state from memory
      logger.info('🧠 Loading Oracle State...');
      await this.core.loadState();
      logger.info('✓ Oracle State loaded');

      // 3. Verify blockchain connection
      logger.info('⛓️ Verifying Blockchain Connection...');
      await this.blockchain.verify();
      logger.info('✓ Blockchain connected');

      // 4. Initialize monitoring
      logger.info('👁️ Starting Monitoring Systems...');
      await this.monitor.initialize();
      logger.info('✓ Monitoring active');

      logger.info('═══════════════════════════════════════');
      logger.info('⚡ CASSANDRA READY');
    } catch (error) {
      logger.error('Initialization failed:', error);
      process.exit(1);
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    logger.info('🌀 STARTING CONTINUOUS ORACLE LOOP');

    while (this.isRunning) {
      try {
        // Cycle 1: Predict
        logger.info('→ PREDICTION CYCLE');
        const newPredictions = await this.predictor.generatePredictions();

        for (const prediction of newPredictions) {
          // Store in vector DB
          await this.vectordb.storePrediction(prediction);

          // Commit to blockchain
          const proof = await this.blockchain.commitPrediction(prediction);
          logger.info(`✓ Prediction committed on-chain: ${proof.transaction_hash}`);

          // Add to oracle state
          await this.core.addPrediction(prediction);
        }

        // Cycle 2: Refactor
        logger.info('→ REFACTORING CYCLE');
        const emergedPredictions = await this.core.getEmergedPredictions();

        for (const prediction of emergedPredictions) {
          if (prediction.status === 'emerged' && !prediction.shadowBranch) {
            logger.info(`🔧 Generating refactor for: ${prediction.paradigmName}`);
            const refactorResult = await this.refactor.generateRefactor(prediction);
            await this.core.updatePredictionRefactor(prediction.id, refactorResult);
          }
        }

        // Cycle 3: Execute
        logger.info('→ EXECUTION CYCLE');
        const readyForDeployment = await this.core.getDeploymentReady();

        for (const prediction of readyForDeployment) {
          logger.info(`🚀 Deploying: ${prediction.paradigmName}`);
          const deployment = await this.executor.deploy(prediction);
          
          if (deployment.success) {
            await this.core.markDeployed(prediction.id);
            logger.info(`✓ Deployment successful: ${prediction.paradigmName}`);
          } else {
            logger.error(`✗ Deployment failed: ${prediction.paradigmName}`);
            await this.core.markFailed(prediction.id);
          }
        }

        // Cycle 4: Monitor
        logger.info('→ MONITORING CYCLE');
        const metrics = await this.monitor.collectMetrics();
        await this.core.updateMetrics(metrics);

        // Cycle 5: Learn
        logger.info('→ LEARNING CYCLE');
        const accuracy = await this.core.calculateAccuracy();
        if (accuracy.improved) {
          logger.info(`📈 Model improved: ${accuracy.improvement}%`);
          await this.predictor.retrain(this.core.getState().learning_history);
        }

        // Wait before next cycle
        const cycleInterval = parseInt(process.env.CYCLE_INTERVAL || '3600000', 10); // 1 hour default
        logger.info(`⏳ Next cycle in ${cycleInterval / 1000}s`);
        await new Promise(resolve => setTimeout(resolve, cycleInterval));

      } catch (error) {
        logger.error('Cycle error:', error);
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30s before retry
      }
    }
  }

  async stop(): Promise<void> {
    logger.info('🛑 SHUTTING DOWN CASSANDRA');
    this.isRunning = false;
    await this.core.saveState();
    await this.vectordb.disconnect();
    logger.info('✓ Cassandra shutdown complete');
  }

  getState() {
    return this.core.getState();
  }

  getMetrics() {
    return this.core.getMetrics();
  }
}

// Main execution
const oracle = new CassandraOracle();

process.on('SIGINT', async () => {
  await oracle.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await oracle.stop();
  process.exit(0);
});

// Start oracle
(async () => {
  await oracle.initialize();
  if (process.env.ORACLE_MODE === 'production') {
    await oracle.start();
  } else {
    logger.info('Oracle initialized. Run with ORACLE_MODE=production to start continuous loop.');
  }
})();

export default CassandraOracle;
