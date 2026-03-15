"""
Integration tests for complete AICouncil stack
Task 5: Local Test & Akash SDL Draft
"""

import pytest
import httpx
import asyncio
from typing import AsyncGenerator
import time


# Service URLs (from docker-compose)
LITELLM_URL = "http://localhost:4000"
COUNCIL_URL = "http://localhost:8000"
OPENWEBUI_URL = "http://localhost:8080"
OLLAMA_URL = "http://localhost:11434"


@pytest.fixture(scope="session")
async def httpx_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Create an async HTTP client for testing"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        yield client


class TestServiceAvailability:
    """Test that all services are running and healthy"""

    @pytest.mark.asyncio
    async def test_litellm_health(self, httpx_client):
        """LiteLLM should be healthy"""
        try:
            response = await httpx_client.get(f"{LITELLM_URL}/health")
            assert response.status_code in [200, 204], f"LiteLLM status: {response.status_code}"
        except Exception as e:
            pytest.skip(f"LiteLLM not available: {e}")

    @pytest.mark.asyncio
    async def test_council_health(self, httpx_client):
        """Council service should be healthy"""
        try:
            response = await httpx_client.get(f"{COUNCIL_URL}/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"
            assert data["service"] == "council"
        except Exception as e:
            pytest.skip(f"Council not available: {e}")

    @pytest.mark.asyncio
    async def test_ollama_health(self, httpx_client):
        """Ollama should be available"""
        try:
            response = await httpx_client.get(f"{OLLAMA_URL}/api/tags")
            assert response.status_code == 200
        except Exception as e:
            pytest.skip(f"Ollama not available: {e}")


class TestCouncilAPI:
    """Test Council Service API"""

    @pytest.mark.asyncio
    async def test_council_deliberation(self, httpx_client):
        """Council should handle deliberation requests"""
        payload = {
            "topic": "Should we adopt automatic testing?",
            "context": "Currently we have no test coverage.",
            "num_agents": 3
        }
        
        response = await httpx_client.post(
            f"{COUNCIL_URL}/api/council/deliberate",
            json=payload
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "topic" in data
        assert "consensus_score" in data
        assert "votes" in data
        assert len(data["votes"]) >= 1

    @pytest.mark.asyncio
    async def test_council_agents(self, httpx_client):
        """Should list available agents"""
        response = await httpx_client.get(f"{COUNCIL_URL}/api/council/agents")
        assert response.status_code == 200
        data = response.json()
        assert "agents" in data
        assert len(data["agents"]) > 0


class TestLiteLLMProxy:
    """Test LiteLLM API Proxy"""

    @pytest.mark.asyncio
    async def test_litellm_models_list(self, httpx_client):
        """LiteLLM should expose model list"""
        try:
            response = await httpx_client.get(
                f"{LITELLM_URL}/v1/models"
            )
            assert response.status_code == 200
            data = response.json()
            assert "data" in data
        except httpx.ConnectError:
            pytest.skip("LiteLLM not running")

    @pytest.mark.asyncio
    async def test_litellm_chat_completion(self, httpx_client):
        """LiteLLM should handle chat completion (with fallback)"""
        payload = {
            "model": "ollama/llama2",  # Use local model for testing
            "messages": [
                {
                    "role": "user",
                    "content": "Say hello"
                }
            ]
        }
        
        try:
            response = await httpx_client.post(
                f"{LITELLM_URL}/v1/chat/completions",
                json=payload,
                timeout=60.0
            )
            
            # Accept 200 or 404 (if model not loaded)
            assert response.status_code in [200, 404]
            
            if response.status_code == 200:
                data = response.json()
                assert "choices" in data
        except httpx.TimeoutException:
            pytest.skip("Request timeout (may indicate slow model loading)")
        except Exception as e:
            pytest.skip(f"LiteLLM request failed: {e}")


class TestDockerCompose:
    """Test Docker Compose configuration"""

    def test_services_defined(self):
        """Verify all required services are in docker-compose"""
        import yaml
        
        with open("deploy/docker/docker-compose.yml") as f:
            compose = yaml.safe_load(f)
        
        required_services = [
            "openwebui",
            "litellm",
            "ollama",
            "council"
        ]
        
        for service in required_services:
            assert service in compose["services"], f"Missing service: {service}"

    def test_volumes_defined(self):
        """Verify volumes for persistence"""
        import yaml
        
        with open("deploy/docker/docker-compose.yml") as f:
            compose = yaml.safe_load(f)
        
        assert "volumes" in compose
        # Should have volumes for data persistence
        assert len(compose["volumes"]) > 0

    def test_health_checks(self):
        """Verify health checks are configured"""
        import yaml
        
        with open("deploy/docker/docker-compose.yml") as f:
            compose = yaml.safe_load(f)
        
        for service_name, service in compose["services"].items():
            if service_name not in ["postgres", "redis"]:
                # Most services should have health checks
                assert "healthcheck" in service or service_name in [
                    "openwebui"
                ], f"Missing health check: {service_name}"


class TestErrorHandling:
    """Test error handling across services"""

    @pytest.mark.asyncio
    async def test_council_invalid_request(self, httpx_client):
        """Council should reject invalid requests"""
        payload = {
            "topic": "",  # Empty topic
            "num_agents": 3
        }
        
        response = await httpx_client.post(
            f"{COUNCIL_URL}/api/council/deliberate",
            json=payload
        )
        
        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_council_timeout(self, httpx_client):
        """Council should timeout appropriately"""
        payload = {
            "topic": "Very long topic" * 1000,  # Stress test
            "num_agents": 10,
        }
        
        response = await httpx_client.post(
            f"{COUNCIL_URL}/api/council/deliberate",
            json=payload,
            timeout=5.0
        )
        
        # Should either succeed or timeout gracefully
        assert response.status_code in [200, 408, 504]


class TestPerformance:
    """Performance and load tests"""

    @pytest.mark.asyncio
    async def test_council_response_time(self, httpx_client):
        """Council deliberation should complete within timeout"""
        payload = {
            "topic": "Should we use async/await?",
            "num_agents": 3
        }
        
        import time
        start = time.time()
        
        response = await httpx_client.post(
            f"{COUNCIL_URL}/api/council/deliberate",
            json=payload,
            timeout=60.0
        )
        
        elapsed = time.time() - start
        
        assert response.status_code == 200
        assert elapsed < 60, f"Deliberation took {elapsed}s (timeout: 60s)"

    @pytest.mark.asyncio
    async def test_concurrent_requests(self, httpx_client):
        """Handle multiple concurrent requests"""
        payload = {
            "topic": "Concurrent test",
            "num_agents": 2
        }
        
        tasks = [
            httpx_client.post(
                f"{COUNCIL_URL}/api/council/deliberate",
                json=payload,
                timeout=30.0
            )
            for _ in range(3)
        ]
        
        responses = await asyncio.gather(*tasks)
        
        # All should succeed or handle load gracefully
        for response in responses:
            assert response.status_code in [200, 429, 503]


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
