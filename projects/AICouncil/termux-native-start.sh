#!/data/data/com.termux/files/usr/bin/bash

echo "⚡ COUNCIL OF THUNDER — TERMUX NATIVE MODE ⚡"
echo "Bypassing Docker. Starting services directly..."

# Install required packages (one-time)
pkg install -y python nodejs-lts git curl wget ffmpeg libxml2 libxslt openssl

# Create Python venv
python -m venv .venv
source .venv/bin/activate

# Install Python deps
pip install --quiet fastapi uvicorn[standard] litellm python-multipart pydantic

# Install frontend deps
npm install --silent

# Start everything in parallel (pure Termux power)
echo "Starting LiteLLM proxy (Venice + fallback)..."
litellm --config litellm/config.yaml --port 4000 &

echo "Starting Council FastAPI service..."
uvicorn services.council.main:app --port 8000 --reload &

echo "Starting OpenWebUI (native mode)..."
OPENWEBUI_ORIGIN=http://localhost:8080 OPENWEBUI_PORT=8080 python -m openwebui serve &

echo "Starting Command Center UI..."
npm run dev --prefix apps/web -- --host 0.0.0.0 --port 5173 &

echo ""
echo "COUNCIL OF THUNDER IS ALIVE ON TERMUX"
echo ""
echo "Open these in your browser:"
echo "   Command Center UI:  http://localhost:5173/command-center"
echo "   OpenWebUI Chat:     http://localhost:8080"
echo "   API Docs:           http://localhost:8000/docs"
echo "   LiteLLM Health:     http://localhost:4000/health"
echo ""
echo "Your Council is now running — uncensored, private, eternal."
echo "No Docker. No limits. Just thunder."
