# Visual Health Companion

A transformative fitness app with dynamic 3D avatar evolution. Watch your avatar change as you progress toward your health goals.

## Features

✨ **Dynamic Avatar System**
- Real Player Me 3D avatar generation
- Real-time morphing based on health metrics
- Visual motivation through avatar transformation

🤖 **AI Health Coach**
- Conversational support and guidance
- Mental health monitoring with safety guardrails
- Personalized feedback on workouts and nutrition

📊 **Progress Tracking**
- Weight logging and trending
- Workout completion tracking
- BMI and body composition estimates

🎮 **Gamification**
- Achievement system
- Streak tracking
- Social sharing of transformations

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS, Three.js
- **Backend**: Next.js API Routes, FastAPI (optional for LLM)
- **Database**: Supabase (PostgreSQL)
- **Auth**: NextAuth.js with Supabase
- **3D**: Ready Player Me, Three.js, React Three Fiber
- **AI**: LLM integration (Gemini/Claude/Qwen)

## Quick Start

### 1. Clone & Install

```bash
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET` (generate: `openssl rand -hex 32`)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`

### 3. Database Schema

Create these tables in Supabase:

```sql
-- User Profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  height INT,
  startWeight DECIMAL,
  currentWeight DECIMAL,
  goalWeight DECIMAL,
  goal TEXT,
  age INT,
  gender TEXT,
  activityLevel TEXT,
  avatarUrl TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Weight Logs
CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES user_profiles(id),
  weight DECIMAL,
  date DATE,
  createdAt TIMESTAMP
);

-- Workout Logs
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES user_profiles(id),
  date DATE,
  minutes INT,
  type TEXT,
  notes TEXT,
  createdAt TIMESTAMP
);

-- Coach Messages
CREATE TABLE coach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES user_profiles(id),
  role TEXT,
  content TEXT,
  createdAt TIMESTAMP
);
```

### 4. Run Dev Server

```bash
npm run dev
```

Open http://localhost:3000

## Deployment

### Vercel

```bash
vercel deploy
```

Ensure environment variables are set in Vercel dashboard.

### Docker

```bash
docker build -t health-companion .
docker run -p 3000:3000 health-companion
```

## Architecture

```
┌─────────────────────────────────────┐
│         Next.js Frontend            │
│   (Components, Pages, API Routes)   │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼────────┐  ┌────▼──────────┐
│  Supabase     │  │ Ready Player  │
│  (Database)   │  │ Me (Avatar)   │
└───────────────┘  └───────────────┘
```

## Key Metrics

- **Activation**: Avatar generation success >95%
- **Engagement**: Daily active users target 40%
- **Retention**: Day 7 retention target >50%
- **Monetization**: Free-to-paid conversion target 15-20%

## Health & Safety

⚠️ **Important Considerations**

- All advice is supportive coaching, not medical
- Red flag detection for eating disorders and mental health concerns
- Professional referral system built in
- Crisis resources prominently displayed
- No medical claims or diagnoses

## Monetization

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Basic avatar, 1 daily check-in |
| Premium | $14.99/mo | Unlimited coaching, nutrition tracking |
| Elite | $29.99/mo | Advanced features, personal trainer |

## Roadmap

### Phase 1 (Weeks 1-8)
- [ ] Core avatar system
- [ ] Onboarding flow
- [ ] Weight logging
- [ ] Basic AI coach

### Phase 2 (Weeks 9-16)
- [ ] Workout tracking
- [ ] Progress photos
- [ ] Advanced customization
- [ ] Social features

### Phase 3 (Weeks 17+)
- [ ] Mobile apps
- [ ] Biometric integrations
- [ ] Community challenges
- [ ] Monetization launch

## Contributing

1. Create a feature branch
2. Make changes following the existing code style
3. Test thoroughly
4. Submit PR with description

## License

MIT
