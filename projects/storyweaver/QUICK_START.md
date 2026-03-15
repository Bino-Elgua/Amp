# StoryWeaver — Quick Start (5 minutes)

Get a full AI story writing app running on your Termux/Android device, completely free and offline.

## 1. Prerequisites Check (2 min)

Open Termux and run:
```bash
# Check what's already installed
node --version        # Should be v16+
python3 --version     # Should be 3.9+
git --version         # Should exist
pandoc --version      # Optional (for EPUB generation)
```

If anything is missing, install:
```bash
apt update && apt install -y nodejs npm python3 python3-pip git pandoc
```

## 2. Clone & Setup (1 min)

```bash
# Go to your projects directory
cd ~

# Clone or init the project
git clone <repo-url> storyweaver
cd storyweaver

# Copy environment template
cp .env.example .env

# Edit .env if needed (optional for now)
# nano .env
```

## 3. Install Everything (2 min)

```bash
# One command to install all dependencies
bash run.sh init
```

This will:
- ✅ Install Ollama
- ✅ Pull llama3.2 model (~4GB, one-time)
- ✅ Install Python packages
- ✅ Install Node packages
- ✅ Create project directories

**Note:** First time takes 5-10 min depending on internet. Subsequent runs are instant.

## 4. Start & Open (1 min)

```bash
# Start all services in one command
bash run.sh start
```

Wait for output like:
```
[SUCCESS] All services started!
Open http://localhost:8080 in your browser
```

Open your browser: **http://localhost:8080**

## 5. Write Your First Story

1. Click "✨ New Story"
2. Type in chat: "Start a fantasy story about a young wizard discovering magic"
3. AI responds with story suggestions
4. Continue the conversation to develop your story
5. Click "📝 Story" to see full story
6. Click "📖 Generate Book" to create EPUB

## 6. Download or Send to Kindle

Once book is generated:
- **Download**: Click the download button
- **Send to Kindle**: Add your Kindle email in settings, click "Send"

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Shift+Enter | Add new line in chat |
| Enter | Send message |
| Ctrl+C | Stop services |

## Troubleshooting

**Ollama taking too long?**
```bash
# Check if already running
pgrep ollama

# Pull model manually (one-time, ~10 min)
ollama pull llama3.2
```

**Port 8080 already in use?**
```bash
# Change port in .env
WEBUI_PORT=8888
bash run.sh stop
bash run.sh start
```

**Out of memory?**
```bash
# Use lighter model instead
ollama pull gemma2
# Edit .env: OLLAMA_MODEL=gemma2
```

**Backend/Frontend won't start?**
```bash
# Check logs
tail -f logs/backend.log
tail -f logs/frontend.log

# Restart
bash run.sh stop
bash run.sh start
```

## Stop Services

```bash
bash run.sh stop
```

Or press `Ctrl+C` in the terminal where `bash run.sh start` is running.

## Save Progress to Git

```bash
# Auto-commit your stories
bash run.sh commit "Added fantasy story draft"

# Push to GitHub (if configured)
bash run.sh push
```

## What's Running?

- **Ollama** (port 11434): AI model serving
- **Flask Backend** (port 5000): API for chat, books, payments
- **Frontend** (port 8080): Web UI (Svelte)
- **SQLite DB**: Stores stories locally in `backend/storyweaver.db`

## Next: Advanced Features

Once basic setup works:

1. **Generate Book Covers**: Enable image generation with local Stable Diffusion
2. **Enable Monetization**: Set `MONETIZATION_ENABLED=true` in .env, add Stripe keys
3. **Deploy to Cloud**: Push to Vercel, Railway, or Heroku (one command)
4. **Custom Models**: Run `ollama pull mistral` or any other model

## One-Liner to Check Everything

```bash
curl http://localhost:5000/api/health && curl http://localhost:11434/api/tags
```

Both should return `200 OK`.

## Full Documentation

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete details.

---

**Happy writing!** 📖✨

Questions? Check logs in `logs/` directory or open an issue on GitHub.
