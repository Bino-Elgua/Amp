'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface ConfettiProps {
  isActive: boolean
  onComplete?: () => void
}

export default function Confetti({ isActive, onComplete }: ConfettiProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive) return

    const confetti = []
    for (let i = 0; i < 50; i++) {
      confetti.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 2 + Math.random() * 1,
        emoji: ['🎉', '🎊', '⭐', '🏆', '💪', '✨'][Math.floor(Math.random() * 6)],
      })
    }

    return () => {
      if (onComplete) setTimeout(onComplete, 3000)
    }
  }, [isActive, onComplete])

  if (!isActive) return null

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{
            x: window.innerWidth * (Math.random() - 0.5),
            y: -50,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: window.innerWidth * (Math.random() - 0.5),
            y: window.innerHeight + 50,
            opacity: 0,
            rotate: 360,
          }}
          transition={{
            duration: 2 + Math.random() * 1,
            delay: Math.random() * 0.3,
            ease: 'easeIn',
          }}
        >
          {['🎉', '🎊', '⭐', '🏆', '💪', '✨'][i % 6]}
        </motion.div>
      ))}
    </div>
  )
}
