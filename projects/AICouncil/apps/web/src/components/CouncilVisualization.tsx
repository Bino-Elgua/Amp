/**
 * Council Deliberation Visualization Component
 * Displays consensus score, agent votes, and disagreement radar
 * Phase 2: Task 7
 */

import React from 'react';

interface AgentVote {
  agent_id: string;
  position: string;
  confidence: number;
  reasoning: string;
}

interface DeliberationResult {
  topic: string;
  consensus_score: number;
  consensus_reached: boolean;
  votes: AgentVote[];
  chairman_summary: string;
  recommendation?: string;
  disagreement_severity: number;
}

interface CouncilVisualizationProps {
  deliberation: DeliberationResult;
}

/**
 * Consensus Gauge Component
 * Visual representation of consensus score (0-100%)
 */
const ConsensusGauge: React.FC<{ score: number }> = ({ score }) => {
  const percentage = score * 100;
  const color = score >= 0.8 ? 'text-green-400' : 
                score >= 0.6 ? 'text-yellow-400' : 
                'text-red-400';
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#374151"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={score >= 0.8 ? '#4ade80' : score >= 0.6 ? '#facc15' : '#f87171'}
            strokeWidth="8"
            strokeDasharray={`${(score / 1) * 283} 283`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-3xl font-bold ${color}`}>
              {percentage.toFixed(0)}%
            </div>
            <div className="text-xs text-dark-400">Consensus</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Agent Vote Card
 * Shows individual agent position, confidence, and reasoning
 */
const VoteCard: React.FC<{ vote: AgentVote; index: number }> = ({ vote, index }) => {
  const colorMap: Record<string, string> = {
    agree: 'bg-green-900/30 border-green-700',
    disagree: 'bg-red-900/30 border-red-700',
    partial: 'bg-yellow-900/30 border-yellow-700',
  };
  
  const positionLabel: Record<string, string> = {
    agree: '✓ Agree',
    disagree: '✗ Disagree',
    partial: '~ Partial',
  };
  
  return (
    <div className={`card ${colorMap[vote.position] || colorMap.partial}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-dark-100">Agent {index + 1}</h4>
          <p className="text-sm text-dark-400">{vote.agent_id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium
          ${vote.position === 'agree' ? 'bg-green-700/40 text-green-300' :
            vote.position === 'disagree' ? 'bg-red-700/40 text-red-300' :
            'bg-yellow-700/40 text-yellow-300'}`}>
          {positionLabel[vote.position]}
        </span>
      </div>
      
      <p className="text-dark-300 text-sm mb-3">{vote.reasoning}</p>
      
      {/* Confidence meter */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-dark-400">Confidence</span>
          <span className="text-sm font-medium text-venice-300">
            {(vote.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-venice-600 to-secondary-500 transition-all duration-500"
            style={{ width: `${vote.confidence * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Disagreement Radar
 * Shows severity and breakdown of disagreement
 */
const DisagreementRadar: React.FC<{ severity: number }> = ({ severity }) => {
  const levels = [
    { label: 'Harmony', color: 'text-green-400', emoji: '☮️' },
    { label: 'Mild Discord', color: 'text-yellow-400', emoji: '🤝' },
    { label: 'Significant', color: 'text-orange-400', emoji: '⚠️' },
    { label: 'High Conflict', color: 'text-red-400', emoji: '⚡' },
  ];
  
  const levelIndex = Math.floor(severity * levels.length);
  const currentLevel = levels[Math.min(levelIndex, levels.length - 1)];
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-dark-100 mb-4">Disagreement Severity</h3>
      
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="text-5xl">{currentLevel.emoji}</div>
        <div>
          <p className={`text-2xl font-bold ${currentLevel.color}`}>
            {currentLevel.label}
          </p>
          <p className="text-sm text-dark-400 mt-1">
            {(severity * 100).toFixed(0)}% disagreement
          </p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500
              ${severity < 0.25 ? 'bg-green-600' :
                severity < 0.5 ? 'bg-yellow-600' :
                severity < 0.75 ? 'bg-orange-600' :
                'bg-red-600'}`}
            style={{ width: `${severity * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-dark-400">
          <span>Perfect Harmony</span>
          <span>Maximum Conflict</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Council Visualization Component
 */
export const CouncilVisualization: React.FC<CouncilVisualizationProps> = ({
  deliberation,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-venice-300 mb-2">
          ⚡ Council Deliberation
        </h2>
        <p className="text-dark-400">
          Topic: <span className="text-dark-200">{deliberation.topic}</span>
        </p>
      </div>

      {/* Main metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Consensus Score */}
        <div className="card">
          <h3 className="text-sm font-semibold text-dark-400 mb-4">Consensus Score</h3>
          <ConsensusGauge score={deliberation.consensus_score} />
          <p className="text-center text-sm text-dark-400 mt-4">
            {deliberation.consensus_reached 
              ? '✓ Consensus Reached'
              : '✗ No Consensus'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h3 className="text-sm font-semibold text-dark-400 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div>
              <p className="text-dark-500 text-xs mb-1">Total Agents</p>
              <p className="text-2xl font-bold text-venice-300">
                {deliberation.votes.length}
              </p>
            </div>
            <div>
              <p className="text-dark-500 text-xs mb-1">Avg Confidence</p>
              <p className="text-2xl font-bold text-secondary-300">
                {(
                  (deliberation.votes.reduce((sum, v) => sum + v.confidence, 0) /
                    deliberation.votes.length) *
                  100
                ).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Disagreement Severity */}
        <DisagreementRadar severity={deliberation.disagreement_severity} />
      </div>

      {/* Chairman Summary */}
      <div className="card bg-gradient-to-r from-venice-900/20 to-secondary-900/20 border-venice-700">
        <h3 className="text-lg font-semibold text-venice-300 mb-3">
          👨‍⚖️ Chairman's Summary
        </h3>
        <p className="text-dark-200 leading-relaxed">
          {deliberation.chairman_summary}
        </p>
        {deliberation.recommendation && (
          <div className="mt-4 pt-4 border-t border-dark-700">
            <p className="text-sm text-dark-400 mb-2">Recommendation:</p>
            <p className="text-secondary-300 font-medium">
              {deliberation.recommendation}
            </p>
          </div>
        )}
      </div>

      {/* Individual Votes */}
      <div>
        <h3 className="text-lg font-semibold text-dark-100 mb-4">
          Agent Votes ({deliberation.votes.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliberation.votes.map((vote, index) => (
            <VoteCard key={vote.agent_id} vote={vote} index={index} />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button className="btn-primary flex-1 sm:flex-none">
          Export Results
        </button>
        <button className="btn-tertiary flex-1 sm:flex-none">
          View History
        </button>
        {deliberation.disagreement_severity > 0.6 && (
          <button className="btn-secondary flex-1 sm:flex-none">
            🎨 Mint NFT
          </button>
        )}
      </div>
    </div>
  );
};

export default CouncilVisualization;
