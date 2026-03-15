#!/bin/bash

# ÀṣẹMirror — Start on localhost:1111

echo "🔮 ÀṣẹMirror Starting on localhost:1111"
echo ""

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚙️  Setting up .env..."
    cp .env.example .env
    echo ""
    echo "📝 Edit .env with your LLM API key:"
    echo "   LLM_PROVIDER=openai"
    echo "   OPENAI_API_KEY=sk-..."
    echo ""
    echo "Then run this script again."
    exit 0
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check Qdrant
echo "Checking Qdrant..."
if ! curl -s http://localhost:6333 > /dev/null; then
    echo "⚠️  Qdrant not running on port 6333"
    echo ""
    echo "Start Qdrant with:"
    echo "  docker run -d --name qdrant -p 6333:6333 qdrant/qdrant"
    echo ""
fi

# Index repos if needed
if [ "$1" = "--index" ]; then
    echo "📡 Indexing repositories..."
    npm run index
    echo ""
fi

# Start dev server
echo "🚀 Starting dev server on localhost:1111..."
echo ""
npm run dev

# After dev server stops
echo ""
echo "ÀṣẹMirror stopped"
