export type UserProfile = {
  id: string
  email: string
  height: number // cm
  startWeight: number // kg
  currentWeight: number // kg
  goalWeight: number // kg
  goal: 'lose' | 'gain' | 'maintain'
  age: number
  gender: 'male' | 'female' | 'other'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export type WorkoutLog = {
  id: string
  userId: string
  date: string
  minutes: number
  type: string
  notes: string
  createdAt: string
}

export type WeightLog = {
  id: string
  userId: string
  date: string
  weight: number // kg
  createdAt: string
}

export type AvatarParams = {
  bodyFat: number // 0-1
  muscleMass: number // 0-1
  energy: number // 0-1
  posture: 'slouched' | 'neutral' | 'upright'
  skinGlow: number // 0-1
  animation: string
}

export type CoachMessage = {
  id: string
  userId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export type HealthMetrics = {
  bmi: number
  bodyFatPercentage: number
  muscleMassPercentage: number
  weightChangePercent: number
  workoutStreak: number
  energyLevel: number
}
