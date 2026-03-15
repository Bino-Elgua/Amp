#!/bin/bash

# AICouncil + Command Center Integration Verification Script
# This script validates that all components are properly integrated

echo "========================================="
echo "AICouncil Integration Verification"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check file existence
check_file() {
  local file=$1
  local name=$2
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $name"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} $name (missing: $file)"
    ((CHECKS_FAILED++))
  fi
}

# Function to check directory existence
check_dir() {
  local dir=$1
  local name=$2
  if [ -d "$dir" ]; then
    echo -e "${GREEN}✓${NC} $name"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} $name (missing: $dir)"
    ((CHECKS_FAILED++))
  fi
}

echo "1. Backend Components"
echo "   ==================="
check_file "services/command-center/main.py" "Commander API (main.py)"
check_file "services/command-center/models.py" "Data Models"
check_file "services/command-center/Dockerfile" "Commander Dockerfile"
check_dir "services/command-center/handlers" "Handler Modules"
echo ""

echo "2. Frontend Components"
echo "   ==================="
check_file "apps/web/src/pages/CommandCenter.tsx" "Command Center Page"
check_dir "apps/web/src/components/CommandCenter" "Dashboard Components"
echo ""

echo "3. Infrastructure"
echo "   =============="
check_file "deploy/docker/docker-compose.dev.yml" "Dev Docker Compose"
check_file "deploy/docker/docker-compose.test.yml" "Test Docker Compose"
check_file "deploy/docker/docker-compose.yml" "Prod Docker Compose"
check_dir "deploy/docker/litellm" "LiteLLM Config"
echo ""

echo "4. Documentation"
echo "   ============="
check_file "INTEGRATION_COMPLETE.md" "Integration Summary"
check_file "DEPLOYMENT_GUIDE.md" "Deployment Guide"
check_file "PROJECT_STATUS.md" "Project Status"
check_file "docs/COMMAND_CENTER_IMPLEMENTATION.md" "Implementation Details"
echo ""

echo "5. Configuration"
echo "   =============="
check_file ".env.example" "Environment Template"
check_file "Makefile" "Build Commands"
check_file "package.json" "Node Dependencies"
check_file "pyproject.toml" "Python Dependencies"
echo ""

echo "6. Core Services"
echo "   ============="
check_dir "services/council" "Council API"
check_dir "services/command-center" "Command Center API"
check_dir "apps/web" "Web Frontend"
check_dir "middleware" "Middleware"
echo ""

echo "========================================="
echo "Verification Summary"
echo "========================================="
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}Failed: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ Integration verification passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Copy .env.example to .env"
  echo "2. Run: docker-compose -f deploy/docker/docker-compose.dev.yml up"
  echo "3. Access: http://localhost:8080/command-center"
  echo "4. API Docs: http://localhost:8001/api/commander/docs"
  exit 0
else
  echo -e "${RED}✗ Integration verification failed!${NC}"
  echo "Check missing files listed above."
  exit 1
fi
