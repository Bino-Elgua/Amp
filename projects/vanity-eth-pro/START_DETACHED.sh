#!/bin/bash

# ÀṣẹMirror — Start in Background

cd /data/data/com.termux/files/home/aśẹmirror

echo "🔮 ÀṣẹMirror Starting..."
echo ""

# Install if needed
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install --silent
    echo ""
fi

# Start in background
nohup npm run dev > asemirror.log 2>&1 &
SERVER_PID=$!

echo "✅ Server starting (PID: $SERVER_PID)"
echo ""
echo "Waiting for server to be ready..."

# Wait for server to start
for i in {1..30}; do
    if curl -s http://localhost:1111 > /dev/null 2>&1; then
        echo ""
        echo "🎉 ÀṣẹMirror is LIVE!"
        echo ""
        echo "🌐 Open your browser: http://localhost:1111"
        echo ""
        echo "⚙️  First time? Configure your LLM in the Settings modal"
        echo ""
        echo "📝 Logs: tail -f asemirror.log"
        echo "🛑 Stop: kill $SERVER_PID"
        echo ""
        exit 0
    fi
    sleep 1
done

echo "❌ Server didn't start. Check logs:"
cat asemirror.log
