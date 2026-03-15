import React, { useState } from 'react'

interface DeliberationFormProps {
  onSubmit: (topic: string, numAgents: number) => void
  loading: boolean
}

export default function DeliberationForm({ onSubmit, loading }: DeliberationFormProps) {
  const [topic, setTopic] = useState('')
  const [numAgents, setNumAgents] = useState(3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      onSubmit(topic, numAgents)
      setTopic('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-900/50 border border-purple-800/30 rounded-lg space-y-4">
      <h2 className="text-lg font-semibold text-white">Submit for Deliberation</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Topic or Question
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading}
          placeholder="What should the council deliberate on?"
          className="w-full px-4 py-3 bg-slate-800 border border-purple-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Number of Agents: <span className="text-purple-400">{numAgents}</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={numAgents}
          onChange={(e) => setNumAgents(Number(e.target.value))}
          disabled={loading}
          className="w-full accent-purple-500 disabled:opacity-50"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1 Agent</span>
          <span>10 Agents</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !topic.trim()}
        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '🔄 Deliberating...' : '⚖️ Start Deliberation'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Council will deliberate and reach consensus based on agent expertise
      </p>
    </form>
  )
}
