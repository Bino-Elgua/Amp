#!/bin/bash
# ÀṣẹMirror Quick Start

echo "🔮 ÀṣẹMirror Installation"
echo "=========================="
echo ""

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "⚙️  Configuration"
echo "================"
echo ""
echo "Choose your LLM provider:"
echo "  1) OpenAI (GPT-4o) - Most powerful"
echo "  2) Claude (Anthropic) - Best reasoning"
echo "  3) Gemini (Google) - Free tier available"
echo "  4) Mistral - Privacy-friendly"
echo "  5) Groq - Fastest"
echo "  6) Cohere - Enterprise-grade"
echo ""
read -p "Enter choice (1-6): " provider_choice

case $provider_choice in
    1) 
        provider="openai"
        read -p "OpenAI API Key (sk-...): " api_key
        ;;
    2)
        provider="claude"
        read -p "Anthropic API Key (sk-ant-...): " api_key
        ;;
    3)
        provider="gemini"
        read -p "Google API Key (AIza...): " api_key
        ;;
    4)
        provider="mistral"
        read -p "Mistral API Key: " api_key
        ;;
    5)
        provider="groq"
        read -p "Groq API Key (gsk_...): " api_key
        ;;
    6)
        provider="cohere"
        read -p "Cohere API Key: " api_key
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

# Create .env file
cat > .env << EOF
LLM_PROVIDER=$provider
${provider^^}_API_KEY=$api_key
QDRANT_URL=http://localhost:6333
GITHUB_REPOS=jbino85/council,jbino85/oso-lang,jbino85/ifascript,jbino85/techgnosis
PORT=3000
EOF

echo ""
echo "✓ Configuration saved to .env"
echo ""

# Ask about Qdrant
read -p "Set up local Qdrant? (y/n): " setup_qdrant
if [ "$setup_qdrant" = "y" ]; then
    echo "Starting Qdrant Docker..."
    docker run -d --name qdrant -p 6333:6333 qdrant/qdrant
    sleep 3
    echo "✓ Qdrant running on http://localhost:6333"
fi

echo ""
echo "🚀 Starting ÀṣẹMirror..."
npm run dev

echo ""
echo "Visit: http://localhost:3000"
