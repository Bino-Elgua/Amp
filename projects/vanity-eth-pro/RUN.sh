#!/bin/bash

# ÀṣẹMirror — Zero-Config Startup
# Just run: bash RUN.sh

echo "🔮 ÀṣẹMirror Launching..."
echo ""

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    echo "Install from: https://nodejs.org"
    exit 1
fi

# Install if needed
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies (first time)..."
    npm install
    echo ""
fi

# Start
echo "🚀 Starting on http://localhost:1111"
echo ""
echo "⚙️  FIRST TIME SETUP:"
echo "   1. App opens on localhost:1111"
echo "   2. Click 'Configure ÀṣẹMirror' modal"
echo "   3. Choose your LLM provider"
echo "   4. Add your API key"
echo "   5. Click 'Save Settings'"
echo ""
echo "Then you're ready to use all features!"
echo ""

npm run dev
