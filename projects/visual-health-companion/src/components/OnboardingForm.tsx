'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

type FormData = {
  height: number
  weight: number
  goalWeight: number
  goal: 'lose' | 'gain' | 'maintain'
  age: number
  gender: 'male' | 'female' | 'other'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
}

export default function OnboardingForm({
  onAvatarGenerated,
}: {
  onAvatarGenerated: (url: string) => void
}) {
  const [form, setForm] = useState<FormData>({
    height: 170,
    weight: 75,
    goalWeight: 70,
    goal: 'lose',
    age: 30,
    gender: 'male',
    activityLevel: 'moderate',
  })
  const [loading, setLoading] = useState(false)

  const generateAvatar = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('Please sign in first')
        return
      }

      const bmi = form.weight / (form.height / 100) ** 2
      const bodyType = bmi > 25 ? 'fullbody-fat' : 'fullbody-avg'

      const response = await fetch(
        `https://api.readyplayer.me/v1/avatars?model=${bodyType}&gender=${form.gender}`
      )
      const data = await response.json()

      if (data.avatarId) {
        onAvatarGenerated(
          `https://models.readyplayer.me/${data.avatarId}.glb`
        )
      }
    } catch (error) {
      console.error('Avatar generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Height (cm)</label>
            <input
              type="number"
              className="input-field"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Weight (kg)</label>
            <input
              type="number"
              className="input-field"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Goal Weight (kg)</label>
            <input
              type="number"
              className="input-field"
              value={form.goalWeight}
              onChange={(e) => setForm({ ...form, goalWeight: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              className="input-field"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Goal</label>
            <select
              className="input-field"
              value={form.goal}
              onChange={(e) =>
                setForm({
                  ...form,
                  goal: e.target.value as 'lose' | 'gain' | 'maintain',
                })
              }
            >
              <option value="lose">Weight Loss</option>
              <option value="gain">Muscle Gain</option>
              <option value="maintain">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Activity Level</label>
            <select
              className="input-field"
              value={form.activityLevel}
              onChange={(e) =>
                setForm({
                  ...form,
                  activityLevel: e.target.value as
                    | 'sedentary'
                    | 'light'
                    | 'moderate'
                    | 'active'
                    | 'very_active',
                })
              }
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateAvatar}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Generating...' : 'Create My Avatar'}
        </button>
      </div>
    </div>
  )
}
