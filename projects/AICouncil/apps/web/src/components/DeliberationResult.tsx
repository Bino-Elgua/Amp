import React, { useState } from 'react'

interface Vote {
  agent_id: string
  position: string
  confidence: number
  reasoning: string
}

interface DeliberationProps {
  deliberation: {
    topic: string
    consensus_score: number
    consensus_reached: boolean
    votes: Vote[]
    chairman_summary: string
    recommendation?: string
    disagreement_severity: number
    timestamp?: string
  }
}

export default function DeliberationResult({ deliberation }: DeliberationProps) {
  const [expanded, setExpanded] = useState(false)

  const consensusColor = deliberation.consensus_score >= 0.75 
    ? 'from-green-900/20 to-green-800/10 border-green-800/30'
    : deliberation.consensus_score >= 0.5
    ? 'from-yellow-900/20 to-yellow-800/10 border-yellow-800/30'
    : 'from-red-900/20 to-red-800/10 border-red-800/30'

  const consensusBadgeColor = deliberation.consensus_score >= 0.75
    ? 'bg-green-900/30 text-green-300 border-green-800'
    : deliberation.consensus_score >= 0.5
    ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800'
    : 'bg-red-900/30 text-red-300 border-red-800'

  return (
    <div className={`bg-gradient-to-r ${consensusColor} border rounded-lg overflow-hidden transition-all`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex-1 text-left">
          <p className="text-white font-semibold">{deliberation.topic}</p>
          {deliberation.timestamp && (
            <p className="text-xs text-gray-400 mt-1">{deliberation.timestamp}</p>
          )}
        </div>
        <div className="flex items-center gap-3 ml-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {(deliberation.consensus_score * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-gray-400">consensus</p>
          </div>
          <span className={`text-2xl ${expanded ? 'rotate-180' : ''} transition-transform`}>▼</span>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-white/10 p-4 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${consensusBadgeColor}`}>
              {deliberation.consensus_reached ? '✓ Consensus Reached' : '✗ No Consensus'}
            </div>
            <div className="text-xs text-gray-400">
              Disagreement: {(deliberation.disagreement_severity * 100).toFixed(0)}%
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 className="text-sm font-semibold text-purple-300 mb-2">Summary</h4>
            <p className="text-sm text-gray-300">{deliberation.chairman_summary}</p>
          </div>

          {/* Recommendation */}
          {deliberation.recommendation && (
            <div>
              <h4 className="text-sm font-semibold text-green-300 mb-2">Recommendation</h4>
              <p className="text-sm text-gray-300">{deliberation.recommendation}</p>
            </div>
          )}

          {/* Votes */}
          <div>
            <h4 className="text-sm font-semibold text-purple-300 mb-3">Agent Votes</h4>
            <div className="space-y-3">
              {deliberation.votes.map((vote) => (
                <div key={vote.agent_id} className="bg-slate-900/50 p-3 rounded border border-purple-800/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{vote.agent_id}</span>
                    <div className="flex items-center gap-2">
                      <div className="relative w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all"
                          style={{ width: `${vote.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{(vote.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      vote.position === 'agree' ? 'bg-green-900/40 text-green-300' :
                      vote.position === 'disagree' ? 'bg-red-900/40 text-red-300' :
                      'bg-yellow-900/40 text-yellow-300'
                    }`}>
                      {vote.position.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{vote.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
