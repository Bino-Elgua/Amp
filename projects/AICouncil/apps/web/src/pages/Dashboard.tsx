import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../App'
import DeliberationForm from '../components/DeliberationForm'
import DeliberationResult from '../components/DeliberationResult'
import AgentsList from '../components/AgentsList'
import ServiceStatus from '../components/ServiceStatus'

interface Deliberation {
  topic: string
  consensus_score: number
  consensus_reached: boolean
  votes: Array<{
    agent_id: string
    position: string
    confidence: number
    reasoning: string
  }>
  chairman_summary: string
  recommendation?: string
  disagreement_severity: number
  timestamp?: string
}

export default function Dashboard() {
  const { apiUrl } = useContext(AppContext)
  const [deliberations, setDeliberations] = useState<Deliberation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeliberate = async (topic: string, numAgents: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiUrl}/api/council/deliberate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, num_agents: numAgents })
      })

      if (!response.ok) throw new Error('Deliberation failed')

      const data = await response.json()
      setDeliberations([
        {
          ...data,
          timestamp: new Date().toLocaleTimeString()
        },
        ...deliberations
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Status & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <DeliberationForm onSubmit={handleDeliberate} loading={loading} />
        </div>

        {/* Service Status */}
        <ServiceStatus apiUrl={apiUrl} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-red-300 text-sm">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deliberations History */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white">Deliberation History</h2>
          {deliberations.length === 0 ? (
            <div className="p-8 bg-slate-900/50 border border-purple-800/30 rounded-lg text-center">
              <p className="text-gray-400">No deliberations yet. Submit a topic above to begin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deliberations.map((d, i) => (
                <DeliberationResult key={i} deliberation={d} />
              ))}
            </div>
          )}
        </div>

        {/* Agents Sidebar */}
        <div>
          <AgentsList apiUrl={apiUrl} />
        </div>
      </div>
    </div>
  )
}
