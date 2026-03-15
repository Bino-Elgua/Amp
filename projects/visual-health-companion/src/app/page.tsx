'use client'

import { useState } from 'react'
import OnboardingForm from '@/components/OnboardingForm'
import AvatarViewer from '@/components/AvatarViewer'

export default function Home() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {!avatarUrl ? (
        <div className="max-w-4xl mx-auto pt-20 px-6">
          <h1 className="text-6xl font-bold text-center mb-8">
            Meet Your Future Self
          </h1>
          <p className="text-xl text-center mb-12 text-gray-300">
            Watch your avatar transform as you reach your health goals
          </p>
          <OnboardingForm onAvatarGenerated={setAvatarUrl} />
        </div>
      ) : (
        <div className="h-screen">
          <AvatarViewer avatarUrl={avatarUrl} />
        </div>
      )}
    </main>
  )
}
