"""
Tests for Council Service API
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add services to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'services', 'council'))

from main import app, DeliberationRequest


@pytest.fixture
def client():
    """Create test client"""
    return TestClient(app)


class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self, client):
        """Health check should return 200"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
        assert response.json()["service"] == "council"
    
    def test_root_endpoint(self, client):
        """Root endpoint should return service info"""
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["service"] == "AICouncil"


class TestStatusEndpoint:
    """Test status endpoint"""
    
    def test_status(self, client):
        """Status endpoint should return config"""
        response = client.get("/api/council/status")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ready"
        assert "config" in data
        assert "deliberation_timeout" in data["config"]


class TestDeliberationEndpoint:
    """Test council deliberation endpoint"""
    
    def test_deliberate_valid_topic(self, client):
        """Valid topic should return deliberation result"""
        request_body = {
            "topic": "Should we adopt automated testing?",
            "context": "We currently have no automated tests.",
            "num_agents": 3
        }
        response = client.post("/api/council/deliberate", json=request_body)
        assert response.status_code == 200
        data = response.json()
        
        # Check response structure
        assert data["topic"] == request_body["topic"]
        assert 0 <= data["consensus_score"] <= 1
        assert isinstance(data["consensus_reached"], bool)
        assert isinstance(data["votes"], list)
        assert len(data["votes"]) > 0
        assert "chairman_summary" in data
    
    def test_deliberate_empty_topic(self, client):
        """Empty topic should return 400"""
        request_body = {
            "topic": "",
            "num_agents": 3
        }
        response = client.post("/api/council/deliberate", json=request_body)
        assert response.status_code == 400
    
    def test_deliberate_with_agents(self, client):
        """Should accept specific agent list"""
        request_body = {
            "topic": "Test topic",
            "agents": ["agent_1", "agent_2"],
            "num_agents": 2
        }
        response = client.post("/api/council/deliberate", json=request_body)
        assert response.status_code == 200


class TestAgentListEndpoint:
    """Test agent listing endpoint"""
    
    def test_list_agents(self, client):
        """Should return list of available agents"""
        response = client.get("/api/council/agents")
        assert response.status_code == 200
        data = response.json()
        
        assert "agents" in data
        assert len(data["agents"]) > 0
        
        # Check agent structure
        for agent in data["agents"]:
            assert "id" in agent
            assert "name" in agent
            assert "description" in agent
            assert "expertise" in agent
            assert isinstance(agent["expertise"], list)


class TestDebateEndpoint:
    """Test debate endpoint"""
    
    def test_debate_mode(self, client):
        """Debate mode should accept requests"""
        request_body = {
            "topic": "Test debate topic",
            "num_agents": 2
        }
        response = client.post("/api/council/debate", json=request_body)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "debate_started"
        assert data["topic"] == request_body["topic"]


class TestResponseModels:
    """Test response model validation"""
    
    def test_deliberation_response_structure(self, client):
        """Deliberation response should match expected structure"""
        request_body = {
            "topic": "Test",
            "num_agents": 3
        }
        response = client.post("/api/council/deliberate", json=request_body)
        assert response.status_code == 200
        data = response.json()
        
        # Verify all required fields
        required_fields = [
            "topic",
            "consensus_score",
            "consensus_reached",
            "votes",
            "chairman_summary",
            "disagreement_severity"
        ]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
        
        # Verify vote structure
        assert len(data["votes"]) > 0
        vote = data["votes"][0]
        assert "agent_id" in vote
        assert "position" in vote
        assert "confidence" in vote
        assert "reasoning" in vote


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
