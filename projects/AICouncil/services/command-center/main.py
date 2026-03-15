"""
AICouncil Command Center - Administrative API Server
Provides 100+ endpoints for council operations, RAG management, agents, users, analytics, audit logging
"""

from fastapi import FastAPI, Depends, HTTPException, WebSocket, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv

try:
    from .handlers import council, rag, agents, users, analytics, audit, system
    from .models import (
        DeliberationRequest, SessionResponse, AgentConfig, DocumentUpload,
        WorkflowDefinition, UserCreate, TenantCreate, AnalyticsQuery
    )
except ImportError:
    from handlers import council, rag, agents, users, analytics, audit, system
    from models import (
        DeliberationRequest, SessionResponse, AgentConfig, DocumentUpload,
        WorkflowDefinition, UserCreate, TenantCreate, AnalyticsQuery
    )

load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="AICouncil Command Center",
    description="Enterprise administrative control for AICouncil consensus engine",
    version="2.0.0",
    docs_url="/api/commander/docs",
    openapi_url="/api/commander/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# HEALTH & STATUS
# ============================================================================

@app.get("/api/commander/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }

@app.get("/api/commander/status")
async def status():
    """Comprehensive system status"""
    return {
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "council": "active",
            "rag": "active",
            "agents": "active",
            "analytics": "active",
            "audit": "active",
            "users": "active",
            "workflows": "active"
        },
        "uptime_seconds": 0,
        "api_version": "2.0.0"
    }

# ============================================================================
# 1. COUNCIL OPERATIONS
# ============================================================================

# Deliberation Control
@app.post("/api/commander/council/deliberate")
async def trigger_deliberation(request: DeliberationRequest):
    """Trigger a new council deliberation"""
    return await council.trigger_deliberation(request)

@app.get("/api/commander/council/session/{session_id}")
async def get_session(session_id: str):
    """Get session details"""
    return await council.get_session(session_id)

@app.get("/api/commander/council/sessions")
async def list_sessions(
    status: Optional[str] = Query(None),
    limit: int = Query(50),
    offset: int = Query(0)
):
    """List council sessions"""
    return await council.list_sessions(status=status, limit=limit, offset=offset)

@app.patch("/api/commander/council/session/{session_id}/pause")
async def pause_session(session_id: str):
    """Pause an active deliberation"""
    return await council.pause_session(session_id)

@app.patch("/api/commander/council/session/{session_id}/resume")
async def resume_session(session_id: str):
    """Resume a paused deliberation"""
    return await council.resume_session(session_id)

@app.delete("/api/commander/council/session/{session_id}")
async def cancel_session(session_id: str):
    """Cancel a session"""
    return await council.cancel_session(session_id)

@app.get("/api/commander/council/session/{session_id}/transcript")
async def get_transcript(session_id: str):
    """Get full deliberation transcript"""
    return await council.get_transcript(session_id)

@app.post("/api/commander/council/session/{session_id}/interrupt")
async def interrupt_session(session_id: str):
    """Force halt a deliberation"""
    return await council.interrupt_session(session_id)

# Agent Management
@app.get("/api/commander/council/agents")
async def list_agents():
    """List all council agents"""
    return await council.list_agents()

@app.post("/api/commander/council/agents")
async def register_agent(config: AgentConfig):
    """Register a custom agent"""
    return await council.register_agent(config)

@app.get("/api/commander/council/agents/{agent_id}")
async def get_agent(agent_id: str):
    """Get agent details"""
    return await council.get_agent(agent_id)

@app.patch("/api/commander/council/agents/{agent_id}")
async def update_agent(agent_id: str, config: AgentConfig):
    """Update agent configuration"""
    return await council.update_agent(agent_id, config)

@app.delete("/api/commander/council/agents/{agent_id}")
async def delete_agent(agent_id: str):
    """Remove an agent"""
    return await council.delete_agent(agent_id)

@app.post("/api/commander/council/agents/{agent_id}/test")
async def test_agent(agent_id: str, test_prompt: str = Query(...)):
    """Test an agent with a prompt"""
    return await council.test_agent(agent_id, test_prompt)

@app.get("/api/commander/council/agents/{agent_id}/performance")
async def get_agent_performance(agent_id: str):
    """Get agent performance metrics"""
    return await council.get_agent_performance(agent_id)

@app.post("/api/commander/council/agents/{agent_id}/enable")
async def enable_agent(agent_id: str):
    """Enable an agent"""
    return await council.enable_agent(agent_id)

@app.post("/api/commander/council/agents/{agent_id}/disable")
async def disable_agent(agent_id: str):
    """Disable an agent"""
    return await council.disable_agent(agent_id)

@app.get("/api/commander/council/agents/{agent_id}/history")
async def get_agent_history(agent_id: str, limit: int = Query(100)):
    """Get agent decision history"""
    return await council.get_agent_history(agent_id, limit)

# Voting & Consensus
@app.post("/api/commander/council/consensus/recompute")
async def recompute_consensus(session_id: str = Query(...)):
    """Recompute consensus scores"""
    return await council.recompute_consensus(session_id)

@app.get("/api/commander/council/consensus/metrics")
async def get_consensus_metrics(session_id: Optional[str] = Query(None)):
    """Get current consensus metrics"""
    return await council.get_consensus_metrics(session_id)

@app.patch("/api/commander/council/consensus/threshold")
async def set_consensus_threshold(threshold: float = Query(...)):
    """Adjust consensus threshold"""
    return await council.set_consensus_threshold(threshold)

@app.post("/api/commander/council/votes/override")
async def override_vote(session_id: str = Query(...), agent_id: str = Query(...), new_vote: str = Query(...)):
    """Admin override a vote"""
    return await council.override_vote(session_id, agent_id, new_vote)

@app.get("/api/commander/council/disagreements")
async def list_disagreements(threshold: float = Query(30)):
    """List high-disagreement sessions"""
    return await council.list_disagreements(threshold)

# ============================================================================
# 2. RAG MANAGEMENT
# ============================================================================

# Document Management
@app.post("/api/commander/rag/documents")
async def upload_document(document: DocumentUpload):
    """Upload a document for RAG"""
    return await rag.upload_document(document)

@app.get("/api/commander/rag/documents")
async def list_documents(indexed: Optional[bool] = Query(None), limit: int = Query(50)):
    """List documents"""
    return await rag.list_documents(indexed=indexed, limit=limit)

@app.get("/api/commander/rag/documents/{doc_id}")
async def get_document(doc_id: str):
    """Get document metadata"""
    return await rag.get_document(doc_id)

@app.patch("/api/commander/rag/documents/{doc_id}")
async def update_document(doc_id: str, metadata: Dict[str, Any]):
    """Update document metadata"""
    return await rag.update_document(doc_id, metadata)

@app.delete("/api/commander/rag/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Delete a document"""
    return await rag.delete_document(doc_id)

@app.post("/api/commander/rag/documents/{doc_id}/index")
async def reindex_document(doc_id: str):
    """Re-index a document"""
    return await rag.reindex_document(doc_id)

@app.get("/api/commander/rag/documents/{doc_id}/chunks")
async def get_document_chunks(doc_id: str):
    """Get document chunks"""
    return await rag.get_document_chunks(doc_id)

@app.post("/api/commander/rag/documents/batch")
async def batch_upload(documents: List[DocumentUpload]):
    """Batch upload documents"""
    return await rag.batch_upload(documents)

# Vector Database
@app.post("/api/commander/rag/collections")
async def create_collection(name: str = Query(...), description: Optional[str] = Query(None)):
    """Create a vector collection"""
    return await rag.create_collection(name, description)

@app.get("/api/commander/rag/collections")
async def list_collections():
    """List vector collections"""
    return await rag.list_collections()

@app.delete("/api/commander/rag/collections/{collection_id}")
async def delete_collection(collection_id: str):
    """Delete a collection"""
    return await rag.delete_collection(collection_id)

@app.post("/api/commander/rag/collections/{collection_id}/sync")
async def sync_collection(collection_id: str):
    """Sync collection to vector DB"""
    return await rag.sync_collection(collection_id)

@app.get("/api/commander/rag/collections/{collection_id}/stats")
async def get_collection_stats(collection_id: str):
    """Get collection statistics"""
    return await rag.get_collection_stats(collection_id)

@app.post("/api/commander/rag/search")
async def semantic_search(collection_id: str = Query(...), query: str = Query(...), limit: int = Query(10)):
    """Semantic search in collections"""
    return await rag.semantic_search(collection_id, query, limit)

@app.post("/api/commander/rag/search/hybrid")
async def hybrid_search(collection_id: str = Query(...), query: str = Query(...), limit: int = Query(10)):
    """Hybrid keyword + semantic search"""
    return await rag.hybrid_search(collection_id, query, limit)

@app.get("/api/commander/rag/vector-db/health")
async def vector_db_health():
    """Check vector DB health"""
    return await rag.vector_db_health()

# RAG Pipelines
@app.post("/api/commander/rag/pipelines")
async def create_pipeline(pipeline: WorkflowDefinition):
    """Create a RAG pipeline"""
    return await rag.create_pipeline(pipeline)

@app.get("/api/commander/rag/pipelines")
async def list_pipelines():
    """List RAG pipelines"""
    return await rag.list_pipelines()

@app.patch("/api/commander/rag/pipelines/{pipeline_id}")
async def update_pipeline(pipeline_id: str, pipeline: WorkflowDefinition):
    """Update a pipeline"""
    return await rag.update_pipeline(pipeline_id, pipeline)

@app.delete("/api/commander/rag/pipelines/{pipeline_id}")
async def delete_pipeline(pipeline_id: str):
    """Delete a pipeline"""
    return await rag.delete_pipeline(pipeline_id)

@app.post("/api/commander/rag/pipelines/{pipeline_id}/execute")
async def execute_pipeline(pipeline_id: str):
    """Execute a pipeline"""
    return await rag.execute_pipeline(pipeline_id)

@app.get("/api/commander/rag/pipelines/{pipeline_id}/logs")
async def get_pipeline_logs(pipeline_id: str):
    """Get pipeline execution logs"""
    return await rag.get_pipeline_logs(pipeline_id)

# ============================================================================
# 3. AGENT MARKETPLACE
# ============================================================================

@app.post("/api/commander/marketplace/agents")
async def create_agent(agent: AgentConfig):
    """Create custom agent"""
    return await agents.create_agent(agent)

@app.get("/api/commander/marketplace/agents")
async def list_marketplace_agents(category: Optional[str] = Query(None)):
    """List marketplace agents"""
    return await agents.list_agents(category)

@app.get("/api/commander/marketplace/agents/{agent_id}")
async def get_marketplace_agent(agent_id: str):
    """Get agent definition"""
    return await agents.get_agent(agent_id)

@app.patch("/api/commander/marketplace/agents/{agent_id}")
async def update_marketplace_agent(agent_id: str, agent: AgentConfig):
    """Update agent"""
    return await agents.update_agent(agent_id, agent)

@app.delete("/api/commander/marketplace/agents/{agent_id}")
async def delete_marketplace_agent(agent_id: str):
    """Delete agent"""
    return await agents.delete_agent(agent_id)

@app.post("/api/commander/marketplace/agents/{agent_id}/clone")
async def clone_agent(agent_id: str, new_name: str = Query(...)):
    """Clone agent template"""
    return await agents.clone_agent(agent_id, new_name)

@app.post("/api/commander/marketplace/agents/{agent_id}/publish")
async def publish_agent(agent_id: str):
    """Publish agent to marketplace"""
    return await agents.publish_agent(agent_id)

# Workflows
@app.post("/api/commander/marketplace/workflows")
async def create_workflow(workflow: WorkflowDefinition):
    """Create workflow"""
    return await agents.create_workflow(workflow)

@app.get("/api/commander/marketplace/workflows")
async def list_workflows():
    """List workflows"""
    return await agents.list_workflows()

@app.patch("/api/commander/marketplace/workflows/{workflow_id}")
async def update_workflow(workflow_id: str, workflow: WorkflowDefinition):
    """Update workflow"""
    return await agents.update_workflow(workflow_id, workflow)

@app.delete("/api/commander/marketplace/workflows/{workflow_id}")
async def delete_workflow(workflow_id: str):
    """Delete workflow"""
    return await agents.delete_workflow(workflow_id)

@app.post("/api/commander/marketplace/workflows/{workflow_id}/execute")
async def execute_workflow(workflow_id: str, inputs: Dict[str, Any]):
    """Execute workflow"""
    return await agents.execute_workflow(workflow_id, inputs)

@app.get("/api/commander/marketplace/workflows/{workflow_id}/executions")
async def get_workflow_executions(workflow_id: str):
    """Get workflow execution history"""
    return await agents.get_workflow_executions(workflow_id)

# Batch Jobs
@app.post("/api/commander/marketplace/batch-jobs")
async def create_batch_job(job_def: Dict[str, Any]):
    """Create batch job"""
    return await agents.create_batch_job(job_def)

@app.get("/api/commander/marketplace/batch-jobs")
async def list_batch_jobs():
    """List batch jobs"""
    return await agents.list_batch_jobs()

@app.get("/api/commander/marketplace/batch-jobs/{job_id}")
async def get_batch_job(job_id: str):
    """Get job details"""
    return await agents.get_batch_job(job_id)

@app.post("/api/commander/marketplace/batch-jobs/{job_id}/start")
async def start_batch_job(job_id: str):
    """Start batch job"""
    return await agents.start_batch_job(job_id)

@app.post("/api/commander/marketplace/batch-jobs/{job_id}/cancel")
async def cancel_batch_job(job_id: str):
    """Cancel batch job"""
    return await agents.cancel_batch_job(job_id)

@app.get("/api/commander/marketplace/batch-jobs/{job_id}/progress")
async def get_batch_progress(job_id: str):
    """Get job progress"""
    return await agents.get_batch_progress(job_id)

@app.get("/api/commander/marketplace/batch-jobs/{job_id}/results")
async def get_batch_results(job_id: str):
    """Get job results"""
    return await agents.get_batch_results(job_id)

# ============================================================================
# 4. USER & TENANT MANAGEMENT
# ============================================================================

@app.get("/api/commander/users")
async def list_users(limit: int = Query(50)):
    """List users"""
    return await users.list_users(limit)

@app.get("/api/commander/users/{user_id}")
async def get_user(user_id: str):
    """Get user details"""
    return await users.get_user(user_id)

@app.post("/api/commander/users")
async def create_user(user: UserCreate):
    """Create user"""
    return await users.create_user(user)

@app.patch("/api/commander/users/{user_id}")
async def update_user(user_id: str, updates: Dict[str, Any]):
    """Update user"""
    return await users.update_user(user_id, updates)

@app.delete("/api/commander/users/{user_id}")
async def delete_user(user_id: str):
    """Delete user"""
    return await users.delete_user(user_id)

@app.post("/api/commander/users/{user_id}/reset-password")
async def reset_password(user_id: str):
    """Reset user password"""
    return await users.reset_password(user_id)

@app.post("/api/commander/users/{user_id}/revoke-keys")
async def revoke_api_keys(user_id: str):
    """Revoke API keys"""
    return await users.revoke_api_keys(user_id)

@app.patch("/api/commander/users/{user_id}/role")
async def update_user_role(user_id: str, role: str = Query(...)):
    """Update user role"""
    return await users.update_user_role(user_id, role)

@app.get("/api/commander/users/{user_id}/sessions")
async def get_user_sessions(user_id: str):
    """Get user sessions"""
    return await users.get_user_sessions(user_id)

@app.post("/api/commander/users/{user_id}/logout-all")
async def logout_all_sessions(user_id: str):
    """Logout all sessions"""
    return await users.logout_all_sessions(user_id)

# Tenants
@app.get("/api/commander/tenants")
async def list_tenants():
    """List tenants"""
    return await users.list_tenants()

@app.post("/api/commander/tenants")
async def create_tenant(tenant: TenantCreate):
    """Create tenant"""
    return await users.create_tenant(tenant)

@app.get("/api/commander/tenants/{tenant_id}")
async def get_tenant(tenant_id: str):
    """Get tenant details"""
    return await users.get_tenant(tenant_id)

@app.patch("/api/commander/tenants/{tenant_id}")
async def update_tenant(tenant_id: str, updates: Dict[str, Any]):
    """Update tenant"""
    return await users.update_tenant(tenant_id, updates)

@app.delete("/api/commander/tenants/{tenant_id}")
async def delete_tenant(tenant_id: str):
    """Delete tenant"""
    return await users.delete_tenant(tenant_id)

@app.patch("/api/commander/tenants/{tenant_id}/data-residency")
async def set_data_residency(tenant_id: str, location: str = Query(...)):
    """Set data residency"""
    return await users.set_data_residency(tenant_id, location)

@app.get("/api/commander/tenants/{tenant_id}/usage")
async def get_tenant_usage(tenant_id: str):
    """Get tenant usage metrics"""
    return await users.get_tenant_usage(tenant_id)

# ============================================================================
# 5. ANALYTICS & REPORTING
# ============================================================================

@app.get("/api/commander/analytics/consensus/trends")
async def get_consensus_trends(days: int = Query(30)):
    """Get consensus trends"""
    return await analytics.get_consensus_trends(days)

@app.get("/api/commander/analytics/consensus/by-topic")
async def get_consensus_by_topic():
    """Get consensus by topic"""
    return await analytics.get_consensus_by_topic()

@app.get("/api/commander/analytics/consensus/distribution")
async def get_consensus_distribution():
    """Get score distribution"""
    return await analytics.get_consensus_distribution()

@app.get("/api/commander/analytics/agents/ranking")
async def get_agent_ranking():
    """Get agent performance ranking"""
    return await analytics.get_agent_ranking()

@app.get("/api/commander/analytics/agents/{agent_id}/performance")
async def get_agent_performance_metrics(agent_id: str):
    """Get specific agent performance"""
    return await analytics.get_agent_performance(agent_id)

@app.get("/api/commander/analytics/agents/agreement-matrix")
async def get_agent_agreement():
    """Get agent agreement patterns"""
    return await analytics.get_agent_agreement()

@app.get("/api/commander/analytics/costs/summary")
async def get_cost_summary():
    """Get cost overview"""
    return await analytics.get_cost_summary()

@app.get("/api/commander/analytics/costs/by-model")
async def get_costs_by_model():
    """Get costs by model"""
    return await analytics.get_costs_by_model()

@app.get("/api/commander/analytics/costs/by-user")
async def get_costs_by_user():
    """Get costs by user"""
    return await analytics.get_costs_by_user()

@app.get("/api/commander/analytics/usage/overview")
async def get_usage_overview():
    """Get usage summary"""
    return await analytics.get_usage_overview()

@app.get("/api/commander/analytics/usage/by-user")
async def get_usage_by_user():
    """Get usage by user"""
    return await analytics.get_usage_by_user()

@app.get("/api/commander/analytics/usage/by-feature")
async def get_usage_by_feature():
    """Get usage by feature"""
    return await analytics.get_usage_by_feature()

@app.post("/api/commander/analytics/reports/generate")
async def generate_report(report_type: str = Query(...), date_range: str = Query("30d")):
    """Generate report"""
    return await analytics.generate_report(report_type, date_range)

@app.get("/api/commander/analytics/reports")
async def list_reports():
    """List reports"""
    return await analytics.list_reports()

@app.get("/api/commander/analytics/reports/{report_id}")
async def get_report(report_id: str):
    """Get report"""
    return await analytics.get_report(report_id)

# ============================================================================
# 6. AUDIT LOGGING
# ============================================================================

@app.get("/api/commander/audit/logs")
async def list_audit_logs(
    actor: Optional[str] = Query(None),
    action: Optional[str] = Query(None),
    limit: int = Query(100)
):
    """List audit logs"""
    return await audit.list_logs(actor=actor, action=action, limit=limit)

@app.get("/api/commander/audit/logs/{log_id}")
async def get_audit_log(log_id: str):
    """Get specific log"""
    return await audit.get_log(log_id)

@app.post("/api/commander/audit/logs/search")
async def search_audit_logs(query: str = Query(...)):
    """Search audit logs"""
    return await audit.search_logs(query)

@app.post("/api/commander/audit/logs/export")
async def export_audit_logs(format: str = Query("json")):
    """Export audit logs"""
    return await audit.export_logs(format)

@app.post("/api/commander/audit/compliance/check")
async def run_compliance_check():
    """Run compliance check"""
    return await audit.run_compliance_check()

@app.get("/api/commander/audit/compliance/status")
async def get_compliance_status():
    """Get compliance status"""
    return await audit.get_compliance_status()

@app.post("/api/commander/audit/data-deletion")
async def request_data_deletion(user_id: str = Query(...)):
    """Request data deletion"""
    return await audit.request_data_deletion(user_id)

@app.get("/api/commander/audit/data-deletion/{request_id}")
async def check_deletion_status(request_id: str):
    """Check deletion status"""
    return await audit.check_deletion_status(request_id)

@app.post("/api/commander/audit/gdpr/export")
async def export_gdpr_data(user_id: str = Query(...)):
    """Export user data for GDPR"""
    return await audit.export_gdpr_data(user_id)

# ============================================================================
# 7. SYSTEM ADMINISTRATION
# ============================================================================

@app.get("/api/commander/system/config")
async def get_system_config():
    """Get system config"""
    return await system.get_config()

@app.patch("/api/commander/system/config")
async def update_system_config(config: Dict[str, Any]):
    """Update system config"""
    return await system.update_config(config)

@app.get("/api/commander/system/health")
async def get_system_health():
    """Get system health"""
    return await system.get_health()

@app.get("/api/commander/system/services")
async def get_service_status():
    """Get service status"""
    return await system.get_service_status()

@app.get("/api/commander/system/resources")
async def get_resource_usage():
    """Get resource usage"""
    return await system.get_resource_usage()

@app.get("/api/commander/system/databases")
async def get_database_status():
    """Get database status"""
    return await system.get_database_status()

@app.get("/api/commander/system/alerts")
async def get_system_alerts():
    """Get active alerts"""
    return await system.get_alerts()

@app.post("/api/commander/system/backup")
async def trigger_backup():
    """Trigger backup"""
    return await system.trigger_backup()

@app.get("/api/commander/system/backups")
async def list_backups():
    """List backups"""
    return await system.list_backups()

@app.post("/api/commander/system/restore")
async def restore_backup(backup_id: str = Query(...)):
    """Restore from backup"""
    return await system.restore_backup(backup_id)

@app.post("/api/commander/system/migrate")
async def run_migrations():
    """Run database migrations"""
    return await system.run_migrations()

@app.get("/api/commander/system/logs")
async def get_system_logs(lines: int = Query(100)):
    """Get system logs"""
    return await system.get_logs(lines)

# ============================================================================
# WEBSOCKET CONNECTIONS
# ============================================================================

@app.websocket("/ws/commander/council/session/{session_id}")
async def ws_council_session(websocket: WebSocket, session_id: str):
    """Real-time council session updates"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast session updates
            await websocket.send_json({
                "session_id": session_id,
                "timestamp": datetime.now().isoformat(),
                "data": data
            })
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@app.websocket("/ws/commander/rag/indexing/{collection_id}")
async def ws_rag_indexing(websocket: WebSocket, collection_id: str):
    """Real-time RAG indexing progress"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({
                "collection_id": collection_id,
                "timestamp": datetime.now().isoformat(),
                "progress": data
            })
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@app.websocket("/ws/commander/workflow/{workflow_id}")
async def ws_workflow_status(websocket: WebSocket, workflow_id: str):
    """Real-time workflow execution status"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({
                "workflow_id": workflow_id,
                "timestamp": datetime.now().isoformat(),
                "status": data
            })
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@app.websocket("/ws/commander/system/metrics")
async def ws_system_metrics(websocket: WebSocket):
    """Real-time system metrics stream"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({
                "timestamp": datetime.now().isoformat(),
                "metrics": data
            })
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@app.websocket("/ws/commander/audit/live")
async def ws_audit_live(websocket: WebSocket):
    """Live audit event stream"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({
                "timestamp": datetime.now().isoformat(),
                "event": data
            })
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("COMMANDER_PORT", 8001))
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
