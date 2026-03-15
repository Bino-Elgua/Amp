"""
AICouncil FastAPI Service
Deliberation engine for consensus-driven decision making
"""

import os
from typing import Optional
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Load environment variables
load_dotenv()

# Import blockchain integration
try:
    from council_blockchain import register_blockchain_routes
    BLOCKCHAIN_AVAILABLE = True
except ImportError:
    BLOCKCHAIN_AVAILABLE = False
    print("⚠️  Blockchain integration not available")

# ============================================
# Configuration
# ============================================

class CouncilConfig:
    """Council service configuration"""
    debug: bool = os.getenv("COUNCIL_DEBUG", "false").lower() == "true"
    deliberation_timeout: int = int(os.getenv("COUNCIL_DELIBERATION_TIMEOUT", "30"))
    min_consensus: float = float(os.getenv("COUNCIL_MIN_CONSENSUS", "0.5"))
    litellm_base_url: str = os.getenv("LITELLM_BASE_URL", "http://localhost:4000/v1")
    litellm_api_key: str = os.getenv("LITELLM_API_KEY", "test-key")
    fallback_model: str = os.getenv("FALLBACK_MODEL", "ollama/llama2")
    venice_api_key: str = os.getenv("VENICE_API_KEY", "")
    venice_api_base: str = os.getenv("VENICE_API_BASE", "https://api.venice.ai/v1")
    port: int = int(os.getenv("COUNCIL_PORT", "8000"))


config = CouncilConfig()

# ============================================
# Data Models
# ============================================

class DeliberationRequest(BaseModel):
    """Request to deliberate on a topic"""
    topic: str = Field(..., description="The topic to deliberate on")
    context: Optional[str] = Field(None, description="Additional context")
    agents: Optional[list[str]] = Field(default=None, description="Specific agents to consult")
    num_agents: int = Field(default=3, ge=1, le=10, description="Number of agents to deliberate")


class AgentVote(BaseModel):
    """A single agent's vote/opinion"""
    agent_id: str
    position: str
    confidence: float = Field(ge=0.0, le=1.0)
    reasoning: str


class DeliberationResponse(BaseModel):
    """Response from council deliberation"""
    topic: str
    consensus_score: float = Field(ge=0.0, le=1.0)
    consensus_reached: bool
    votes: list[AgentVote]
    chairman_summary: str
    recommendation: Optional[str] = None
    disagreement_severity: float = Field(ge=0.0, le=1.0)


class HealthCheck(BaseModel):
    """Health check response"""
    status: str
    service: str = "council"
    debug: bool


# ============================================
# FastAPI App with Lifecycle
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage app startup and shutdown"""
    # Startup
    print(f"🏛️  AICouncil Service starting...")
    print(f"   Debug: {config.debug}")
    print(f"   Deliberation Timeout: {config.deliberation_timeout}s")
    print(f"   Min Consensus: {config.min_consensus}")
    print(f"   LiteLLM Base URL: {config.litellm_base_url}")
    print(f"   Fallback Model: {config.fallback_model}")
    
    # Register blockchain routes if available
    if BLOCKCHAIN_AVAILABLE:
        try:
            await register_blockchain_routes(app)
            print(f"✅ Blockchain integration loaded")
        except Exception as e:
            print(f"⚠️  Blockchain integration failed: {e}")
    else:
        print(f"⚠️  Blockchain integration not available")
    
    yield
    
    # Shutdown
    print("🏛️  AICouncil Service shutting down...")


app = FastAPI(
    title="AICouncil Service",
    description="Deliberation engine for consensus-driven decision making",
    version="0.1.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# Routes
# ============================================

@app.get("/health", response_model=HealthCheck)
async def health():
    """Health check endpoint"""
    return HealthCheck(
        status="healthy",
        debug=config.debug
    )


@app.get("/api/council/status")
async def status():
    """Get council service status"""
    return {
        "status": "ready",
        "service": "council",
        "version": "0.1.0",
        "config": {
            "debug": config.debug,
            "deliberation_timeout": config.deliberation_timeout,
            "min_consensus": config.min_consensus,
            "litellm_base_url": config.litellm_base_url,
            "fallback_model": config.fallback_model,
        }
    }


@app.post("/api/council/deliberate", response_model=DeliberationResponse)
async def deliberate(request: DeliberationRequest):
    """
    Run council deliberation on a topic
    
    Returns consensus score, agent votes, and chairman summary
    """
    
    if not request.topic or len(request.topic.strip()) == 0:
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    
    # TODO: Phase 2 - Implement actual deliberation logic
    # For now, return mock response
    
    return DeliberationResponse(
        topic=request.topic,
        consensus_score=0.75,
        consensus_reached=True,
        votes=[
            AgentVote(
                agent_id="agent_1",
                position="agree",
                confidence=0.85,
                reasoning="The topic is well-reasoned and aligns with best practices."
            ),
            AgentVote(
                agent_id="agent_2",
                position="agree",
                confidence=0.72,
                reasoning="Generally sound, with minor concerns about implementation details."
            ),
            AgentVote(
                agent_id="agent_3",
                position="partial",
                confidence=0.65,
                reasoning="Valid points, but requires further clarification on scope."
            ),
        ],
        chairman_summary="The council reached consensus with 75% agreement. Two agents fully support the position, while one has reservations that can be addressed with clarification.",
        recommendation="Proceed with implementation, addressing the scope clarification points raised.",
        disagreement_severity=0.25
    )


@app.post("/api/council/debate")
async def debate(request: DeliberationRequest):
    """
    Run focused debate mode between agents
    
    Returns back-and-forth exchanges
    """
    
    # TODO: Phase 2 - Implement debate logic
    
    return {
        "status": "debate_started",
        "topic": request.topic,
        "exchanges": []
    }


@app.get("/api/council/agents")
async def list_agents():
    """List available deliberation agents"""
    
    return {
        "agents": [
            {
                "id": "agent_1",
                "name": "Logical Analyzer",
                "description": "Evaluates arguments for logical consistency",
                "expertise": ["logic", "consistency", "structure"]
            },
            {
                "id": "agent_2",
                "name": "Pragmatist",
                "description": "Considers practical implementation and constraints",
                "expertise": ["implementation", "feasibility", "resources"]
            },
            {
                "id": "agent_3",
                "name": "Devil's Advocate",
                "description": "Challenges assumptions and explores edge cases",
                "expertise": ["critique", "edge-cases", "risk-analysis"]
            },
        ]
    }


# ============================================
# Error Handlers
# ============================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    if config.debug:
        raise
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if config.debug else "An error occurred"
        }
    )


# ============================================
# Root Endpoint
# ============================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "AICouncil",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    
    print(f"\n{'='*60}")
    print(f"🏛️  AICouncil Service")
    print(f"{'='*60}")
    print(f"Listening on: http://0.0.0.0:{config.port}")
    print(f"API Docs: http://localhost:{config.port}/docs")
    print(f"Health: http://localhost:{config.port}/health")
    print(f"{'='*60}\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=config.port,
        reload=config.debug,
        access_log=not config.debug
    )
