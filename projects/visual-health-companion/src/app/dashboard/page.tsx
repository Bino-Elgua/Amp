'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AvatarViewer from '@/components/AvatarViewer'
import CoachChat from '@/components/CoachChat'
import ProgressTracker from '@/components/ProgressTracker'
import WeightLogModal from '@/components/WeightLogModal'
import { UserProfile } from '@/lib/types'

export default function Dashboard() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showWeightModal, setShowWeightModal] = useState(false)

  useEffect(() => {
    if (!session?.user?.email) return

    const fetchProfile = async () => {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    }

    fetchProfile()
  }, [session])

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to view your dashboard</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your Journey</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="lg:col-span-2 card h-96">
            {profile?.avatarUrl && <AvatarViewer avatarUrl={profile.avatarUrl} />}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <button
              onClick={() => setShowWeightModal(true)}
              className="btn-primary w-full"
            >
              Log Weight
            </button>
            <button className="btn-secondary w-full">Log Workout</button>
          </div>
        </div>

        {/* Coach Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <CoachChat />
          </div>

          {/* Progress */}
          <div>
            <ProgressTracker profile={profile} />
          </div>
        </div>
      </div>

      {showWeightModal && (
        <WeightLogModal
          onClose={() => setShowWeightModal(false)}
          onSubmit={() => {
            setShowWeightModal(false)
          }}
        />
      )}
    </div>
  )
}
