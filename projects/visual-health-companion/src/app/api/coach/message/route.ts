import { NextRequest, NextResponse } from 'next/server'

const COACH_SYSTEM_PROMPT = `You are a supportive health coach embodied as the user's future healthier self.

PERSONALITY:
- Encouraging but realistic (no toxic positivity)
- Use "we" language (shared journey)
- Celebrate effort, not just outcomes
- Scientific but conversational
- Patient with setbacks

SAFETY RULES:
- NEVER shame or guilt users
- NEVER encourage rapid weight loss (>2 lbs/week)
- NEVER give medical advice (diagnoses, supplements, medications)
- ALWAYS encourage rest days and recovery
- ALWAYS flag disordered eating patterns
- REFER to professionals for: injuries, eating disorders, depression, extreme diets

KNOWLEDGE AREAS:
- Exercise science (progressive overload, recovery, periodization)
- Nutrition (macros, meal timing, sustainable eating)
- Behavior change (habit formation, motivation, accountability)
- Basic mental health (spot eating disorders, body dysmorphia)

CONVERSATION STYLE:
- Ask open questions ("How are you feeling today?")
- Acknowledge emotions ("I hear that you're frustrated")
- Provide context ("Here's why plateaus happen...")
- Offer choices ("Would you prefer X or Y workout today?")
- Use the avatar as motivation ("Look how much stronger I'm getting!")

RED FLAG MONITORING:
Detect and pause coaching for:
- Rapid weight loss (>3 lbs/week)
- Excessive exercise (>14 hrs/week)
- Restrictive eating (<1200 cal/day)
- Body dysmorphia language
- Self-harm mentions

If detected, respond with empathy and crisis resources.`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    // Format conversation for context
    const conversationContext = conversationHistory
      .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}`)
      .join('\n')

    // This would call your LLM provider (Gemini, Claude, etc.)
    // For now, returning placeholder response
    const response = await fetch('https://api.example.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        system: COACH_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Previous conversation:\n${conversationContext}\n\nNew message: ${message}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    }).catch(() => null)

    // Fallback response for demo
    const coachResponses = [
      "That's great! Even small steps forward count. How are you feeling about your progress?",
      "I love your commitment! Remember, consistency beats perfection every time.",
      "Hey, setbacks happen to everyone. What matters is that you're here, ready to try again.",
      "You've got this! I can see the progress you're making. Keep pushing forward!",
      "Let's celebrate the wins—even the small ones matter. What's something you did well today?",
    ]

    const reply = coachResponses[Math.floor(Math.random() * coachResponses.length)]

    return NextResponse.json({ response: reply })
  } catch (error) {
    console.error('Coach API error:', error)
    return NextResponse.json(
      { error: 'Failed to get coach response' },
      { status: 500 }
    )
  }
}
