import { UserProfile, HealthMetrics, AvatarParams } from './types'

export function calculateBMI(weight: number, height: number): number {
  return weight / (height / 100) ** 2
}

export function estimateBodyFat(bmi: number, age: number, gender: 'male' | 'female' | 'other'): number {
  if (gender === 'male') {
    return 1.20 * bmi + 0.23 * age - 16.2
  } else {
    return 1.20 * bmi + 0.23 * age - 5.4
  }
}

export function calculateHealthMetrics(profile: UserProfile, workoutCount: number, sleepQuality: number): HealthMetrics {
  const bmi = calculateBMI(profile.currentWeight, profile.height)
  const bodyFatPercentage = estimateBodyFat(bmi, profile.age, profile.gender)
  const muscleMassPercentage = Math.max(0, 100 - bodyFatPercentage - 20) // simplified
  const weightChangePercent = ((profile.startWeight - profile.currentWeight) / profile.startWeight) * 100
  const workoutStreak = workoutCount
  const energyLevel = (sleepQuality * 0.4 + workoutCount * 0.3 + (100 - bodyFatPercentage) * 0.3) / 100

  return {
    bmi,
    bodyFatPercentage: Math.max(0, Math.min(100, bodyFatPercentage)),
    muscleMassPercentage: Math.max(0, Math.min(100, muscleMassPercentage)),
    weightChangePercent,
    workoutStreak,
    energyLevel: Math.max(0, Math.min(1, energyLevel)),
  }
}

export function calculateAvatarParams(metrics: HealthMetrics): AvatarParams {
  const bodyFatNormalized = metrics.bodyFatPercentage / 100
  const muscleNormalized = metrics.muscleMassPercentage / 100
  const energyNormalized = metrics.energyLevel

  return {
    bodyFat: Math.min(1, Math.max(0.15, 0.4 - bodyFatNormalized * 0.3)),
    muscleMass: Math.min(1, muscleNormalized * 1.5)),
    energy: energyNormalized,
    posture: energyNormalized > 0.7 ? 'upright' : energyNormalized > 0.4 ? 'neutral' : 'slouched',
    skinGlow: energyNormalized * 0.8 + 0.2,
    animation: energyNormalized > 0.7 ? 'idle_energetic' : 'idle_tired',
  }
}

export function smoothAvatarTransition(oldParams: AvatarParams, newParams: AvatarParams, alpha: number = 0.1): AvatarParams {
  return {
    bodyFat: oldParams.bodyFat + (newParams.bodyFat - oldParams.bodyFat) * alpha,
    muscleMass: oldParams.muscleMass + (newParams.muscleMass - oldParams.muscleMass) * alpha,
    energy: oldParams.energy + (newParams.energy - oldParams.energy) * alpha,
    posture: newParams.posture,
    skinGlow: oldParams.skinGlow + (newParams.skinGlow - oldParams.skinGlow) * alpha,
    animation: newParams.animation,
  }
}
