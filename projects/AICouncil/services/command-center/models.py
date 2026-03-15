"""Data models for Command Center API"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class AgentRole(str, Enum):
    LOGIC = "logic"
    ETHICS = "ethics"
    RISK = "risk_assessment"
    CREATIVE = "creative"
    TECHNICAL = "technical"
    DOMAIN = "domain_expert"


class DeliberationRequest(BaseModel):
    """Request for council deliberation"""
    question: str
    agent_count: int = Field(default=3, ge=1, le=10)
    context: Optional[str] = None
    temperature: Optional[float] = Field(default=0.7, ge=0, le=2)
    max_tokens: Optional[int] = Field(default=2000, ge=100)
    rag_enabled: bool = Field(default=False)
    rag_collection: Optional[str] = None


class SessionResponse(BaseModel):
    """Council session response"""
    session_id: str
    status: str
    question: str
    agent_count: int
    consensus_score: float
    created_at: datetime
    updated_at: datetime
    votes: List[Dict[str, Any]]
    summary: Optional[str] = None


class AgentConfig(BaseModel):
    """Agent configuration"""
    name: str
    role: AgentRole
    model: str = Field(default="gpt-4")
    system_prompt: str
    temperature: Optional[float] = Field(default=0.7, ge=0, le=2)
    enabled: bool = Field(default=True)
    description: Optional[str] = None
    expertise_area: Optional[str] = None


class DocumentUpload(BaseModel):
    """Document upload request"""
    filename: str
    content: str
    collection_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    file_type: str = Field(default="txt")  # txt, pdf, markdown


class WorkflowDefinition(BaseModel):
    """Workflow/pipeline definition"""
    name: str
    description: Optional[str] = None
    steps: List[Dict[str, Any]]
    input_schema: Optional[Dict[str, Any]] = None
    output_schema: Optional[Dict[str, Any]] = None
    schedule: Optional[str] = None  # cron expression
    enabled: bool = Field(default=True)


class UserCreate(BaseModel):
    """User creation request"""
    email: str
    name: str
    role: str = Field(default="user")
    organization: Optional[str] = None
    tenant_id: Optional[str] = None


class TenantCreate(BaseModel):
    """Tenant creation request"""
    name: str
    organization: str
    data_residency: str = Field(default="US")  # US or EU
    max_users: int = Field(default=10)
    max_api_calls_per_month: int = Field(default=100000)


class AnalyticsQuery(BaseModel):
    """Analytics query"""
    metric_type: str
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    group_by: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None


class ReportRequest(BaseModel):
    """Report generation request"""
    report_type: str
    title: Optional[str] = None
    date_range: str = Field(default="30d")
    include_sections: Optional[List[str]] = None


class AuditLogEntry(BaseModel):
    """Audit log entry"""
    timestamp: datetime
    actor: str
    action: str
    resource_type: str
    resource_id: str
    details: Dict[str, Any]
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None


class ComplianceCheck(BaseModel):
    """Compliance check result"""
    check_id: str
    check_name: str
    status: str
    timestamp: datetime
    findings: List[str]
    remediation_steps: Optional[List[str]] = None


class DataDeletionRequest(BaseModel):
    """GDPR data deletion request"""
    user_id: str
    request_id: str
    status: str
    created_at: datetime
    scheduled_deletion_at: datetime
    reason: Optional[str] = None
