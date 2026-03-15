import React, { useEffect, useState } from 'react'
import Dashboard from './pages/Dashboard'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface AppContextType {
  apiUrl: string
}

export const AppContext = React.createContext<AppContextType>({ apiUrl: API_URL })

function App() {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    // Check API health
    fetch(`${API_URL}/health`)
      .then(r => setIsOnline(r.ok))
      .catch(() => setIsOnline(false))

    // Reconnect every 5s
    const interval = setInterval(() => {
      fetch(`${API_URL}/health`)
        .then(r => setIsOnline(r.ok))
        .catch(() => setIsOnline(false))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <AppContext.Provider value={{ apiUrl: API_URL }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950">
        {/* Header */}
        <header className="border-b border-purple-800/50 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">🏛️ AICouncil</h1>
              <p className="text-sm text-purple-300">Distributed Epistemic Consensus Engine</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-400">{isOnline ? 'Connected' : 'Offline'}</span>
              <span className="text-xs text-gray-500">({API_URL})</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!isOnline && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-300 text-sm">
                <strong>Connection Error:</strong> Cannot connect to Council API at {API_URL}. Make sure it's running on port 8000.
              </p>
            </div>
          )}
          <Dashboard />
        </main>

        {/* Footer */}
        <footer className="border-t border-purple-800/50 bg-slate-950/50 mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
            <p>AICouncil Dashboard • Powered by Venice AI, Sui Blockchain & Arweave</p>
          </div>
        </footer>
      </div>
    </AppContext.Provider>
  )
}

export default App
