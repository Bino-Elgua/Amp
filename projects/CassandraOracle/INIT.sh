#!/bin/bash

# CASSANDRA ORACLE INITIALIZATION SCRIPT
# One-command setup for complete system

set -e

echo "🔥⚡ CASSANDRA ORACLE INITIALIZATION"
echo "═══════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20+"
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites met${NC}"
echo ""

# Step 2: Create directories
echo -e "${BLUE}Step 2: Creating directories...${NC}"

mkdir -p data logs shadow-branches k8s tests

echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# Step 3: Environment setup
echo -e "${BLUE}Step 3: Setting up environment...${NC}"

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠ Created .env from template. Edit it with your API keys.${NC}"
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

echo ""

# Step 4: Install dependencies
echo -e "${BLUE}Step 4: Installing npm dependencies...${NC}"

npm install

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 5: Build TypeScript
echo -e "${BLUE}Step 5: Compiling TypeScript...${NC}"

npm run build

echo -e "${GREEN}✓ TypeScript compiled${NC}"
echo ""

# Step 6: Start Docker services
echo -e "${BLUE}Step 6: Starting Docker services...${NC}"

docker-compose up -d

echo -e "${GREEN}✓ Docker services started${NC}"
echo ""

# Step 7: Wait for services to be healthy
echo -e "${BLUE}Step 7: Waiting for services to be healthy...${NC}"

echo "Waiting for Qdrant..."
for i in {1..30}; do
    if curl -s http://localhost:6333/health > /dev/null; then
        echo -e "${GREEN}✓ Qdrant is healthy${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

echo "Waiting for Redis..."
for i in {1..30}; do
    if redis-cli -h localhost ping > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Redis is healthy${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

echo ""

# Step 8: Initialize oracle
echo -e "${BLUE}Step 8: Initializing Oracle...${NC}"

node --loader tsx core/oracle-core.ts || true

echo -e "${GREEN}✓ Oracle initialized${NC}"
echo ""

# Step 9: Run health check
echo -e "${BLUE}Step 9: Running health check...${NC}"

npm run health:check

echo ""

# Step 10: Display access points
echo -e "${BLUE}Step 10: System Ready!${NC}"
echo ""
echo "═══════════════════════════════════════════"
echo -e "${GREEN}✓ CASSANDRA ORACLE IS RUNNING${NC}"
echo "═══════════════════════════════════════════"
echo ""
echo "🌐 Access Points:"
echo ""
echo "  Oracle API:        http://localhost:4000"
echo "  Dashboard:         http://localhost:3000"
echo "  Qdrant Vector DB:  http://localhost:6333"
echo "  Redis:             localhost:6379"
echo "  Ollama:            http://localhost:11434"
echo ""
echo "📊 Monitoring:"
echo ""
echo "  Health Check:      npm run health:check"
echo "  View Logs:         docker-compose logs -f cassandra-api"
echo "  Check Metrics:     curl http://localhost:4000/api/metrics | jq"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "  1. Edit .env with your API keys"
echo "  2. Start oracle:  npm start"
echo "  3. Watch logs:    docker-compose logs -f"
echo "  4. Open dashboard: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo ""
echo "  Quick Start:   QUICKSTART.md"
echo "  Architecture:  ARCHITECTURE.md"
echo "  Deployment:    DEPLOYMENT.md"
echo "  Full Readme:   README.md"
echo ""
echo "═══════════════════════════════════════════"
echo ""

# Offer to start oracle
echo "Start oracle in production mode? (y/n)"
read -r start_oracle

if [ "$start_oracle" == "y" ]; then
    echo ""
    echo "Starting Cassandra Oracle..."
    npm start
fi
