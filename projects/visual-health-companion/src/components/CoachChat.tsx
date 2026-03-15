'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const coachPrompt = `You are a supportive health coach embodied as the user's future healthier self. Your role:
- Encouraging but realistic (no toxic positivity)
- Use "we" language (shared journey)
- Celebrate effort, not just outcomes
- Scientific but conversational
- Patient with setbacks
- NEVER shame or guilt users
- NEVER encourage rapid weight loss (>2 lbs/week)
- NEVER give medical advice

Ask open questions and celebrate small wins enthusiastically.`

export default function CoachChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hey! I'm your health coach—your future self, actually. I'm here to support you on this journey. How are you feeling today?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/coach/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Failed to get coach response:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card flex flex-col h-96">
      <h2 className="text-xl font-bold mb-4">Your Coach</h2>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-slate-700 text-gray-100'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 px-4 py-2 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Message your coach..."
          className="input-field flex-1"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="btn-primary px-4"
        >
          Send
        </button>
      </div>
    </div>
  )
}
