// ORACLE CORE - State management and persistence

import * as fs from 'fs';
import { OracleState, ParadigmPrediction, OracleMetrics, AccuracyMetrics, LearningCycle } from './types.ts';
import { Logger } from './logger.ts';

export class OracleCore {
  private state: OracleState;
  private statePath: string;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('OracleCore');
    this.statePath = process.env.ORACLE_MEMORY_PATH || '/data/data/com.termux/files/home/cassandra/data/oracle-memory.json';
    this.state = {
      predictions: [],
      active_monitoring: [],
      learning_history: [],
      accuracy_metrics: {
        total_predictions: 0,
        correct_predictions: 0,
        accuracy_percentage: 0,
        average_lead_time: 0,
        false_positives: 0,
        false_negatives: 0,
        precision: 0,
        recall: 0,
      },
      deployed_predictions: [],
      failed_predictions: [],
      emergent_patterns: [],
    };
  }

  async loadState(): Promise<void> {
    try {
      if (fs.existsSync(this.statePath)) {
        const data = fs.readFileSync(this.statePath, 'utf-8');
        this.state = JSON.parse(data);
        this.logger.info(`✓ Oracle state loaded from ${this.statePath}`);
      } else {
        this.logger.info('No existing state found, starting fresh');
        await this.saveState();
      }
    } catch (error) {
      this.logger.error('Failed to load state', error);
      throw error;
    }
  }

  async saveState(): Promise<void> {
    try {
      const dir = this.statePath.split('/').slice(0, -1).join('/');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.statePath, JSON.stringify(this.state, null, 2));
      this.logger.debug('State saved to disk');
    } catch (error) {
      this.logger.error('Failed to save state', error);
      throw error;
    }
  }

  async addPrediction(prediction: ParadigmPrediction): Promise<void> {
    this.state.predictions.push(prediction);
    this.state.active_monitoring.push(prediction.id);
    await this.saveState();
    this.logger.info(`Added prediction: ${prediction.paradigmName}`);
  }

  async updatePredictionRefactor(predictionId: string, refactorResult: any): Promise<void> {
    const prediction = this.state.predictions.find(p => p.id === predictionId);
    if (prediction) {
      prediction.shadowBranch = {
        name: refactorResult.branch_name,
        commit_hash: refactorResult.commit_hash,
        refactored_modules: refactorResult.modules,
        test_results: refactorResult.test_results || [],
      };
      prediction.status = 'committed';
      await this.saveState();
    }
  }

  async getEmergedPredictions(): Promise<ParadigmPrediction[]> {
    return this.state.predictions.filter(p => {
      const now = new Date();
      return p.timeline.predicted_emergence <= now && p.status !== 'deployed';
    });
  }

  async getDeploymentReady(): Promise<ParadigmPrediction[]> {
    return this.state.predictions.filter(p => {
      return (
        p.status === 'committed' &&
        p.shadowBranch &&
        p.blockchainCommitment &&
        p.timeline.predicted_emergence <= new Date()
      );
    });
  }

  async markDeployed(predictionId: string): Promise<void> {
    const prediction = this.state.predictions.find(p => p.id === predictionId);
    if (prediction) {
      prediction.status = 'deployed';
      prediction.updatedAt = new Date();
      this.state.deployed_predictions.push(predictionId);
      await this.saveState();
    }
  }

  async markFailed(predictionId: string): Promise<void> {
    const prediction = this.state.predictions.find(p => p.id === predictionId);
    if (prediction) {
      prediction.status = 'emerged';
      prediction.updatedAt = new Date();
      this.state.failed_predictions.push(predictionId);
      await this.saveState();
    }
  }

  async calculateAccuracy(): Promise<{ improved: boolean; improvement: number }> {
    const totalPredictions = this.state.predictions.length;
    const correctPredictions = this.state.predictions.filter(p => p.status === 'validated').length;

    const oldAccuracy = this.state.accuracy_metrics.accuracy_percentage;
    const newAccuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;

    this.state.accuracy_metrics.total_predictions = totalPredictions;
    this.state.accuracy_metrics.correct_predictions = correctPredictions;
    this.state.accuracy_metrics.accuracy_percentage = newAccuracy;

    const improvement = newAccuracy - oldAccuracy;
    const improved = improvement > 0;

    await this.saveState();

    return { improved, improvement };
  }

  async updateMetrics(metrics: Partial<AccuracyMetrics>): Promise<void> {
    this.state.accuracy_metrics = {
      ...this.state.accuracy_metrics,
      ...metrics,
    };
    await this.saveState();
  }

  getState(): OracleState {
    return this.state;
  }

  getMetrics(): OracleMetrics {
    return {
      total_predictions_lifetime: this.state.predictions.length,
      predictions_proven_correct: this.state.predictions.filter(p => p.status === 'validated').length,
      average_lead_time_days: this.state.accuracy_metrics.average_lead_time,
      current_accuracy: this.state.accuracy_metrics.accuracy_percentage,
      models_improved: this.state.learning_history.length,
      paradigm_shifts_detected: this.state.predictions.filter(p => p.status === 'emerged').length,
      deployments_automated: this.state.deployed_predictions.length,
      zero_downtime_migrations: this.state.deployed_predictions.length,
      learning_cycles_completed: this.state.learning_history.length,
      blockchain_commitments: this.state.predictions.filter(p => p.blockchainCommitment).length,
    };
  }
}
