"""
Arweave Session Archiver
Task 11: Permanent storage of council deliberations
"""

import os
import json
import asyncio
from datetime import datetime
from typing import Dict, Optional, Any
from pydantic import BaseModel, Field
import httpx


class SessionRecord(BaseModel):
    """Council session record to archive"""
    session_id: str
    topic: str
    consensus_score: float = Field(ge=0.0, le=1.0)
    votes: list
    chairman_summary: str
    disagreement_severity: float = Field(ge=0.0, le=1.0)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = {}


class ArweaveArchiver:
    """
    Handles permanent archival of council sessions to Arweave
    Phase 3: Task 11
    """

    def __init__(self):
        self.arweave_endpoint = os.getenv(
            "ARWEAVE_ENDPOINT",
            "https://arweave.net"
        )
        self.bundlr_node = os.getenv(
            "BUNDLR_NODE",
            "http://node1.bundlr.network:8000"
        )
        self.bundlr_currency = os.getenv("BUNDLR_CURRENCY", "arweave")
        self.private_key = os.getenv("BUNDLR_PRIVATE_KEY")
        
        # For development: use mock archival
        self.use_mock = not self.private_key or self.private_key == "test"

    async def archive_session(
        self,
        session: SessionRecord
    ) -> Optional[Dict[str, str]]:
        """
        Archive a council session to Arweave
        
        Returns:
            Dict with tx_id, url, timestamp on success
            None on failure
        """

        if self.use_mock:
            # Development: mock archival
            return self._mock_archive(session)

        try:
            # Convert session to JSON
            session_json = json.dumps(
                session.dict(),
                default=str,
                indent=2
            )

            # Create metadata
            metadata = {
                "service": "aicouncil",
                "type": "council-session",
                "timestamp": datetime.utcnow().isoformat(),
                "consensus_score": session.consensus_score,
                "disagreement_severity": session.disagreement_severity,
            }

            # TODO: Phase 3 - Implement actual Arweave/Bundlr upload
            # For now, return mock response

            return {
                "tx_id": f"mock-tx-{session.session_id}",
                "url": f"https://arweave.net/mock-tx-{session.session_id}",
                "bundlr_id": f"bundlr-{session.session_id}",
                "timestamp": datetime.utcnow().isoformat(),
                "cost_ar": "0.0001",
                "status": "pending",
            }

        except Exception as e:
            print(f"Error archiving session: {e}")
            return None

    def _mock_archive(self, session: SessionRecord) -> Dict[str, str]:
        """Mock archival for development"""

        return {
            "tx_id": f"mock-tx-{session.session_id}",
            "url": f"https://arweave.net/mock-tx-{session.session_id}",
            "bundlr_id": f"bundlr-{session.session_id}",
            "timestamp": datetime.utcnow().isoformat(),
            "cost_ar": "0.0001",
            "status": "confirmed",
            "note": "Development mode - not actually archived",
        }

    async def get_archived_session(self, tx_id: str) -> Optional[Dict]:
        """Retrieve archived session from Arweave"""

        if self.use_mock:
            # Return mock data
            return {
                "tx_id": tx_id,
                "data": {
                    "session_id": "mock-session",
                    "status": "retrieved from mock",
                }
            }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.arweave_endpoint}/{tx_id}",
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return {
                        "tx_id": tx_id,
                        "data": response.json(),
                        "status": "retrieved"
                    }
                
                return None

        except Exception as e:
            print(f"Error retrieving session: {e}")
            return None

    async def verify_permanent_storage(self, tx_id: str) -> bool:
        """Verify that data is permanently stored"""

        if self.use_mock:
            return True

        try:
            async with httpx.AsyncClient() as client:
                # Check if transaction exists on Arweave
                response = await client.get(
                    f"{self.arweave_endpoint}/tx/{tx_id}/status",
                    timeout=10.0
                )
                
                return response.status_code == 200

        except Exception as e:
            print(f"Error verifying storage: {e}")
            return False


# ============================================
# FastAPI Integration
# ============================================

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

app = FastAPI(
    title="AICouncil Archiver",
    description="Permanent session archival service",
    version="0.1.0"
)

archiver = ArweaveArchiver()


@app.post("/archive")
async def archive_session(session: SessionRecord):
    """Archive a council session"""

    result = await archiver.archive_session(session)

    if not result:
        raise HTTPException(
            status_code=500,
            detail="Failed to archive session"
        )

    return {
        "message": "Session archived",
        "archive": result
    }


@app.get("/retrieve/{tx_id}")
async def retrieve_session(tx_id: str):
    """Retrieve archived session"""

    session = await archiver.get_archived_session(tx_id)

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    return session


@app.get("/verify/{tx_id}")
async def verify_storage(tx_id: str):
    """Verify permanent storage"""

    is_verified = await archiver.verify_permanent_storage(tx_id)

    return {
        "tx_id": tx_id,
        "verified": is_verified,
        "message": "Data is permanently stored on Arweave" if is_verified
                  else "Data verification pending"
    }


@app.get("/health")
async def health():
    """Health check"""
    return {
        "status": "healthy",
        "service": "archiver",
        "arweave": "connected" if not archiver.use_mock else "mock",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )
