import React, { useEffect, useState } from 'react'

interface Agent {
  id: string
  name: string
  description: string
  expertise: string[]
}

interface AgentsListProps {
  apiUrl: string
}

export default function AgentsList({ apiUrl }: AgentsListProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/council/agents`)
        if (response.ok) {
          const data = await response.json()
          setAgents(data.agents || [])
        } else {
          console.error('Response not ok:', response.status)
        }
      } catch (err) {
        console.error('Failed to fetch agents:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
    // Retry every 5 seconds if empty
    const interval = setInterval(fetchAgents, 5000)
    return () => clearInterval(interval)
  }, [apiUrl])

  const agentIcons: Record<string, string> = {
    'agent_1': '🧠',
    'agent_2': '🛠️',
    'agent_3': '⚔️',
    'agent_4': '⚖️',
    'agent_5': '🎯'
  }

  return (
    <div className="p-6 bg-slate-900/50 border border-purple-800/30 rounded-lg">
      <h2 className="text-lg font-semibold text-white mb-4">Council Agents</h2>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading agents...</p>
        </div>
      ) : agents.length === 0 ? (
        <p className="text-gray-400 text-sm">No agents available</p>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => (
            <div key={agent.id} className="p-3 bg-slate-800/50 border border-purple-800/20 rounded">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{agentIcons[agent.id] || '🤖'}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{agent.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{agent.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {agent.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="inline-block px-2 py-1 bg-purple-900/40 text-purple-300 text-xs rounded"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-3 bg-purple-900/20 border border-purple-800/30 rounded text-xs text-purple-300">
        <p>💡 <strong>Agents</strong> bring different perspectives to reach consensus through epistemic deliberation.</p>
      </div>
    </div>
  )
}
