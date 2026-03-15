import React, { useEffect, useState } from 'react'

interface Status {
  status: string
  service: string
  version: string
  config: {
    debug: boolean
    deliberation_timeout: number
    min_consensus: number
    litellm_base_url: string
    fallback_model: string
  }
}

interface ServiceStatusProps {
  apiUrl: string
}

export default function ServiceStatus({ apiUrl }: ServiceStatusProps) {
  const [status, setStatus] = useState<Status | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/council/status`)
        if (response.ok) {
          const data = await response.json()
          setStatus(data)
        }
      } catch (err) {
        console.error('Failed to fetch status:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 10000)
    return () => clearInterval(interval)
  }, [apiUrl])

  if (loading) {
    return (
      <div className="p-6 bg-slate-900/50 border border-purple-800/30 rounded-lg">
        <p className="text-gray-400 text-sm">Loading status...</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-slate-900/50 border border-purple-800/30 rounded-lg space-y-4">
      <h2 className="text-lg font-semibold text-white">Service Status</h2>

      {status && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">{status.service} v{status.version}</span>
          </div>

          <div className="border-t border-purple-800/20 pt-3 space-y-2 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Timeout</span>
              <span className="text-gray-300">{status.config.deliberation_timeout}s</span>
            </div>
            <div className="flex justify-between">
              <span>Min Consensus</span>
              <span className="text-gray-300">{(status.config.min_consensus * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Fallback Model</span>
              <span className="text-gray-300 truncate ml-2">{status.config.fallback_model}</span>
            </div>
            <div className="flex justify-between">
              <span>Debug Mode</span>
              <span className="text-gray-300">{status.config.debug ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>

          <div className="border-t border-purple-800/20 pt-3">
            <p className="text-xs text-purple-300 bg-purple-900/20 p-2 rounded">
              🔌 API: <span className="text-gray-300">{apiUrl}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
