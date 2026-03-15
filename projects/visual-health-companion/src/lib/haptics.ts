// Haptic feedback utilities

export const haptics = {
  // Light tap (25ms)
  tap: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(25)
    }
  },

  // Success pattern (double tap)
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50])
    }
  },

  // Error pattern (buzzing)
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200])
    }
  },

  // Celebration pattern (rapid pulses)
  celebrate: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50, 30, 50, 30, 100])
    }
  },

  // Long press
  longPress: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(150)
    }
  },
}
