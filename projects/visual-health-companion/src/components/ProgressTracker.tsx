'use client'

import { UserProfile } from '@/lib/types'
import { calculateBMI } from '@/lib/avatarUtils'

export default function ProgressTracker({ profile }: { profile: UserProfile | null }) {
  if (!profile) {
    return <div className="card">Loading profile...</div>
  }

  const currentBMI = calculateBMI(profile.currentWeight, profile.height)
  const startBMI = calculateBMI(profile.startWeight, profile.height)
  const weightLost = profile.startWeight - profile.currentWeight
  const weightToGo = profile.currentWeight - profile.goalWeight
  const progressPercent = (weightLost / (profile.startWeight - profile.goalWeight)) * 100

  return (
    <div className="card space-y-4">
      <h3 className="text-lg font-bold">Your Progress</h3>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Current Weight</span>
          <span className="font-semibold">{profile.currentWeight} kg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Goal Weight</span>
          <span className="font-semibold">{profile.goalWeight} kg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">To Go</span>
          <span className="font-semibold">{weightToGo.toFixed(1)} kg</span>
        </div>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${Math.min(progressPercent, 100)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-400">
        {progressPercent.toFixed(0)}% Complete
      </div>

      <div className="border-t border-slate-700 pt-4 space-y-2">
        <div className="text-xs text-gray-400">BMI: {currentBMI.toFixed(1)}</div>
        <div className="text-xs text-gray-400">
          Lost: {weightLost.toFixed(1)} kg
        </div>
      </div>
    </div>
  )
}
