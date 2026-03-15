"""
LiteLLM Configuration Management
Handles Venice API integration with local fallback
"""

import os
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class ModelConfig(BaseModel):
    """Model configuration"""
    name: str
    provider: str
    api_key: Optional[str] = None
    api_base: Optional[str] = None
    fallback: Optional[str] = None


class LiteLLMConfig:
    """LiteLLM service configuration"""
    
    # Venice API Configuration (Primary)
    VENICE_API_KEY: str = os.getenv("VENICE_API_KEY", "")
    VENICE_API_BASE: str = os.getenv(
        "VENICE_API_BASE",
        "https://api.venice.ai/v1"
    )
    
    # Ollama Configuration (Fallback)
    OLLAMA_ENDPOINT: str = os.getenv(
        "OLLAMA_ENDPOINT",
        "http://ollama:11434"
    )
    
    # LiteLLM Settings
    LOG_LEVEL: str = os.getenv("LITELLM_LOG_LEVEL", "info")
    MASTER_KEY: str = os.getenv("LITELLM_MASTER_KEY", "test-master-key")
    PORT: int = int(os.getenv("LITELLM_PORT", "4000"))
    
    # Rate Limiting (Phase 4)
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
    RATE_LIMIT_WINDOW: int = int(os.getenv("RATE_LIMIT_WINDOW", "3600"))
    
    # Redis Configuration (Phase 4)
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Fallback Strategy
    FALLBACK_ENABLED: bool = True
    FALLBACK_TIMEOUT: int = 30  # seconds
    
    @classmethod
    def get_model_list(cls) -> List[Dict]:
        """Get configured model list for LiteLLM"""
        return [
            # Venice API Models (Primary)
            {
                "model_name": "gpt-4",
                "litellm_params": {
                    "model": "openai/gpt-4",
                    "api_key": cls.VENICE_API_KEY,
                    "api_base": cls.VENICE_API_BASE,
                },
                "model_info": {
                    "supports_function_calling": True,
                    "supports_vision": True,
                }
            },
            {
                "model_name": "gpt-3.5-turbo",
                "litellm_params": {
                    "model": "openai/gpt-3.5-turbo",
                    "api_key": cls.VENICE_API_KEY,
                    "api_base": cls.VENICE_API_BASE,
                },
                "model_info": {
                    "supports_function_calling": True,
                }
            },
            {
                "model_name": "llama-405b",
                "litellm_params": {
                    "model": "openai/llama-405b",
                    "api_key": cls.VENICE_API_KEY,
                    "api_base": cls.VENICE_API_BASE,
                },
                "model_info": {
                    "supports_function_calling": False,
                }
            },
            # Ollama Local Models (Fallback)
            {
                "model_name": "ollama/llama2",
                "litellm_params": {
                    "model": "ollama/llama2",
                    "api_base": cls.OLLAMA_ENDPOINT,
                },
                "model_info": {
                    "supports_function_calling": False,
                }
            },
            {
                "model_name": "ollama/mistral",
                "litellm_params": {
                    "model": "ollama/mistral",
                    "api_base": cls.OLLAMA_ENDPOINT,
                },
                "model_info": {
                    "supports_function_calling": False,
                }
            },
        ]
    
    @classmethod
    def get_fallback_models(cls) -> Dict[str, List[str]]:
        """Get fallback model mapping"""
        return {
            "gpt-4": ["ollama/llama2"],
            "gpt-3.5-turbo": ["ollama/mistral"],
            "llama-405b": ["ollama/llama2"],
        }


config = LiteLLMConfig()
