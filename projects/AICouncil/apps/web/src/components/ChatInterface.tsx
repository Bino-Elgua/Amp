import { useState } from 'react'
import axios from 'axios'

interface Vote {
  agent_id: string
  position: string
  confidence: number
  reasoning: string
}

interface DeliberationResponse {
  topic: string
  consensus_score: number
  consensus_reached: boolean
  votes: Vote[]
  chairman_summary: string
  recommendation?: string
  disagreement_severity: number
}

const agentColors: { [key: string]: { bg: string; text: string; badge: string } } = {
  agent_1: { bg: 'bg-blue-500/10', text: 'text-blue-300', badge: 'bg-blue-500/20 text-blue-300' },
  agent_2: { bg: 'bg-green-500/10', text: 'text-green-300', badge: 'bg-green-500/20 text-green-300' },
  agent_3: { bg: 'bg-orange-500/10', text: 'text-orange-300', badge: 'bg-orange-500/20 text-orange-300' },
}

const positionColors: { [key: string]: string } = {
  agree: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  partial: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  disagree: 'bg-red-500/20 text-red-300 border border-red-500/30',
}

export default function ChatInterface() {
  const [topic, setTopic] = useState('')
  const [context, setContext] = useState('')
  const [numAgents, setNumAgents] = useState(3)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DeliberationResponse | null>(null)
  const [error, setError] = useState('')

  const handleDeliberate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) {
      setError('Please enter a topic for deliberation')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post<DeliberationResponse>(
        'http://localhost:8000/api/council/deliberate',
        {
          topic,
          context: context || undefined,
          num_agents: numAgents,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      setResult(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deliberate. Check backend service.')
    } finally {
      setLoading(false)
    }
  }

  const ConsensusBar = ({ score }: { score: number }) => {
    const percent = score * 100
    let barColor = 'bg-red-500'
    if (percent >= 75) barColor = 'bg-emerald-500'
    else if (percent >= 50) barColor = 'bg-yellow-500'
    else if (percent >= 25) barColor = 'bg-orange-500'
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Consensus</span>
          <span className={`text-2xl font-bold ${percent >= 75 ? 'text-emerald-400' : percent >= 50 ? 'text-yellow-400' : 'text-orange-400'}`}>
            {percent.toFixed(0)}%
          </span>
        </div>
        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/50">
          <div
            className={`h-full ${barColor} transition-all duration-500 rounded-full shadow-lg`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <form onSubmit={handleDeliberate} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
            <span className="text-lg">❓</span>
            <span>Deliberation Topic</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Should AI systems have rights? Is quantum computing the future? Should we colonize Mars?"
            className="w-full px-4 py-4 bg-slate-700/30 border border-purple-500/30 hover:border-purple-500/50 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:bg-slate-700/50 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
            <span className="text-lg">📝</span>
            <span>Additional Context (Optional)</span>
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Provide background information, constraints, or details that will help the council deliberate more effectively..."
            rows={4}
            className="w-full px-4 py-4 bg-slate-700/30 border border-purple-500/30 hover:border-purple-500/50 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:bg-slate-700/50 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all resize-none"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <span className="text-lg">🤖</span>
              <span>Number of Agents</span>
            </label>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-bold">
              {numAgents} Agents
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={numAgents}
            onChange={(e) => setNumAgents(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>1 Agent</span>
            <span>5 Agents</span>
            <span>10 Agents</span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm flex items-start space-x-3 animate-in fade-in">
            <span className="text-lg mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-4 font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 text-lg ${
            loading
              ? 'bg-slate-600 text-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50 active:scale-95'
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin">⟳</span>
              <span>Deliberating in Council...</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>Start Deliberation</span>
            </>
          )}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-6 mt-8 pt-8 border-t border-purple-500/20 animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Deliberation Results</h3>
            <p className="text-slate-400">
              <span className="font-semibold text-purple-300">Topic:</span> {result.topic}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-6">
              <ConsensusBar score={result.consensus_score} />
              <div className="mt-4 flex items-center space-x-2">
                {result.consensus_reached ? (
                  <>
                    <span className="text-lg">✅</span>
                    <span className="text-emerald-400 font-semibold">Consensus Reached</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">⚠️</span>
                    <span className="text-orange-400 font-semibold">No Clear Consensus</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-xl p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Disagreement</span>
                  <span className="text-2xl font-bold text-orange-400">
                    {(result.disagreement_severity * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/50">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500 rounded-full"
                    style={{ width: `${result.disagreement_severity * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-orange-300 mt-2">Severity Level</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-6">
              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-300">Participating Agents</div>
                <div className="text-3xl font-bold text-blue-400 mt-2">{result.votes.length}</div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {result.votes.map((vote) => (
                    <span
                      key={vote.agent_id}
                      className={`text-xs px-2 py-1 rounded ${agentColors[vote.agent_id]?.badge || 'bg-slate-600 text-slate-300'}`}
                    >
                      {vote.agent_id}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Agent Votes */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <span className="text-xl">🗳️</span>
              <span>Agent Votes</span>
            </h4>
            <div className="space-y-4">
              {result.votes.map((vote) => {
                const colors = agentColors[vote.agent_id] || agentColors.agent_1
                return (
                  <div
                    key={vote.agent_id}
                    className={`${colors.bg} border border-slate-600/50 hover:border-slate-500/50 rounded-xl p-5 transition-all hover:shadow-lg`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1 flex-1">
                        <div className={`text-sm font-bold ${colors.text}`}>{vote.agent_id}</div>
                        <div className={`flex items-center space-x-2 mt-2`}>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${positionColors[vote.position] || positionColors.partial}`}>
                            {vote.position.charAt(0).toUpperCase() + vote.position.slice(1)}
                          </span>
                          <span className="text-xs text-slate-400">Confidence:</span>
                          <span className="text-sm font-bold text-blue-400">{(vote.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="text-3xl">
                        {vote.position === 'agree' ? '👍' : vote.position === 'disagree' ? '👎' : '🤝'}
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mt-3 leading-relaxed">{vote.reasoning}</p>
                    <div className="mt-3 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${colors.bg}`}
                        style={{ width: `${vote.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Chairman Summary */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <span className="text-xl">👑</span>
              <span>Chairman Summary</span>
            </h4>
            <p className="text-slate-200 leading-relaxed text-base">{result.chairman_summary}</p>
          </div>

          {/* Recommendation */}
          {result.recommendation && (
            <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-6">
              <h4 className="text-lg font-bold text-emerald-400 mb-3 flex items-center space-x-2">
                <span className="text-xl">💡</span>
                <span>Recommendation</span>
              </h4>
              <p className="text-slate-200 leading-relaxed text-base">{result.recommendation}</p>
            </div>
          )}

          {/* New Deliberation Button */}
          <button
            onClick={() => {
              setResult(null)
              setTopic('')
              setContext('')
            }}
            className="w-full px-6 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 hover:border-slate-500 text-slate-300 hover:text-white font-medium rounded-xl transition-all"
          >
            ← Start New Deliberation
          </button>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="mt-12 pt-8 border-t border-purple-500/20 text-center">
          <div className="text-6xl mb-4">💭</div>
          <h3 className="text-xl font-bold text-white mb-2">Ready for Deliberation</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Enter a topic above and let the council debate from multiple perspectives. Watch consensus emerge in real-time.
          </p>
        </div>
      )}
    </div>
  )
}
