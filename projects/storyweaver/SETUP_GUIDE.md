# StoryWeaver Setup Guide

Complete walkthrough for getting StoryWeaver running on Termux/Android.

## Prerequisites

- Termux installed on Android device
- ~500MB free space (for dependencies)
- Basic terminal familiarity

## Step 1: Environment Setup

### Install Termux Essentials

```bash
apt update
apt install -y git curl wget nano python3 python3-pip nodejs npm
```

### Create Project Directory

```bash
cd ~
git clone <your-storyweaver-repo> storyweaver
cd storyweaver
```

## Step 2: Install Ollama

Ollama is the AI backbone. It runs LLMs locally without any API keys.

```bash
# Download Ollama for Termux
curl -sSfL https://ollama.ai/install.sh | sh

# Or manually:
wget https://ollama.ai/download/linux/ollama-linux-amd64.tgz
tar xzf ollama-linux-amd64.tgz
```

### Start Ollama Service

```bash
ollama serve &
# Ollama will be available at http://localhost:11434
```

### Pull a Model

```bash
# Fast & compact (7B params, ~4GB)
ollama pull llama3.2

# Or lighter alternative (3B params, ~2GB)
ollama pull gemma2
```

## Step 3: Install Dependencies

### Python Virtual Environment

```bash
cd ~/storyweaver
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Node Modules

```bash
npm install
# Also install frontend deps
cd frontend
npm install
cd ..
```

### Optional: Install Book Generation Tools

For EPUB generation (recommended):
```bash
apt install -y pandoc
```

For MOBI/Kindle format (optional):
```bash
apt install -y calibre
# Or if calibre-ebook-convert unavailable, stick with EPUB
```

## Step 4: Environment Configuration

### Create .env File

```bash
cp .env.example .env
nano .env
```

### Minimal .env

```
# Local services
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2
WEBUI_PORT=8080

# Backend
FLASK_ENV=development
FLASK_SECRET_KEY=dev-secret-key-change-in-production

# Disable monetization for now
MONETIZATION_ENABLED=false

# Email (optional, for Kindle sending later)
KINDLE_EMAIL=your-email@kindle.com
GMAIL_ADDRESS=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

## Step 5: Initial Run

### First Time Setup

```bash
bash run.sh init
```

This will:
- Verify all dependencies
- Create project directories (backend, frontend, books)
- Set up Python virtual environment
- Install Node packages

### Start Services

```bash
bash run.sh start
```

You should see:
```
[INFO] Starting Ollama server...
[SUCCESS] Ollama started
[INFO] Starting Flask backend...
[SUCCESS] Backend started (PID: XXXX)
[INFO] Starting frontend...
[SUCCESS] Frontend started (PID: YYYY)
[SUCCESS] All services started!
Open http://localhost:8080 in your browser
```

### Access the App

Open your browser:
- **Main UI**: http://localhost:8080
- **API Docs**: http://localhost:5000/api/health
- **Ollama**: http://localhost:11434/api/tags

## Step 6: Test the System

### Test Backend

```bash
curl http://localhost:5000/api/health
# Should return: {"status": "ok", "service": "storyweaver-backend"}
```

### Test Ollama Connection

```bash
curl http://localhost:5000/api/ollama/health
# Should return Ollama status
```

### Create a Story

Use the web UI:
1. Click "✨ New Story"
2. Type a message in the chat
3. AI should respond with story suggestions

## Step 7: Generate Books (Optional)

Once you have a story:

1. Click "📝 Story" tab
2. Click "📖 Generate Book"
3. Wait for EPUB to be created in `books/` folder
4. Download and read on your device

## Step 8: Git Integration

### Configure Git (if not already done)

```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

### Save Progress

```bash
# Add all changes
git add -A

# Commit
git commit -m "Added story: My First Tale"

# Push (if you have a remote)
git push origin master
```

### Or use the shortcut

```bash
bash run.sh commit "Added story: My First Tale"
bash run.sh push
```

## Step 9: Troubleshooting

### Ollama Not Starting

```bash
# Check if Ollama is running
pgrep ollama

# Manual start with debug output
ollama serve

# Check Ollama health
curl http://localhost:11434/api/tags
```

### Backend Errors

```bash
# Check logs
tail -f logs/backend.log

# Restart backend
source venv/bin/activate
python backend/app.py
```

### Frontend Not Loading

```bash
# Check frontend logs
tail -f logs/frontend.log

# Try clearing cache and rebuilding
rm -rf frontend/node_modules/.vite
npm run build
```

### Memory Issues

If you get out-of-memory errors:
- Use a lighter model: `ollama pull gemma2` (3B instead of 7B)
- Close other apps
- Increase Termux allocated memory in settings

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080
kill -9 <PID>

# Or change port in .env
WEBUI_PORT=8888
```

## Step 10: Monetization (Later)

When ready to add payments:

1. Get Stripe API keys: https://dashboard.stripe.com
2. Add to .env:
   ```
   MONETIZATION_ENABLED=true
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```
3. UI will show "Unlock full book export" button
4. Free users see 2 chapter previews
5. Paid feature: Full EPUB export + Kindle email

## Next Steps

- ✅ Local AI chat working
- 📖 Generate books from stories
- 🎨 Add image generation for chapters
- 📧 Email books to Kindle
- 💳 Enable Stripe payments
- 🌐 Deploy to cloud (optional)

## File Structure

```
storyweaver/
├── backend/
│   ├── app.py              # Flask API
│   └── book_generator.py   # EPUB/MOBI creation
├── frontend/
│   ├── src/
│   │   ├── App.svelte
│   │   └── components/
│   └── index.html
├── books/                  # Generated EPUBs/MOBIs
├── logs/                   # Service logs
├── .env                    # Configuration (don't commit)
├── run.sh                  # Start/stop/manage services
├── README.md
└── requirements.txt
```

## Support

- GitHub Issues: Open an issue in the repo
- Logs: Check `logs/` directory
- Restart everything: `bash run.sh stop && bash run.sh start`

Happy story writing! 📖✨
