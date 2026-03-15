# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Supabase project created
- NextAuth credentials (Google OAuth)
- Vercel account (optional, for hosting)

## Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Supabase Setup

Create a new Supabase project at https://supabase.com

#### Get Credentials
- Go to **Settings > API**
- Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

#### Create Database Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  height INT,
  startWeight DECIMAL(10, 2),
  currentWeight DECIMAL(10, 2),
  goalWeight DECIMAL(10, 2),
  goal TEXT CHECK (goal IN ('lose', 'gain', 'maintain')),
  age INT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  activityLevel TEXT CHECK (activityLevel IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  avatarUrl TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weight Logs Table
CREATE TABLE public.weight_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  weight DECIMAL(10, 2),
  date DATE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout Logs Table
CREATE TABLE public.workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  date DATE,
  minutes INT,
  type TEXT,
  notes TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coach Messages Table
CREATE TABLE public.coach_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_weight_logs_userId ON public.weight_logs(userId);
CREATE INDEX idx_weight_logs_date ON public.weight_logs(date);
CREATE INDEX idx_workout_logs_userId ON public.workout_logs(userId);
CREATE INDEX idx_coach_messages_userId ON public.coach_messages(userId);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies - User can only see their own data
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own weight logs"
  ON public.weight_logs
  FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert weight logs"
  ON public.weight_logs
  FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can view own workout logs"
  ON public.workout_logs
  FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert workout logs"
  ON public.workout_logs
  FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can view own messages"
  ON public.coach_messages
  FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert messages"
  ON public.coach_messages
  FOR INSERT
  WITH CHECK (auth.uid() = userId);
```

### 3. Google OAuth Setup

Go to https://console.cloud.google.com

1. Create a new project
2. Enable "Google+ API"
3. Create OAuth 2.0 credentials (Web application)
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`
5. Copy Client ID → `GOOGLE_CLIENT_ID`
6. Copy Client Secret → `GOOGLE_CLIENT_SECRET`

### 4. Environment Variables

Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyxxxxx

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with: openssl rand -hex 32

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# Ready Player Me
NEXT_PUBLIC_READYPLAYERME_DOMAIN=api.readyplayer.me

# Optional: LLM Integration
GEMINI_API_KEY=xxxxx
OPENAI_API_KEY=xxxxx
```

### 5. Generate NextAuth Secret
```bash
openssl rand -hex 32
```

Copy output to `NEXTAUTH_SECRET` in `.env.local`

### 6. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

---

## Production Deployment (Vercel)

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit: Visual Health Companion"
git push origin main
```

### 2. Import to Vercel
- Go to https://vercel.com/new
- Select GitHub repo
- Configure project settings

### 3. Set Environment Variables
In Vercel dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyxxxxx
NEXTAUTH_URL=https://yourdomain.vercel.app
NEXTAUTH_SECRET=generate_with: openssl rand -hex 32
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
NEXT_PUBLIC_READYPLAYERME_DOMAIN=api.readyplayer.me
```

### 4. Update Google OAuth Callback
Add to Google Cloud Console:
- `https://yourdomain.vercel.app/api/auth/callback/google`

### 5. Deploy
```bash
git push origin main
```

Vercel automatically deploys on push to main.

---

## Docker Deployment

### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Build app
COPY . .
RUN npm run build

# Run
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. Create .dockerignore
```
node_modules
.next
.git
.env.local
README.md
```

### 3. Build & Run
```bash
# Build
docker build -t health-companion .

# Run locally
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=xxxxx \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx \
  -e SUPABASE_SERVICE_ROLE_KEY=xxxxx \
  -e NEXTAUTH_SECRET=xxxxx \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e GOOGLE_CLIENT_ID=xxxxx \
  -e GOOGLE_CLIENT_SECRET=xxxxx \
  health-companion
```

### 4. Deploy to Cloud Services

#### Railway
```bash
railway login
railway init
railway up
```

#### Render
Push to GitHub, connect repo at https://dashboard.render.com

#### DigitalOcean
Push to DigitalOcean container registry and deploy via App Platform

---

## AWS EC2 Deployment

### 1. Launch EC2 Instance
- AMI: Ubuntu 22.04 LTS
- Type: t3.medium (recommended)
- Security Group: Allow SSH (22), HTTP (80), HTTPS (443)

### 2. SSH into instance
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

### 3. Install Dependencies
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git nginx
```

### 4. Clone Repository
```bash
cd /home/ubuntu
git clone https://github.com/yourusername/visual-health-companion.git
cd visual-health-companion
npm install
```

### 5. Create Environment File
```bash
nano .env.local
# Paste all environment variables
```

### 6. Build & Start
```bash
npm run build
npm start
```

### 7. Setup PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 start npm --name health-companion -- start
pm2 startup
pm2 save
```

### 8. Setup Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/default
```

Replace with:
```nginx
server {
    listen 80 default_server;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 9. Enable SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 10. Restart Nginx
```bash
sudo systemctl restart nginx
```

---

## Monitoring & Logging

### Sentry Setup (Error Tracking)

1. Create account at https://sentry.io
2. Create Next.js project
3. Add DSN to `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### Supabase Logs
- Dashboard → Logs → Functions
- Monitor all API calls and database operations

### Application Logs
```bash
# On EC2 with PM2
pm2 logs health-companion

# With Docker
docker logs -f health-companion
```

---

## Performance Optimization

### Enable Image Optimization
Already configured in `next.config.js` with Vercel.

### Database Query Optimization
- Indexes on `userId`, `date` columns
- Implement pagination for logs
- Cache user profiles with Redis (optional)

### CDN Configuration
- Supabase serves images via Cloudflare CDN
- Ready Player Me models cached by browser

### Bundle Optimization
```bash
npm run build
# Check Next.js build output for optimization suggestions
```

---

## Backup & Recovery

### Supabase Automated Backups
- Daily automated backups (30-day retention)
- Manual backups available in dashboard
- Recovery Point Objective (RPO): 24 hours

### Manual Database Backup
```bash
# Export from Supabase dashboard → Database → Backups

# Or via CLI:
supabase db pull > backup.sql
```

### Application Backup
```bash
git push # GitHub is your backup
```

---

## Scaling

### Prepare for Scale
1. Supabase auto-scales PostgreSQL
2. Set up read replicas for high traffic
3. Implement caching layer (Redis)
4. Consider CDN for assets

### Monitor Metrics
- Database connections
- API response times
- Error rates
- User onboarding funnel

Set up alerts in Sentry/DataDog if exceeds thresholds.

---

## Troubleshooting

### "Unauthorized" on API calls
- Check Supabase RLS policies
- Verify `auth.uid()` is set correctly

### Avatar not loading
- Verify Ready Player Me API key
- Check CORS settings in Supabase

### Slow dashboard
- Enable database query caching
- Implement pagination for logs
- Profile with Lighthouse

### Email not sending (future feature)
- Set up SendGrid API key
- Test with `npm run test:email`

---

## Rollback Procedure

### Vercel
1. Go to Deployments
2. Click "Promote to Production" on previous stable version
3. Automatically redeploys

### Docker/EC2
```bash
git log --oneline
git checkout commit-hash
npm run build
pm2 restart health-companion
```

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **ReadyPlayerMe**: https://docs.readyplayer.me
