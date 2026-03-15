# Implementation Guide: Building the Complete System

## Quick Reference: What Each File Does

### Core Files
- **package.json** - Dependencies and scripts
- **tsconfig.json** - TypeScript configuration
- **next.config.js** - Next.js optimization
- **tailwind.config.ts** - Styling framework

### Pages & Components

#### Landing & Onboarding
- **src/app/page.tsx** - Landing page → Onboarding flow
- **src/components/OnboardingForm.tsx** - 5-min survey (maps to ONBOARDING_SURVEY.md)

#### Dashboard
- **src/app/dashboard/page.tsx** - Main user dashboard
- **src/components/AvatarViewer.tsx** - 3D avatar rendering with Three.js
- **src/components/CoachChat.tsx** - AI coach conversation interface
- **src/components/ProgressTracker.tsx** - Stats and progress visualization
- **src/components/WeightLogModal.tsx** - Weight entry modal
- **src/components/Navbar.tsx** - Navigation and auth

### Utilities & Helpers
- **src/lib/types.ts** - TypeScript interfaces (database schema)
- **src/lib/supabaseClient.ts** - Database client
- **src/lib/avatarUtils.ts** - Avatar calculations (morph, metrics)
- **src/lib/auth.tsx** - NextAuth provider

### API Routes

#### Authentication
- **src/app/api/auth/[...nextauth]/route.ts** - OAuth flow (Google)

#### User Management
- **src/app/api/user/profile/route.ts** - GET/POST user profile

#### Core Features
- **src/app/api/weight/log/route.ts** - Weight logging
- **src/app/api/coach/message/route.ts** - AI coach responses

### Documentation
- **README.md** - Project overview and quick start
- **DEPLOYMENT.md** - Vercel, Docker, AWS, local setup
- **COACH_SYSTEM_PROMPT.md** - Complete AI coach personality (copy to LLM provider)
- **ONBOARDING_SURVEY.md** - Detailed survey questions and branching logic
- **FINANCIAL_MODEL.md** - Business projections and metrics
- **IMPLEMENTATION_GUIDE.md** - This file

---

## Step 1: Local Development Setup (30 min)

### 1.1 Initialize Project
```bash
# Clone or create new Next.js project with files
npm install

# Verify all packages installed
npm list | grep -E "@react-three|@supabase|next-auth"
```

### 1.2 Configure Environment
```bash
# Copy template
cp .env.example .env.local

# Get Supabase credentials from dashboard
# Settings > API > Copy URLs and keys

# Generate NextAuth secret
openssl rand -hex 32
# Paste into NEXTAUTH_SECRET

# Get Google OAuth (console.cloud.google.com)
# Create project > Enable Google+ API > Create OAuth credentials
```

### 1.3 Create Database
**In Supabase Dashboard**:
1. Go to **SQL Editor**
2. Copy all SQL from DEPLOYMENT.md → **Database Schema**
3. Run each CREATE TABLE statement
4. Verify tables in **Table Editor**

### 1.4 Test Local Server
```bash
npm run dev
# Visit http://localhost:3000
# Should see landing page with "Meet Your Future Self"
```

---

## Step 2: Implement Onboarding Flow (2-3 days)

### 2.1 Update OnboardingForm Component

Current: Basic weight/age form
Needed: Full survey from ONBOARDING_SURVEY.md

```tsx
// src/components/OnboardingForm.tsx

// Reference ONBOARDING_SURVEY.md sections:
// - Section 1: Physical Metrics (Q1-Q4)
// - Section 2: Health History (Q5-Q9)  
// - Section 3: Goal & Lifestyle (Q10-Q13)
// - Section 4: Demographics (Q14-Q16)
// - Section 5: Mental Health (Q17-Q19)
// - Section 6: Confirmation (Q20-Q21)

// Key additions:
1. Add multi-step form state (currentStep)
2. Implement branching logic for Q5 (health conditions)
3. Add PHQ-2 & SCOFF screening (Q8, Q9)
4. Show warnings for BMI/goals (Q3 validation)
5. Save "why statement" and obstacle data
```

### 2.2 Add Health Screening Logic
```tsx
// After form submission, before avatar generation:

const handleFormSubmit = async () => {
  // 1. Calculate PHQ-2 score
  const phq2Score = q8a + q8b
  if (phq2Score >= 3) {
    showCrisisResources()
    pauseOnboarding()
    return
  }
  
  // 2. Calculate SCOFF score
  const scoffScore = countYesAnswers([q9a, q9b, q9c, q9d, q9e])
  if (scoffScore >= 2) {
    showEDResources()
    referralRequired()
    return
  }
  
  // 3. If clear, proceed to avatar generation
  generateAvatar()
}
```

### 2.3 Create Post-Onboarding User Profile
```tsx
// After avatar generation, save to database:

const saveUserProfile = async () => {
  const response = await fetch('/api/user/profile', {
    method: 'POST',
    body: JSON.stringify({
      height: form.height,
      startWeight: form.weight,
      currentWeight: form.weight,
      goalWeight: form.goalWeight,
      goal: form.goal,
      age: form.age,
      gender: form.gender,
      activityLevel: form.activityLevel,
      avatarUrl: generatedAvatarUrl,
      
      // Additional from survey
      whyStatement: form.whyStatement,
      biggestObstacle: form.obstacle,
      bodyImageScore: form.bodyImageScore,
      phq2Score: calculatePHQ2(form),
      scoffScore: calculateSCOFF(form),
    })
  })
  
  redirectToDashboard()
}
```

---

## Step 3: Implement Avatar System (2-3 days)

### 3.1 Avatar Generation (Ready Player Me)
```tsx
// src/components/OnboardingForm.tsx

const generateAvatar = async () => {
  // 1. Call Ready Player Me API
  const bmi = form.weight / (form.height / 100) ** 2
  
  // 2. Map to avatar parameters
  const params = {
    model: bmi > 25 ? 'fullbody-fat' : 'fullbody-avg',
    gender: form.gender,
    bodyType: classifyBodyType(bmi, form.goal),
  }
  
  // 3. Generate avatar URL
  const avatarUrl = await fetch(
    `https://api.readyplayer.me/v1/avatars?${new URLSearchParams(params)}`
  )
  
  // 4. Save to user profile
  saveUserProfile(avatarUrl)
}
```

### 3.2 Avatar Morphing Based on Metrics
```tsx
// src/lib/avatarUtils.ts - Already implemented

// Calculate avatar parameters from health metrics:
calculateAvatarParams(metrics): AvatarParams {
  return {
    bodyFat: normalizeBodyFat(metrics.bodyFatPercentage),
    muscleMass: normalizeMuscle(metrics.muscleMassPercentage),
    energy: metrics.energyLevel,
    posture: determinePosture(metrics.energyLevel),
    skinGlow: metrics.energyLevel * 0.8 + 0.2,
    animation: metrics.energyLevel > 0.7 ? 'idle_energetic' : 'idle_tired',
  }
}

// Smooth transitions (no jarring jumps):
smoothAvatarTransition(oldParams, newParams, alpha = 0.1)
```

### 3.3 Trigger Avatar Updates
```tsx
// When user logs weight or workout:

const onWeightLogged = async (weight: number) => {
  // 1. Save weight to database
  await fetch('/api/weight/log', { body: JSON.stringify({ weight }) })
  
  // 2. Recalculate metrics
  const newMetrics = calculateHealthMetrics(userProfile, workoutCount, sleepQuality)
  
  // 3. Get new avatar parameters
  const newAvatarParams = calculateAvatarParams(newMetrics)
  
  // 4. Morph avatar smoothly
  updateAvatarMorphTargets(newAvatarParams, { smooth: true, duration: 2000 })
  
  // 5. Show celebration if significant progress
  if (weightLost > 2) showCelebration()
}
```

### 3.4 Avatar Rendering (Three.js)
```tsx
// src/components/AvatarViewer.tsx - Already implemented

// Uses:
// - GLTFLoader to load Ready Player Me model
// - Three.js for 3D rendering
// - MorphTargets for body morphing
// - Animations for idle/energetic states
// - Auto-rotation in viewer

// Key: Update morph targets when metrics change
updateMorphTargets(avatar, morphParams) {
  if (avatar.morphTargetInfluences) {
    avatar.morphTargetInfluences[0] = morphParams.bodyFat // body fat morph
    avatar.morphTargetInfluences[1] = morphParams.muscleMass // muscle morph
  }
}
```

---

## Step 4: Implement AI Coach (2-3 days)

### 4.1 Coach System Prompt Integration

**Choose LLM Provider** (copy COACH_SYSTEM_PROMPT.md to your provider):

#### Option A: OpenAI/ChatGPT
```python
# backend/coach.py
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_coach_response(user_message, conversation_history):
    response = client.chat.completions.create(
        model="gpt-4",
        system=open("COACH_SYSTEM_PROMPT.md").read(),
        messages=conversation_history + [{
            "role": "user",
            "content": user_message
        }],
        temperature=0.7,
        max_tokens=300,
    )
    return response.choices[0].message.content
```

#### Option B: Google Gemini
```python
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_coach_response(user_message, conversation_history):
    model = genai.GenerativeModel(
        'gemini-pro',
        system_instruction=open("COACH_SYSTEM_PROMPT.md").read()
    )
    chat = model.start_chat(history=conversation_history)
    response = chat.send_message(user_message)
    return response.text
```

#### Option C: Self-Hosted Qwen (Akash)
```python
# Backend running on Akash GPU
import requests

def get_coach_response(user_message, conversation_history):
    response = requests.post(
        "http://akash-deployment:5000/api/chat",
        json={
            "prompt": user_message,
            "system": open("COACH_SYSTEM_PROMPT.md").read(),
            "history": conversation_history,
        }
    )
    return response.json()["response"]
```

### 4.2 Update Coach API Route
```tsx
// src/app/api/coach/message/route.ts

export async function POST(request: NextRequest) {
  const { message, conversationHistory } = await request.json()
  
  // 1. Format for LLM
  const formattedHistory = conversationHistory.map(m => ({
    role: m.role,
    content: m.content
  }))
  
  // 2. Call your chosen LLM
  const response = await callLLM({
    system: COACH_SYSTEM_PROMPT,
    messages: formattedHistory,
    userMessage: message,
  })
  
  // 3. Save message to database
  await supabase.from('coach_messages').insert([
    { userId, role: 'user', content: message },
    { userId, role: 'assistant', content: response },
  ])
  
  // 4. Check for red flags
  if (detectRedFlag(message)) {
    addCrisisResources(response)
  }
  
  return NextResponse.json({ response })
}
```

### 4.3 Red Flag Detection
```tsx
// Helper function (add to src/lib/coachUtils.ts)

interface RedFlags {
  rapidWeightLoss: boolean
  excessiveExercise: boolean
  restrictiveEating: boolean
  bodyDysmorphiaLanguage: boolean
  selfHarmMentions: boolean
}

function detectRedFlag(userMessage: string): RedFlags | null {
  const flags = {
    rapidWeightLoss: detectWeightLossPattern(userMessage),
    excessiveExercise: /workout|exercise|\b\d+\s*(hours?|hr)/i.test(userMessage) 
      && parseInt(userMessage) > 14,
    restrictiveEating: /\d+\s*calories?|restrict|fast|starv/i.test(userMessage)
      && parseInt(userMessage) < 1200,
    bodyDysmorphiaLanguage: /fat|disgusting|hate|ugly|myself|body/i.test(userMessage),
    selfHarmMentions: /harm|cut|hurt myself|kill/i.test(userMessage),
  }
  
  return Object.values(flags).some(f => f) ? flags : null
}
```

---

## Step 5: Connect Progress Tracking (1-2 days)

### 5.1 Weight Logging
```tsx
// src/app/api/weight/log/route.ts - Already implemented

// Trigger avatar update:
onWeightSubmit → updateAvatar → smoothTransition
```

### 5.2 Workout Logging (New Route)
```tsx
// Create src/app/api/workout/log/route.ts

export async function POST(request: NextRequest) {
  const { minutes, type, notes, date } = await request.json()
  
  // 1. Save workout
  const { data } = await supabase
    .from('workout_logs')
    .insert({ userId: user.id, minutes, type, notes, date })
  
  // 2. Update energy level based on workout
  const newEnergy = calculateNewEnergy(
    previousEnergy, 
    minutes, 
    type
  )
  
  // 3. Trigger avatar update
  updateAvatarParams({ energy: newEnergy })
  
  // 4. Generate coach message
  const coachMessage = generateCoachMessage(type, minutes)
  
  return NextResponse.json({ success: true, coachMessage })
}
```

### 5.3 Progress Dashboard
```tsx
// src/components/ProgressTracker.tsx - Already implemented

// Shows:
// - Weight progress toward goal
// - BMI trend
// - Workout streak
// - Weight lost/gained
// - Days since start

// Updates when:
// - Weight logged
// - Workout completed
// - Profile fetched
```

---

## Step 6: Deploy to Production (1-2 days)

### 6.1 Vercel Deployment (Recommended)
```bash
# 1. Push to GitHub
git add .
git commit -m "Initial: Visual Health Companion MVP"
git push origin main

# 2. Import to Vercel
# Go to vercel.com/new → Import GitHub repo

# 3. Set environment variables in Vercel dashboard
# (See DEPLOYMENT.md for full list)

# 4. Deploy
# Automatic on push to main
```

### 6.2 Custom Domain
```bash
# 1. Buy domain (Vercel Domains, Namecheap, etc.)
# 2. Add to Vercel project settings
# 3. Wait for DNS propagation (5-30 min)
```

### 6.3 SSL Certificate
Automatic with Vercel (free Let's Encrypt)

---

## Step 7: Testing Checklist

### Feature Tests
- [ ] **Onboarding**: Complete survey → avatar generation
- [ ] **Avatar**: Check morphs smoothly on weight change
- [ ] **Coach**: Send message → get response
- [ ] **Weight Log**: Submit → dashboard updates
- [ ] **Auth**: Sign in/out, session persistence
- [ ] **Dashboard**: All cards load data
- [ ] **Mobile**: Responsive on phone

### Safety Tests
- [ ] **Red Flags**: PHQ-2 score ≥3 → crisis resources shown
- [ ] **SCOFF**: Score ≥2 → referral activated
- [ ] **Coach Guardrails**: No dangerous advice in responses
- [ ] **Data Privacy**: Can only see own profile/messages

### Performance Tests
- [ ] **Avatar Load**: <3 seconds
- [ ] **Avatar Morph**: Smooth transition, no jank
- [ ] **Coach Response**: <2 seconds
- [ ] **Page Load**: Lighthouse score >85

### Security Tests
- [ ] **Auth Protected**: Can't access dashboard without login
- [ ] **RLS Enabled**: Users see only their data
- [ ] **CORS**: Cross-origin requests properly configured
- [ ] **Secrets**: No API keys in client code

---

## Step 8: Launch & Growth

### Pre-Launch (Week 1)
- [ ] Setup analytics (Google Analytics, Plausible)
- [ ] Setup error tracking (Sentry)
- [ ] Create landing page on separate domain
- [ ] Write first 3 blog posts (SEO content)
- [ ] Prepare Product Hunt submission

### Launch Week
- [ ] **Day 1**: Product Hunt launch
- [ ] **Day 2-3**: Email outreach to fitness influencers
- [ ] **Day 4-5**: TikTok/Instagram reels with avatar transformation
- [ ] **Day 6-7**: Reddit (r/fitness, r/loseit, r/progresspics)

### Month 1 Growth
- [ ] Track signup funnel (landing → onboarding → dashboard)
- [ ] Monitor conversion to paid (target 5-10%)
- [ ] Gather user feedback via in-app survey
- [ ] Iterate on highest-friction points

### Month 2-3
- [ ] Launch affiliate program
- [ ] Start content marketing (blog + YouTube)
- [ ] Run paid ads on Meta (test $500/week)
- [ ] Engage with community (Twitter/TikTok)

---

## Key Metrics to Monitor

### Daily
```
- Active users
- Onboarding completion rate
- Coach message volume
- Errors/bugs reported
```

### Weekly
```
- New signups
- Free → paid conversion
- Churn rate
- Average user engagement
- Coach sentiment (positive/supportive)
```

### Monthly
```
- MRR & ARR
- CAC (cost per user acquired)
- LTV (customer lifetime value)
- NPS (net promoter score)
- Retention curves
```

---

## Common Pitfalls & Solutions

| Issue | Solution |
|-------|----------|
| Avatar loads too slowly | Use CDN for model files, compress GLB format |
| Coach gives medical advice | Strict system prompt, automated red flag detection |
| Users see other users' data | Verify RLS policies, test auth flows |
| High churn (>15%) | Improve onboarding, coach engagement |
| Low conversion (<5%) | A/B test paywall, improve free tier UX |
| Coach responses irrelevant | Fine-tune system prompt, add user context |

---

## Next Steps

1. **Today**: Get Supabase setup, run local dev server
2. **Days 1-2**: Complete onboarding survey implementation
3. **Days 3-4**: Integrate LLM provider, test coach responses
4. **Days 5-6**: Avatar morphing, weight logging
5. **Days 7-8**: Deploy to Vercel, test all features
6. **Week 2**: Launch, market, iterate

**Estimated MVP time: 10-14 days** with solid engineering

Good luck! 🚀
