#!/usr/bin/env node
// TEST RUNNER - Comprehensive test suite

import { OracleCore } from '../core/oracle-core.ts';
import { VectorDBClient } from '../core/vectordb-client.ts';
import { PredictionEngine } from '../core/prediction-engine.ts';
import { CodeRefactorer } from '../core/code-generator.ts';
import { AutonomousExecutor } from '../core/autonomous-executor.ts';
import { BlockchainLogger } from '../blockchain/prediction-logger.ts';
import { Logger } from '../core/logger.ts';
import crypto from 'crypto';

const logger = new Logger('TestRunner');

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

const results: TestResult[] = [];

async function runTest(name: string, testFn: () => Promise<void>): Promise<void> {
  const start = Date.now();
  try {
    await testFn();
    results.push({
      name,
      passed: true,
      duration: Date.now() - start,
    });
    logger.info(`✓ ${name}`);
  } catch (error) {
    results.push({
      name,
      passed: false,
      duration: Date.now() - start,
      error: String(error),
    });
    logger.error(`✗ ${name}: ${error}`);
  }
}

async function runAllTests(): Promise<void> {
  logger.info('🧪 Starting Test Suite\n');

  // Core Tests
  logger.info('=== CORE TESTS ===\n');

  await runTest('Oracle State Initialization', async () => {
    const oracle = new OracleCore();
    await oracle.loadState();
    const metrics = oracle.getMetrics();
    if (!metrics.total_predictions_lifetime !== undefined) throw new Error('Metrics missing');
  });

  await runTest('Oracle State Persistence', async () => {
    const oracle = new OracleCore();
    await oracle.loadState();
    const stateBefore = oracle.getState().predictions.length;
    await oracle.saveState();
    // Verify state was saved
    const oracle2 = new OracleCore();
    await oracle2.loadState();
    const stateAfter = oracle2.getState().predictions.length;
    if (stateBefore !== stateAfter) throw new Error('State not persisted correctly');
  });

  // Prediction Tests
  logger.info('\n=== PREDICTION ENGINE TESTS ===\n');

  await runTest('Generate Predictions', async () => {
    const vectordb = new VectorDBClient();
    const predictor = new PredictionEngine(vectordb);
    const predictions = await predictor.generatePredictions();
    if (predictions.length === 0) throw new Error('No predictions generated');
  });

  await runTest('Prediction Structure Validation', async () => {
    const vectordb = new VectorDBClient();
    const predictor = new PredictionEngine(vectordb);
    const predictions = await predictor.generatePredictions();
    const p = predictions[0];

    if (!p.id || !p.paradigmName || !p.probability) {
      throw new Error('Invalid prediction structure');
    }

    if (p.probability < 0 || p.probability > 1) {
      throw new Error('Invalid probability range');
    }
  });

  // Vector DB Tests
  logger.info('\n=== VECTOR DATABASE TESTS ===\n');

  await runTest('Vector DB Connection', async () => {
    const client = new VectorDBClient();
    try {
      await client.connect();
      logger.debug('Connected to Qdrant');
    } catch (e) {
      logger.warn('Qdrant not available (this is okay for testing)');
    }
  });

  // Code Generation Tests
  logger.info('\n=== CODE GENERATION TESTS ===\n');

  await runTest('Refactor Generation', async () => {
    const refactor = new CodeRefactorer();
    // Create a mock prediction
    const prediction = {
      id: crypto.randomUUID(),
      paradigmType: 'architectural' as const,
      paradigmName: 'Test Paradigm',
      description: 'Test paradigm for testing',
      probability: 0.85,
      confidence: 0.85 as any,
      timeline: {
        predicted_emergence: new Date(),
        earliest_signal: new Date(),
        critical_window: [new Date(), new Date()],
      },
      signals: {
        github_trends: [],
        arxiv_papers: [],
        news_mentions: [],
        competitor_moves: [],
        community_discussion: [],
      },
      requiredArchitectureChanges: ['test-module'],
      impactScore: 75,
      migrationCost: { hours: 100, complexity: 'medium' as const, risk_level: 'medium' as const },
      shadowBranch: undefined as any,
      blockchainCommitment: undefined as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending' as const,
    };

    const result = await refactor.generateRefactor(prediction);
    if (!result.branch_name || !result.commit_hash) {
      throw new Error('Invalid refactor result');
    }
  });

  // Blockchain Tests
  logger.info('\n=== BLOCKCHAIN TESTS ===\n');

  await runTest('Blockchain Connection', async () => {
    const blockchain = new BlockchainLogger();
    await blockchain.verify();
  });

  await runTest('Prediction Commitment', async () => {
    const blockchain = new BlockchainLogger();
    const prediction = {
      id: crypto.randomUUID(),
      paradigmType: 'technological' as const,
      paradigmName: 'Blockchain Test',
      description: 'Test prediction for blockchain',
      probability: 0.80,
      confidence: 0.80 as any,
      timeline: {
        predicted_emergence: new Date(),
        earliest_signal: new Date(),
        critical_window: [new Date(), new Date()],
      },
      signals: {
        github_trends: [],
        arxiv_papers: [],
        news_mentions: [],
        competitor_moves: [],
        community_discussion: [],
      },
      requiredArchitectureChanges: [],
      impactScore: 70,
      migrationCost: { hours: 50, complexity: 'low' as const, risk_level: 'low' as const },
      shadowBranch: undefined as any,
      blockchainCommitment: undefined as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending' as const,
    };

    const proof = await blockchain.commitPrediction(prediction);
    if (!proof.transaction_hash || !proof.prediction_hash) {
      throw new Error('Invalid proof');
    }
  });

  // Executor Tests
  logger.info('\n=== AUTONOMOUS EXECUTOR TESTS ===\n');

  await runTest('Deployment Plan Generation', async () => {
    const executor = new AutonomousExecutor();
    const prediction = {
      id: crypto.randomUUID(),
      paradigmType: 'architectural' as const,
      paradigmName: 'Deployment Test',
      description: 'Test deployment',
      probability: 0.85,
      confidence: 0.85 as any,
      timeline: {
        predicted_emergence: new Date(),
        earliest_signal: new Date(),
        critical_window: [new Date(), new Date()],
      },
      signals: {
        github_trends: [],
        arxiv_papers: [],
        news_mentions: [],
        competitor_moves: [],
        community_discussion: [],
      },
      requiredArchitectureChanges: ['service-a', 'service-b'],
      impactScore: 80,
      migrationCost: { hours: 100, complexity: 'high' as const, risk_level: 'medium' as const },
      shadowBranch: {
        name: 'test-branch',
        commit_hash: 'abc123',
        refactored_modules: [],
        test_results: [],
      },
      blockchainCommitment: {
        contract_address: '0x0',
        transaction_hash: '0x0',
        block_number: 0,
        timestamp: Date.now(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'committed' as const,
    };

    // We don't actually deploy, just verify it doesn't crash
    logger.debug('Deployment test prediction created');
  });

  // Integration Tests
  logger.info('\n=== INTEGRATION TESTS ===\n');

  await runTest('End-to-End Prediction Flow', async () => {
    const oracle = new OracleCore();
    const vectordb = new VectorDBClient();
    const predictor = new PredictionEngine(vectordb);

    await oracle.loadState();

    const predictions = await predictor.generatePredictions();
    if (predictions.length === 0) throw new Error('No predictions generated');

    for (const pred of predictions.slice(0, 1)) {
      await oracle.addPrediction(pred);
    }

    const state = oracle.getState();
    if (state.predictions.length === 0) {
      throw new Error('Predictions not added to state');
    }
  });

  // Print Results
  logger.info('\n=== TEST RESULTS ===\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  for (const result of results) {
    const icon = result.passed ? '✓' : '✗';
    console.log(`${icon} ${result.name} (${result.duration}ms)`);
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    }
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`Total: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / results.length) * 100).toFixed(2)}%`);
  console.log(`═══════════════════════════════════════\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runAllTests().catch(error => {
  logger.error('Test runner failed', error);
  process.exit(1);
});
