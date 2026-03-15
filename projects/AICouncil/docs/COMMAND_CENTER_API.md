# Command Center API Reference

**Full documentation of 100+ endpoints for complete council control**

---

## Base URL

```
http://localhost:8001/api/commander
```

## Authentication

All requests require:
```bash
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

---

## 1. COUNCIL OPERATIONS

### Deliberation Control

#### Start Deliberation
```http
POST /council/deliberate
Content-Type: application/json

{
  "topic": "String",
  "context": "Optional string",
  "agents": ["Optional array of agent IDs"],
  "num_agents": 3,
  "timeout": 30,
  "auto_archive": true
}

Response:
{
  "session_id": "sess_abc123",
  "topic": "topic here",
  "status": "started",
  "agents_count": 3,
  "started_at": "ISO timestamp",
  "estimated_duration": 30
}
```

#### List Sessions
```http
GET /council/sessions?status=active&limit=50

Response:
{
  "sessions": [
    {
      "id": "sess_abc123",
      "topic": "topic",
      "status": "completed|active|paused",
      "consensus_score": 0.82,
      "agents_count": 5,
      "created_at": "ISO timestamp",
      "duration_seconds": 45
    }
  ],
  "total": 10,
  "page": 0
}
```

#### Get Session Details
```http
GET /council/session/{session_id}

Response:
{
  "id": "sess_abc123",
  "topic": "topic",
  "status": "completed",
  "consensus_score": 0.75,
  "votes": [
    {
      "agent_id": "agent_1",
      "position": "agree|disagree|partial",
      "confidence": 0.85,
      "reasoning": "text"
    }
  ],
  "chairman_summary": "text",
  "agents": [],
  "transcript": [],
  "metadata": {}
}
```

#### Pause Session
```http
PATCH /council/session/{session_id}/pause

Response:
{
  "session_id": "sess_abc123",
  "action": "paused",
  "timestamp": "ISO timestamp"
}
```

#### Resume Session
```http
PATCH /council/session/{session_id}/resume

Response:
{
  "session_id": "sess_abc123",
  "action": "resumed",
  "timestamp": "ISO timestamp"
}
```

#### Cancel Session
```http
DELETE /council/session/{session_id}

Response:
{
  "session_id": "sess_abc123",
  "action": "cancelled"
}
```

#### Get Session Transcript
```http
GET /council/session/{session_id}/transcript

Response:
{
  "session_id": "sess_abc123",
  "transcript": [
    {
      "agent_id": "agent_1",
      "timestamp": "ISO timestamp",
      "message": "text"
    }
  ]
}
```

---

### Agent Management

#### List All Agents
```http
GET /council/agents

Response:
{
  "agents": [
    {
      "id": "agent_logic",
      "name": "Logic Analyzer",
      "description": "text",
      "expertise": ["logic", "consistency"],
      "enabled": true,
      "model": "gpt-4"
    }
  ],
  "total": 10
}
```

#### Create Custom Agent
```http
POST /council/agents
Content-Type: application/json

{
  "name": "Custom Agent",
  "description": "text",
  "system_prompt": "text",
  "expertise": ["expertise1", "expertise2"],
  "model": "gpt-4",
  "temperature": 0.7,
  "category": "custom",
  "enabled": true
}

Response:
{
  "id": "agent_custom123",
  "name": "Custom Agent",
  "status": "created",
  "timestamp": "ISO timestamp"
}
```

#### Get Agent Details
```http
GET /council/agents/{agent_id}

Response:
{
  "id": "agent_logic",
  "name": "Logic Analyzer",
  "description": "text",
  "expertise": ["logic", "consistency"],
  "enabled": true,
  "performance": {
    "accuracy": 0.92,
    "latency_ms": 450
  }
}
```

#### Update Agent
```http
PATCH /council/agents/{agent_id}
Content-Type: application/json

{
  "name": "Updated Name",
  "system_prompt": "new prompt",
  "temperature": 0.8
}

Response:
{
  "id": "agent_logic",
  "status": "updated",
  "timestamp": "ISO timestamp"
}
```

#### Delete Agent
```http
DELETE /council/agents/{agent_id}

Response:
{
  "id": "agent_logic",
  "status": "deleted"
}
```

#### Test Agent
```http
POST /council/agents/{agent_id}/test
Content-Type: application/json

{
  "topic": "topic to test"
}

Response:
{
  "agent_id": "agent_logic",
  "topic": "topic",
  "response": "agent response",
  "latency_ms": 523
}
```

#### Get Agent Performance
```http
GET /council/agents/{agent_id}/performance

Response:
{
  "agent_id": "agent_logic",
  "accuracy": 0.94,
  "avg_latency_ms": 450,
  "decision_count": 234,
  "agreement_score": 0.87,
  "trend": "improving|stable|declining"
}
```

#### Enable/Disable Agent
```http
POST /council/agents/{agent_id}/enable
POST /council/agents/{agent_id}/disable

Response:
{
  "agent_id": "agent_logic",
  "enabled": true,
  "timestamp": "ISO timestamp"
}
```

---

### Consensus Control

#### Get Consensus Metrics
```http
GET /council/consensus/metrics

Response:
{
  "current_score": 0.78,
  "avg_past_7d": 0.76,
  "sessions_today": 12,
  "high_disagreement_count": 2,
  "threshold": 0.5
}
```

#### Update Consensus Threshold
```http
PATCH /council/consensus/threshold
Content-Type: application/json

{
  "threshold": 0.6
}

Response:
{
  "threshold": 0.6,
  "updated_at": "ISO timestamp"
}
```

#### Recompute Consensus
```http
POST /council/consensus/recompute
Content-Type: application/json

{
  "session_id": "sess_abc123"
}

Response:
{
  "session_id": "sess_abc123",
  "new_score": 0.82,
  "previous_score": 0.78,
  "timestamp": "ISO timestamp"
}
```

#### List High Disagreement Sessions
```http
GET /council/disagreements?limit=50

Response:
{
  "sessions": [
    {
      "id": "sess_abc123",
      "topic": "topic",
      "disagreement_severity": 0.65,
      "consensus_score": 0.35
    }
  ],
  "total": 5
}
```

---

## 2. RAG MANAGEMENT

### Document Management

#### Upload Document
```http
POST /rag/documents
Content-Type: application/json

{
  "name": "document.pdf",
  "content": "file content or base64",
  "file_type": "pdf|txt|md",
  "collection": "default",
  "metadata": {
    "author": "name",
    "date": "date"
  }
}

Response:
{
  "id": "doc_abc123",
  "name": "document.pdf",
  "status": "indexing",
  "collection": "default",
  "timestamp": "ISO timestamp"
}
```

#### List Documents
```http
GET /rag/documents?collection=default&limit=50

Response:
{
  "documents": [
    {
      "id": "doc_123",
      "name": "Sample.pdf",
      "file_type": "pdf",
      "collection": "default",
      "chunks": 45,
      "status": "indexed",
      "created_at": "ISO timestamp"
    }
  ],
  "total": 10
}
```

#### Get Document
```http
GET /rag/documents/{doc_id}

Response:
{
  "id": "doc_123",
  "name": "Sample.pdf",
  "collection": "default",
  "file_type": "pdf",
  "chunks": 45,
  "status": "indexed",
  "metadata": {},
  "created_at": "ISO timestamp"
}
```

#### Update Document
```http
PATCH /rag/documents/{doc_id}
Content-Type: application/json

{
  "name": "new_name.pdf",
  "metadata": {}
}

Response:
{
  "id": "doc_123",
  "status": "updated"
}
```

#### Delete Document
```http
DELETE /rag/documents/{doc_id}

Response:
{
  "id": "doc_123",
  "status": "deleted"
}
```

#### Batch Upload
```http
POST /rag/documents/batch
Content-Type: application/json

{
  "collection": "default",
  "documents": [
    { "name": "doc1.pdf", "content": "...", "file_type": "pdf" },
    { "name": "doc2.txt", "content": "...", "file_type": "txt" }
  ]
}

Response:
{
  "uploaded": 2,
  "failed": 0,
  "ids": ["doc_123", "doc_124"]
}
```

---

### Vector Database

#### Create Collection
```http
POST /rag/collections
Content-Type: application/json

{
  "name": "my_collection"
}

Response:
{
  "id": "col_abc123",
  "name": "my_collection",
  "status": "created"
}
```

#### List Collections
```http
GET /rag/collections

Response:
{
  "collections": [
    {
      "id": "col_default",
      "name": "default",
      "documents": 42,
      "indexed": true
    }
  ],
  "total": 5
}
```

#### Delete Collection
```http
DELETE /rag/collections/{collection_id}

Response:
{
  "id": "col_abc123",
  "status": "deleted"
}
```

#### Semantic Search
```http
POST /rag/search
Content-Type: application/json

{
  "query": "search terms",
  "collection": "default",
  "limit": 10,
  "threshold": 0.7
}

Response:
{
  "query": "search terms",
  "results": [
    {
      "document_id": "doc_123",
      "chunk_id": "chunk_45",
      "similarity": 0.92,
      "content": "relevant excerpt..."
    }
  ],
  "total": 3
}
```

#### Hybrid Search
```http
POST /rag/search/hybrid
Content-Type: application/json

{
  "query": "search terms",
  "semantic_weight": 0.7,
  "keyword_weight": 0.3
}

Response:
{
  "results": [],
  "total": 0
}
```

#### Vector DB Health
```http
GET /rag/vector-db/health

Response:
{
  "status": "healthy",
  "host": "localhost",
  "port": 8003,
  "collections": 5,
  "documents": 156,
  "embeddings": 3421
}
```

---

## 3. AGENT MARKETPLACE

### Create Custom Agent
```http
POST /marketplace/agents
Content-Type: application/json

{
  "name": "Custom Agent",
  "description": "text",
  "system_prompt": "instructions",
  "expertise": ["expertise"],
  "category": "custom",
  "enabled": true
}

Response:
{
  "id": "mkt_agent_abc123",
  "name": "Custom Agent",
  "category": "custom",
  "status": "created",
  "marketplace_url": "/marketplace/agents/mkt_agent_abc123"
}
```

### List Marketplace Agents
```http
GET /marketplace/agents?category=analysis

Response:
{
  "agents": [
    {
      "id": "mkt_agent_123",
      "name": "Agent Name",
      "category": "analysis",
      "downloads": 234,
      "rating": 4.8,
      "creator": "system"
    }
  ],
  "total": 10
}
```

### Workflows

#### Create Workflow
```http
POST /marketplace/workflows
Content-Type: application/json

{
  "name": "Workflow Name",
  "description": "text",
  "steps": [
    { "type": "deliberate", "topic": "topic" },
    { "type": "archive", "collection": "default" }
  ],
  "schedule": "0 9 * * *",
  "enabled": true
}

Response:
{
  "id": "wf_abc123",
  "name": "Workflow Name",
  "status": "created"
}
```

#### List Workflows
```http
GET /marketplace/workflows

Response:
{
  "workflows": [
    {
      "id": "wf_123",
      "name": "Daily Check",
      "status": "active",
      "executions": 45,
      "last_run": "ISO timestamp"
    }
  ],
  "total": 5
}
```

#### Execute Workflow
```http
POST /marketplace/workflows/{workflow_id}/execute

Response:
{
  "id": "exec_abc123",
  "workflow_id": "wf_123",
  "status": "running",
  "started_at": "ISO timestamp"
}
```

### Batch Operations

#### Create Batch Job
```http
POST /marketplace/batch-jobs
Content-Type: application/json

{
  "name": "Batch Job",
  "items": [
    { "topic": "topic1" },
    { "topic": "topic2" }
  ]
}

Response:
{
  "id": "batch_abc123",
  "name": "Batch Job",
  "item_count": 2,
  "status": "created",
  "estimated_duration_seconds": 10
}
```

#### Get Batch Job
```http
GET /marketplace/batch-jobs/{job_id}

Response:
{
  "id": "batch_abc123",
  "name": "Batch Job",
  "status": "processing",
  "progress": { "processed": 23, "total": 100 },
  "started_at": "ISO timestamp"
}
```

---

## 4. USER & TENANT MANAGEMENT

### Users

#### List Users
```http
GET /users?limit=50

Response:
{
  "users": [
    {
      "id": "user_123",
      "email": "user@example.com",
      "name": "User Name",
      "role": "admin|user|editor",
      "created_at": "ISO timestamp"
    }
  ],
  "total": 50
}
```

#### Create User
```http
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "role": "user",
  "organization": "Org Name"
}

Response:
{
  "id": "user_abc123",
  "email": "user@example.com",
  "role": "user",
  "status": "created"
}
```

#### Get User
```http
GET /users/{user_id}

Response:
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "User Name",
  "role": "user",
  "organization": "Org",
  "created_at": "ISO timestamp"
}
```

#### Update User
```http
PATCH /users/{user_id}
Content-Type: application/json

{
  "name": "New Name",
  "role": "admin"
}

Response:
{
  "id": "user_123",
  "status": "updated"
}
```

#### Delete User
```http
DELETE /users/{user_id}

Response:
{
  "id": "user_123",
  "status": "deleted"
}
```

---

### Authentication

#### Configure SAML
```http
POST /auth/saml/config
Content-Type: application/json

{
  "entity_id": "entity",
  "sso_url": "https://...",
  "certificate": "cert"
}

Response:
{
  "status": "configured",
  "updated_at": "ISO timestamp"
}
```

#### Configure LDAP
```http
POST /auth/ldap/config
Content-Type: application/json

{
  "server": "ldap.example.com",
  "port": 389,
  "base_dn": "dc=example,dc=com",
  "bind_dn": "cn=admin,dc=example,dc=com",
  "bind_password": "password"
}

Response:
{
  "status": "configured",
  "updated_at": "ISO timestamp"
}
```

---

### Tenants

#### List Tenants
```http
GET /tenants

Response:
{
  "tenants": [
    {
      "id": "tenant_123",
      "name": "Acme Inc",
      "users": 45,
      "data_residency": "US|EU",
      "created_at": "ISO timestamp"
    }
  ],
  "total": 10
}
```

#### Create Tenant
```http
POST /tenants
Content-Type: application/json

{
  "name": "Tenant Name"
}

Response:
{
  "id": "tenant_abc123",
  "name": "Tenant Name",
  "status": "created"
}
```

---

## 5. ANALYTICS & REPORTING

### Consensus Analytics

#### Consensus Trends
```http
GET /analytics/consensus/trends?days=7

Response:
{
  "period_days": 7,
  "data": [
    { "date": "ISO date", "score": 0.75 }
  ],
  "avg": 0.76,
  "trend": "improving|stable|declining"
}
```

### Agent Performance

#### Agent Rankings
```http
GET /analytics/agents/ranking

Response:
{
  "ranking": [
    {
      "rank": 1,
      "agent_id": "agent_logic",
      "name": "Logic Analyzer",
      "score": 0.94
    }
  ],
  "updated_at": "ISO timestamp"
}
```

### Cost Tracking

#### Cost Summary
```http
GET /analytics/costs/summary

Response:
{
  "current_month": 1234.56,
  "previous_month": 987.43,
  "projected_month_end": 1456.78,
  "year_to_date": 12345.67,
  "by_model": {
    "gpt-4": 678.90,
    "gpt-3.5": 345.67
  }
}
```

---

## 6. AUDIT LOGGING

#### List Audit Logs
```http
GET /audit/logs?limit=100&actor=user_123&action=deliberate

Response:
{
  "logs": [
    {
      "id": "log_123",
      "actor": "user_123",
      "action": "deliberate",
      "resource": "session_abc",
      "status": "success",
      "timestamp": "ISO timestamp"
    }
  ],
  "total": 100
}
```

#### Search Logs
```http
POST /audit/logs/search
Content-Type: application/json

{
  "query": "search terms"
}

Response:
{
  "query": "search terms",
  "results": [],
  "total": 0
}
```

#### Export Logs
```http
POST /audit/logs/export
Content-Type: application/json

{
  "format": "json|csv|pdf"
}

Response:
{
  "status": "exporting",
  "format": "csv",
  "download_url": "/downloads/audit_2025-12-03.csv"
}
```

---

## 7. SYSTEM ADMINISTRATION

#### System Health
```http
GET /system/health

Response:
{
  "status": "healthy|warning|critical",
  "services": {
    "council": "healthy",
    "litellm": "healthy",
    "postgres": "healthy",
    "redis": "healthy",
    "chroma": "healthy"
  },
  "uptime_seconds": 86400,
  "timestamp": "ISO timestamp"
}
```

#### Resource Usage
```http
GET /system/resources

Response:
{
  "cpu_percent": 34.5,
  "memory_percent": 52.3,
  "disk_percent": 45.2,
  "timestamp": "ISO timestamp"
}
```

#### Get Configuration
```http
GET /system/config

Response:
{
  "debug": false,
  "data_residency": "US",
  "audit_enabled": true,
  "council_url": "http://localhost:8000",
  "litellm_url": "http://localhost:4000/v1"
}
```

#### Update Configuration
```http
PATCH /system/config
Content-Type: application/json

{
  "debug": false,
  "data_residency": "EU"
}

Response:
{
  "status": "updated",
  "timestamp": "ISO timestamp"
}
```

#### Trigger Backup
```http
POST /system/backup

Response:
{
  "id": "backup_abc123",
  "status": "started",
  "timestamp": "ISO timestamp"
}
```

#### List Backups
```http
GET /system/backups

Response:
{
  "backups": [
    {
      "id": "backup_123",
      "created_at": "ISO timestamp",
      "size_gb": 2.3,
      "status": "completed"
    }
  ],
  "total": 10
}
```

---

## WebSocket Connections

Real-time updates via WebSocket:

```bash
# Council session updates
ws://localhost:8001/ws/commander/council/session/{session_id}

# RAG indexing progress
ws://localhost:8001/ws/commander/rag/indexing/{collection_id}

# Workflow execution status
ws://localhost:8001/ws/commander/workflow/{workflow_id}

# System metrics stream
ws://localhost:8001/ws/commander/system/metrics

# Live audit events
ws://localhost:8001/ws/commander/audit/live
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "status_code": 400,
  "details": "Additional context"
}
```

Common HTTP status codes:
- `200` – Success
- `201` – Created
- `400` – Bad request
- `401` – Unauthorized
- `403` – Forbidden
- `404` – Not found
- `500` – Server error

---

## Rate Limiting

- Free tier: 100 requests/hour
- Pro tier: 1,000 requests/hour
- Enterprise: Unlimited

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1701610800
```

---

**Full API documentation for complete council control. All endpoints tested and production-ready.**
