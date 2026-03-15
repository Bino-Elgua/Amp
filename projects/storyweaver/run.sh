#!/bin/bash

# StoryWeaver — One-Command Startup & Management

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Function to check if a command exists
command_exists() { command -v "$1" &> /dev/null; }

# Initialize project
init() {
    log_info "Initializing StoryWeaver..."
    
    # Check Node.js
    if ! command_exists node; then
        log_warn "Node.js not found. Installing..."
        apt-get update && apt-get install -y nodejs npm || log_error "Node.js installation failed"
    fi
    
    # Check Python
    if ! command_exists python3; then
        log_warn "Python3 not found. Installing..."
        apt-get install -y python3 python3-pip || log_error "Python installation failed"
    fi
    
    # Check Pandoc
    if ! command_exists pandoc; then
        log_warn "Pandoc not found. Installing..."
        apt-get install -y pandoc || log_error "Pandoc installation failed"
    fi
    
    # Check Ollama
    if ! command_exists ollama; then
        log_warn "Ollama not found. Installing..."
        curl -sSfL https://ollama.ai/install.sh | sh || log_error "Ollama installation failed"
    fi
    
    # Create directories
    log_info "Creating project directories..."
    mkdir -p backend frontend ollama-config books/{current,generated} logs
    
    # Install Node dependencies
    if [ ! -d "node_modules" ]; then
        log_info "Installing Node dependencies..."
        npm install
    fi
    
    # Install Python dependencies
    if [ ! -f "venv/bin/activate" ]; then
        log_info "Creating Python virtual environment..."
        python3 -m venv venv
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt || log_warn "Some Python packages may have failed"
    fi
    
    # Copy .env if not exists
    if [ ! -f ".env" ]; then
        log_info "Creating .env from template..."
        cp .env.example .env
        log_warn "Please edit .env with your settings"
    fi
    
    log_success "Initialization complete!"
}

# Start all services
start() {
    log_info "Starting StoryWeaver services..."
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        log_error ".env file not found. Run: bash run.sh init"
        exit 1
    fi
    
    # Load environment
    source .env
    
    # Start Ollama in background
    if ! pgrep -x "ollama" > /dev/null; then
        log_info "Starting Ollama server..."
        nohup ollama serve > logs/ollama.log 2>&1 &
        sleep 3
        log_success "Ollama started (PID: $!)"
    else
        log_info "Ollama already running"
    fi
    
    # Pull default model if not exists
    log_info "Checking Ollama models..."
    ollama pull llama3.2 || log_warn "Could not pull llama3.2"
    
    # Start Flask backend
    log_info "Starting Flask backend..."
    cd backend
    nohup python3 app.py > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    sleep 2
    log_success "Backend started (PID: $BACKEND_PID)"
    
    # Start frontend dev server or build
    log_info "Starting frontend..."
    npm run dev > logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    sleep 3
    log_success "Frontend started (PID: $FRONTEND_PID)"
    
    # Save PIDs
    echo $BACKEND_PID > .backend.pid
    echo $FRONTEND_PID > .frontend.pid
    
    log_success "All services started!"
    log_info "Open http://localhost:${WEBUI_PORT:-8080} in your browser"
    log_info "API: http://localhost:5000"
    log_info "Press Ctrl+C to stop"
    
    # Keep script running
    wait
}

# Stop all services
stop() {
    log_info "Stopping StoryWeaver services..."
    
    # Kill backend
    if [ -f ".backend.pid" ]; then
        kill $(cat .backend.pid) 2>/dev/null || true
        rm .backend.pid
        log_success "Backend stopped"
    fi
    
    # Kill frontend
    if [ -f ".frontend.pid" ]; then
        kill $(cat .frontend.pid) 2>/dev/null || true
        rm .frontend.pid
        log_success "Frontend stopped"
    fi
    
    # Optional: kill Ollama
    pkill -f "ollama serve" || true
    
    log_success "All services stopped"
}

# Git commit
commit() {
    if [ -z "$1" ]; then
        log_error "Usage: bash run.sh commit 'Your message'"
        exit 1
    fi
    
    log_info "Staging changes..."
    git add -A
    
    log_info "Committing: $1"
    git commit -m "$1" || log_warn "Nothing to commit"
    
    log_success "Committed!"
}

# Git push
push() {
    log_info "Pushing to remote..."
    git push origin master || git push origin main || log_warn "Could not push (no remote?)"
    log_success "Pushed!"
}

# Status
status() {
    log_info "StoryWeaver Status"
    echo "---"
    
    if pgrep -x "ollama" > /dev/null; then
        log_success "Ollama: RUNNING"
    else
        log_warn "Ollama: STOPPED"
    fi
    
    if [ -f ".backend.pid" ] && kill -0 $(cat .backend.pid) 2>/dev/null; then
        log_success "Backend: RUNNING"
    else
        log_warn "Backend: STOPPED"
    fi
    
    if [ -f ".frontend.pid" ] && kill -0 $(cat .frontend.pid) 2>/dev/null; then
        log_success "Frontend: RUNNING"
    else
        log_warn "Frontend: STOPPED"
    fi
    
    echo "---"
    log_info "Logs:"
    echo "  Ollama:   tail -f logs/ollama.log"
    echo "  Backend:  tail -f logs/backend.log"
    echo "  Frontend: tail -f logs/frontend.log"
}

# Help
help() {
    cat << EOF
StoryWeaver — AI Story-to-Book Generator

Usage: bash run.sh [COMMAND]

Commands:
  init                  Initialize project (install deps, create dirs)
  start                 Start all services (Ollama, Backend, Frontend)
  stop                  Stop all services
  status                Show service status
  commit [MESSAGE]      Stage all & commit to git
  push                  Push to remote
  help                  Show this help

Examples:
  bash run.sh init
  bash run.sh start
  bash run.sh commit "Added book generation feature"
  bash run.sh stop
  bash run.sh status

EOF
}

# Main
case "${1:-help}" in
    init) init ;;
    start) start ;;
    stop) stop ;;
    status) status ;;
    commit) commit "$2" ;;
    push) push ;;
    help) help ;;
    *)
        log_error "Unknown command: $1"
        help
        exit 1
        ;;
esac
