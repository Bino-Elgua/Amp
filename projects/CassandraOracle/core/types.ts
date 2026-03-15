// CASSANDRA TYPE DEFINITIONS
// Core data structures for the Autonomous Oracle

export enum ParadigmType {
  ARCHITECTURAL = 'architectural',
  TECHNOLOGICAL = 'technological',
  MARKET = 'market',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  GOVERNANCE = 'governance',
}

export enum PredictionConfidence {
  LOW = 0.3,
  MEDIUM = 0.6,
  HIGH = 0.85,
  CRITICAL = 0.95,
}

export interface ParadigmPrediction {
  id: string;
  paradigmType: ParadigmType;
  paradigmName: string;
  description: string;
  probability: number;
  confidence: PredictionConfidence;
  timeline: {
    predicted_emergence: Date;
    earliest_signal: Date;
    critical_window: [Date, Date];
  };
  signals: {
    github_trends: string[];
    arxiv_papers: string[];
    news_mentions: string[];
    competitor_moves: string[];
    community_discussion: string[];
  };
  requiredArchitectureChanges: string[];
  impactScore: number;
  migrationCost: {
    hours: number;
    complexity: 'low' | 'medium' | 'high' | 'critical';
    risk_level: 'low' | 'medium' | 'high';
  };
  shadowBranch: {
    name: string;
    commit_hash: string;
    refactored_modules: string[];
    test_results: TestResult[];
  };
  blockchainCommitment: {
    contract_address: string;
    transaction_hash: string;
    block_number: number;
    timestamp: number;
  };
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'committed' | 'emerged' | 'deployed' | 'validated';
}

export interface TestResult {
  test_id: string;
  scenario: string;
  passed: boolean;
  performance_delta: number;
  security_score: number;
  compatibility_issues: string[];
  timestamp: Date;
}

export interface OracleState {
  predictions: ParadigmPrediction[];
  active_monitoring: string[];
  learning_history: LearningCycle[];
  accuracy_metrics: AccuracyMetrics;
  deployed_predictions: string[];
  failed_predictions: string[];
  emergent_patterns: EmergentPattern[];
}

export interface LearningCycle {
  cycle_id: string;
  predictions_made: number;
  predictions_correct: number;
  average_error_margin: number;
  model_improvement: number;
  lessons_learned: string[];
  timestamp: Date;
}

export interface AccuracyMetrics {
  total_predictions: number;
  correct_predictions: number;
  accuracy_percentage: number;
  average_lead_time: number; // days
  false_positives: number;
  false_negatives: number;
  precision: number;
  recall: number;
}

export interface EmergentPattern {
  pattern_id: string;
  pattern_type: string;
  description: string;
  first_observed: Date;
  last_observed: Date;
  frequency: number;
  related_predictions: string[];
  signal_strength: number;
}

export interface CodeRefactorRequest {
  prediction_id: string;
  target_architecture: string;
  modules_to_refactor: string[];
  test_scenarios: string[];
  rollback_plan: string;
  estimated_time: number;
}

export interface RefactorResult {
  request_id: string;
  branch_name: string;
  commit_hash: string;
  files_changed: number;
  lines_added: number;
  lines_deleted: number;
  test_coverage: number;
  security_scan_results: SecurityScanResult[];
  performance_impact: number;
  timestamp: Date;
}

export interface SecurityScanResult {
  vulnerability_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affected_files: string[];
  remediation: string;
  confidence: number;
}

export interface DeploymentPlan {
  plan_id: string;
  prediction_id: string;
  staged_rollout: DeploymentStage[];
  rollback_strategy: string;
  monitoring_points: MonitoringPoint[];
  estimated_duration: number; // minutes
  success_criteria: string[];
}

export interface DeploymentStage {
  stage_number: number;
  name: string;
  affected_services: string[];
  percentage: number;
  duration_minutes: number;
  health_checks: string[];
  rollback_conditions: string[];
}

export interface MonitoringPoint {
  metric: string;
  threshold: number;
  alert_on: 'exceed' | 'below';
  remediation_action: string;
}

export interface BlockchainProof {
  proof_id: string;
  prediction_id: string;
  prediction_hash: string;
  reasoning_hash: string;
  confidence_weight: number;
  timestamp: number;
  block_number: number;
  transaction_hash: string;
  network: 'ethereum' | 'polygon' | 'arbitrum';
}

export interface OracleMetrics {
  total_predictions_lifetime: number;
  predictions_proven_correct: number;
  average_lead_time_days: number;
  current_accuracy: number;
  models_improved: number;
  paradigm_shifts_detected: number;
  deployments_automated: number;
  zero_downtime_migrations: number;
  learning_cycles_completed: number;
  blockchain_commitments: number;
}

export interface AgentTask {
  task_id: string;
  agent_type: 'predictor' | 'refactor' | 'executor' | 'monitor' | 'learner';
  status: 'queued' | 'running' | 'completed' | 'failed';
  prediction_id?: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  started_at?: Date;
  completed_at?: Date;
  dependencies: string[];
}
