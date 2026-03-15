#!/bin/bash
# AICouncil - Local Development Startup Script
# Starts Council Service (FastAPI) and Web Frontend (React/Vite)

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                     AICouncil - Local Development                            ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check dependencies
echo -e "${BLUE}Checking dependencies...${NC}"
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 not found"
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo "Error: Node.js/npm not found"
    exit 1
fi

# Kill any existing processes on the same ports
echo -e "${YELLOW}Cleaning up any existing services on ports 8000 and 5173...${NC}"
lsof -ti:8000 >/dev/null 2>&1 && kill -9 $(lsof -ti:8000) || true
lsof -ti:5173 >/dev/null 2>&1 && kill -9 $(lsof -ti:5173) || true
sleep 1

# Install Council dependencies
echo -e "${BLUE}Installing Council service dependencies...${NC}"
if [ ! -d "services/council/.venv" ]; then
    pip install -q -r services/council/requirements.txt
fi

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd apps/web
if [ ! -d "node_modules" ]; then
    npm install -q
fi
cd "$PROJECT_DIR"

# Start Council service
echo -e "${GREEN}Starting Council Service (FastAPI) on port 8000...${NC}"
python services/council/main.py > ~/council.log 2>&1 &
COUNCIL_PID=$!
sleep 2

# Start Web Frontend
echo -e "${GREEN}Starting Web Frontend (Vite) on port 5173...${NC}"
cd apps/web
npm run dev > ~/web.log 2>&1 &
FRONTEND_PID=$!
sleep 3
cd "$PROJECT_DIR"

echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                         ✅ Services Running                                   ║"
echo "╠══════════════════════════════════════════════════════════════════════════════╣"
echo "║                                                                              ║"
echo "║  📦 Council Service (FastAPI)                                               ║"
echo "║     URL:     http://localhost:8000                                          ║"
echo "║     Docs:    http://localhost:8000/docs                                     ║"
echo "║     Health:  http://localhost:8000/health                                   ║"
echo "║                                                                              ║"
echo "║  💻 Web Frontend (React + Vite)                                             ║"
echo "║     URL:     http://localhost:5173                                          ║"
echo "║                                                                              ║"
echo "╠══════════════════════════════════════════════════════════════════════════════╣"
echo "║  🌐 Open in your browser: http://localhost:5173                             ║"
echo "║  📡 API Test: curl http://localhost:8000/health                             ║"
echo "║  📝 Logs: tail ~/council.log | tail ~/web.log                               ║"
echo "║  ⏹️  Stop: killall python node                                               ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Keep script running to manage processes
trap "kill $COUNCIL_PID $FRONTEND_PID 2>/dev/null; echo 'Services stopped.'" EXIT
wait
