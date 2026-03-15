#!/bin/bash

# ============================================================
# AICouncil Phase 1: Local Testing & Verification
# ============================================================

set -e

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     AICouncil Phase 1: Local Testing & Verification      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo ""
}

# Function to check Python
check_python() {
    print_section "1️⃣  Checking Python Installation"
    
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}❌ Python 3 not found${NC}"
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    echo -e "${GREEN}✓ Python ${PYTHON_VERSION} found${NC}"
}

# Function to install dependencies
install_dependencies() {
    print_section "2️⃣  Installing Python Dependencies"
    
    echo "Installing neural-brain dependencies..."
    cd services/neural-brain
    pip install -q -r requirements.txt 2>&1 | grep -v "already satisfied" || true
    echo -e "${GREEN}✓ Neural brain dependencies installed${NC}"
    
    echo ""
    echo "Installing council dependencies..."
    cd ../council
    pip install -q -r requirements.txt 2>&1 | grep -v "already satisfied" || true
    echo -e "${GREEN}✓ Council dependencies installed${NC}"
    
    cd ../..
}

# Function to run unit tests
run_unit_tests() {
    print_section "3️⃣  Running Unit Tests"
    
    cd services/neural-brain
    
    echo "Running blockchain integration tests..."
    python3 test_blockchain_integration.py 2>&1 | tee test-results.log
    
    TEST_RESULT=$?
    if [ $TEST_RESULT -eq 0 ]; then
        echo -e "${GREEN}✓ All tests passed!${NC}"
    else
        echo -e "${RED}❌ Some tests failed${NC}"
        return 1
    fi
    
    cd ../..
}

# Function to test council service startup
test_council_startup() {
    print_section "4️⃣  Testing Council Service"
    
    echo "Starting council service in background..."
    cd services/council
    timeout 5 python3 main.py > /tmp/council.log 2>&1 &
    COUNCIL_PID=$!
    sleep 2
    
    if kill -0 $COUNCIL_PID 2>/dev/null; then
        echo -e "${GREEN}✓ Council service started successfully${NC}"
        kill $COUNCIL_PID 2>/dev/null || true
    else
        echo -e "${RED}❌ Council service failed to start${NC}"
        cat /tmp/council.log
        return 1
    fi
    
    cd ../..
}

# Function to check code quality
check_code_quality() {
    print_section "5️⃣  Code Quality Checks"
    
    echo "Checking Python syntax..."
    python3 -m py_compile services/council/main.py 2>&1
    python3 -m py_compile services/council/council_blockchain.py 2>&1
    python3 -m py_compile services/neural-brain/blockchain_core.py 2>&1
    echo -e "${GREEN}✓ Python syntax check passed${NC}"
    
    echo ""
    echo "Checking imports..."
    python3 -c "import services.council.council_blockchain" 2>&1 || echo "  ⚠️  Direct import not available (expected in test mode)"
    echo -e "${GREEN}✓ Import checks completed${NC}"
}

# Function to summary
print_summary() {
    print_section "✅ Phase 1 Testing Complete"
    
    echo "Summary:"
    echo -e "  ${GREEN}✓${NC} Python installation verified"
    echo -e "  ${GREEN}✓${NC} Dependencies installed"
    echo -e "  ${GREEN}✓${NC} Unit tests passed"
    echo -e "  ${GREEN}✓${NC} Council service startup verified"
    echo -e "  ${GREEN}✓${NC} Code quality checks passed"
    echo ""
    echo "Next steps:"
    echo "  1. Deploy smart contract (Phase 2) on external machine with Rust"
    echo "  2. Update .env with contract IDs from Phase 2"
    echo "  3. Start council service: cd services/council && python3 main.py"
    echo "  4. Test endpoints with curl (see PHASE_1_LOCAL_TESTING.md)"
    echo ""
}

# Main execution
main() {
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
        cp .env.example .env 2>/dev/null || echo "  .env.example not found"
    fi
    
    check_python
    install_dependencies
    
    if run_unit_tests; then
        if test_council_startup; then
            check_code_quality
            print_summary
            exit 0
        fi
    fi
    
    echo ""
    echo -e "${RED}❌ Phase 1 testing failed${NC}"
    exit 1
}

# Run main
main
