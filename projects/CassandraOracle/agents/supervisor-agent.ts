// SUPERVISOR AGENT - Multi-agent orchestration and coordination

import { AgentTask } from '../core/types.ts';
import { Logger } from '../core/logger.ts';
import { OracleCore } from '../core/oracle-core.ts';
import { PredictionEngine } from '../core/prediction-engine.ts';
import { CodeRefactorer } from '../core/code-generator.ts';
import { AutonomousExecutor } from '../core/autonomous-executor.ts';
import crypto from 'crypto';

export class SupervisorAgent {
  private logger: Logger;
  private taskQueue: AgentTask[] = [];
  private completedTasks: Map<string, AgentTask> = new Map();

  constructor() {
    this.logger = new Logger('SupervisorAgent');
  }

  async supervisePredictionCycle(
    oracle: OracleCore,
    predictor: PredictionEngine,
    refactor: CodeRefactorer,
    executor: AutonomousExecutor
  ): Promise<void> {
    this.logger.info('Starting supervised prediction cycle');

    try {
      // Task 1: Generate predictions
      const predictTask = await this.createTask('predictor', 'generate_predictions', {});
      this.logger.info(`Task queued: ${predictTask.task_id}`);
      this.taskQueue.push(predictTask);

      const predictions = await predictor.generatePredictions();
      predictTask.status = 'completed';
      predictTask.output = { predictions_count: predictions.length };
      this.completedTasks.set(predictTask.task_id, predictTask);

      for (const prediction of predictions) {
        // Task 2: Process each prediction
        const processTask = await this.createTask(
          'monitor',
          'process_prediction',
          { prediction_id: prediction.id }
        );

        await oracle.addPrediction(prediction);
        
        processTask.status = 'completed';
        this.completedTasks.set(processTask.task_id, processTask);
      }

      // Task 3: Check for emerged predictions
      const checkEmergedTask = await this.createTask('monitor', 'check_emerged', {});
      const emergenced = await oracle.getEmergedPredictions();
      checkEmergedTask.output = { emerged_count: emergenced.length };
      checkEmergedTask.status = 'completed';
      this.completedTasks.set(checkEmergedTask.task_id, checkEmergedTask);

      // Task 4: Refactor emerged predictions
      for (const prediction of emergenced) {
        const refactorTask = await this.createTask(
          'refactor',
          'generate_refactor',
          { prediction_id: prediction.id }
        );

        try {
          const result = await refactor.generateRefactor(prediction);
          await oracle.updatePredictionRefactor(prediction.id, result);
          refactorTask.status = 'completed';
          refactorTask.output = { commit: result.commit_hash };
        } catch (error) {
          refactorTask.status = 'failed';
          refactorTask.error = String(error);
        }

        this.completedTasks.set(refactorTask.task_id, refactorTask);
      }

      // Task 5: Execute ready deployments
      const deployReady = await oracle.getDeploymentReady();
      for (const prediction of deployReady) {
        const deployTask = await this.createTask(
          'executor',
          'deploy',
          { prediction_id: prediction.id }
        );

        try {
          const deployment = await executor.deploy(prediction);
          if (deployment.success) {
            await oracle.markDeployed(prediction.id);
            deployTask.status = 'completed';
            deployTask.output = deployment.details;
          } else {
            await oracle.markFailed(prediction.id);
            deployTask.status = 'failed';
            deployTask.error = deployment.error;
          }
        } catch (error) {
          deployTask.status = 'failed';
          deployTask.error = String(error);
        }

        this.completedTasks.set(deployTask.task_id, deployTask);
      }

      this.logger.info('Supervision cycle complete');
    } catch (error) {
      this.logger.error('Supervision cycle failed', error);
    }
  }

  private async createTask(
    agentType: 'predictor' | 'refactor' | 'executor' | 'monitor' | 'learner',
    taskType: string,
    input: Record<string, unknown>
  ): Promise<AgentTask> {
    return {
      task_id: crypto.randomUUID(),
      agent_type: agentType,
      status: 'queued',
      input,
      dependencies: [],
    };
  }

  async getTaskStatus(taskId: string): Promise<AgentTask | null> {
    const queued = this.taskQueue.find(t => t.task_id === taskId);
    if (queued) return queued;

    return this.completedTasks.get(taskId) || null;
  }

  async getTaskHistory(limit: number = 100): Promise<AgentTask[]> {
    const history = Array.from(this.completedTasks.values());
    return history.slice(-limit);
  }

  async reportMetrics(): Promise<{
    total_tasks: number;
    completed: number;
    failed: number;
    pending: number;
  }> {
    const total = this.taskQueue.length + this.completedTasks.size;
    const completed = Array.from(this.completedTasks.values()).filter(
      t => t.status === 'completed'
    ).length;
    const failed = Array.from(this.completedTasks.values()).filter(
      t => t.status === 'failed'
    ).length;
    const pending = this.taskQueue.filter(t => t.status === 'queued' || t.status === 'running').length;

    return { total_tasks: total, completed, failed, pending };
  }
}
