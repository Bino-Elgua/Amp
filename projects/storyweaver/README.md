# StoryWeaver

A fully open-source, zero-cost AI story-to-book web app. Write stories locally, generate beautiful EPUB/MOBI books, and send them to Kindle — all free, forever.

## Features

- **Local AI Chat**: Powered by Ollama + Open WebUI
- **Intelligent Writing**: llama3.2/gemma2 as default, upgradeable
- **Book Generation**: Markdown → EPUB → MOBI (Pandoc + Calibre)
- **AI Illustrations**: Generate chapter images with local models (Flux.1/SDXL)
- **Kindle Export**: Email books directly to your Kindle
- **Monetization Ready**: One-toggle Stripe integration (test mode pre-configured)
- **Voice Input**: Web Speech API for dictation
- **Dark Mode**: Mobile-first, WhatsApp-style chat UI
- **One-Click Git**: Save progress with auto-commit

## Quick Start

1. Clone and install:
   ```bash
   cd storyweaver
   bash run.sh init
   ```

2. Start all services:
   ```bash
   bash run.sh start
   ```

3. Open http://localhost:8080 in your browser

4. Start writing stories!

## Project Structure

```
storyweaver/
├── backend/          # Flask API + book generation
├── frontend/         # Svelte/Vue UI
├── ollama-config/    # Ollama model configs
├── books/           # Generated books (EPUB/MOBI)
├── run.sh           # One-command startup
├── package.json     # Node dependencies
├── requirements.txt # Python dependencies
└── .env.example     # Configuration template
```

## Requirements

- Node.js 18+
- Python 3.9+
- Ollama (auto-installed via run.sh)
- Pandoc (optional, for EPUB generation)
- Calibre (optional, for MOBI generation)

## Tech Stack

- **Backend**: Flask + FastAPI
- **Frontend**: Svelte (or Vue)
- **AI**: Ollama (llama3.2, gemma2, etc.)
- **Book Gen**: Pandoc, Calibre
- **Images**: Stable Diffusion (local) via Automatic1111 or ollama-webui
- **Payments**: Stripe (test mode)
- **Database**: SQLite (local)

## Monetization (Optional)

Enabled with one environment variable:
```bash
MONETIZATION_ENABLED=true
```

- Landing page with pricing
- Free preview: 2 chapters
- Paid: Full book export ($0.99 one-time or $4/month)
- Stripe webhook integration pre-built

## Environment Setup

Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
# Edit .env with your settings
```

## Development

```bash
# Install deps
npm install
pip install -r requirements.txt

# Run in dev mode with hot-reload
npm run dev

# Build for production
npm run build
```

## Commit & Push

```bash
bash run.sh commit "Your message"
bash run.sh push
```

## License

MIT - Free forever, use as you like.

---

Built with ❤️ for writers, powered by open-source AI.
