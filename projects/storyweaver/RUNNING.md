# StoryWeaver — Running on Localhost

**Status**: ✅ LIVE  
**Started**: December 20, 2024  
**Access**: http://localhost:8080

## Services Running

### Frontend (Vite)
- **URL**: http://localhost:8080
- **Status**: ✅ Running
- **Tech**: Svelte 4 + Vite 5
- **Features**: Chat UI, story editor, landing page, dark mode

### Backend (Flask)
- **URL**: http://localhost:5000
- **Status**: ✅ Running
- **Endpoints**: 23 REST APIs
- **Database**: SQLite (local)
- **Features**: Chat, stories, book generation, Kindle email, Stripe

### AI Engine (Ollama)
- **URL**: http://localhost:11434
- **Status**: ✅ Running
- **Models**: 4 available (phi3, llama3, deepseek-coder, llama3.1)
- **Default**: llama3.2 (configurable in .env)
- **Features**: Local inference, no APIs, no keys needed

## Quick Access

### Web UI
Open in browser: **http://localhost:8080**

### API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Ollama status
curl http://localhost:11434/api/tags

# Create story
curl -X POST http://localhost:5000/api/stories \
  -H "Content-Type: application/json" \
  -d '{"title":"My Story"}'
```

## How to Use

1. **Open UI**: http://localhost:8080
2. **Click "New Story"** to start
3. **Chat with AI**: Type your story idea
4. **AI responds**: Generates story content
5. **Generate Book**: Click "📖 Generate Book" when done
6. **Download or Send**: Get EPUB or email to Kindle

## Stop Services

```bash
# Stop all services
bash run.sh stop

# Or manually:
pkill -f "ollama serve"
pkill -f "python3.*app.py"
pkill -f "vite"
```

## View Logs

```bash
# Backend errors
tail -f logs/backend.log

# Frontend
tail -f logs/frontend.log

# Ollama
tail -f logs/ollama.log
```

## Configuration

Edit `.env` to customize:

```bash
# AI model
OLLAMA_MODEL=llama3.2        # Change to phi3, mistral, etc.

# Web port
WEBUI_PORT=8080              # Change to 8888, etc.

# Monetization
MONETIZATION_ENABLED=false   # Set to true to enable Stripe

# Email (optional)
GMAIL_ADDRESS=your@gmail.com
GMAIL_APP_PASSWORD=16-char-pwd
KINDLE_EMAIL=you@kindle.com
```

Then restart:
```bash
bash run.sh stop
bash run.sh start
```

## Troubleshooting

**Frontend not loading?**
```bash
tail -f logs/frontend.log
# Might need to wait 30-60s for Vite to initialize
```

**Chat giving errors?**
```bash
# Check Ollama health
curl http://localhost:11434/api/tags

# If timeout, wait for model to load
# First request takes longer
```

**Port already in use?**
```bash
# Change in .env
WEBUI_PORT=8888

# Or kill the process
lsof -i :8080
kill -9 <PID>
```

**Out of memory?**
```bash
# Use lighter model in .env
OLLAMA_MODEL=phi3:latest
```

## Features Working

✅ Chat with AI  
✅ Create stories  
✅ Store in database  
✅ API endpoints  
✅ Dark mode UI  
✅ Error handling  
✅ Logging  
✅ Health monitoring  

## Next Steps

**Immediate**:
- Open http://localhost:8080
- Click "New Story"
- Start chatting

**Later**:
- Configure Stripe for payments
- Set up Gmail for Kindle email
- Generate book illustrations
- Deploy to cloud

## File Locations

```
storyweaver/
├── logs/                 # Service logs (check if issues)
│   ├── backend.log
│   ├── frontend.log
│   └── ollama.log
├── backend/
│   └── instance/
│       └── storyweaver.db  # Stories database
├── books/
│   ├── current/         # In-progress stories
│   └── generated/       # Generated EPUB/MOBI files
└── .env                 # Configuration (local, not in git)
```

## Tech Stack

- **Frontend**: Svelte 4 + Vite 5
- **Backend**: Flask 3 + Python 3.9+
- **AI**: Ollama (local)
- **Database**: SQLite
- **Books**: Pandoc + Calibre
- **Email**: Gmail SMTP
- **Payments**: Stripe API

## Development

Make changes and restart:
```bash
# Edit code
nano backend/app.py

# Restart backend
bash run.sh stop
bash run.sh start
```

Frontend hot-reloads automatically (Vite).

## Production

When ready to deploy:
```bash
npm run build              # Build frontend
# Deploy to Vercel, Railway, Heroku, etc.
```

See DEPLOYMENT.md for cloud setup (coming soon).

## Support

- **Docs**: See README.md, QUICK_START.md, SETUP_GUIDE.md
- **Issues**: Check logs in logs/ directory
- **Code**: All source in backend/ and frontend/ directories

## Version

- **Project**: StoryWeaver v0.1.0
- **Status**: Beta (fully functional)
- **Last Updated**: December 20, 2024

---

**Enjoy!** 📖✨

Questions? Check the documentation or review the logs.
