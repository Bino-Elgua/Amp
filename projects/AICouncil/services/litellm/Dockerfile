FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# LiteLLM service requirements
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir \
    litellm==1.3.0 \
    python-dotenv==1.0.0 \
    httpx==0.25.0 \
    uvicorn==0.24.0

# Copy config
COPY config.py .

# Create startup script
RUN echo '#!/bin/bash\n\
exec litellm --model_list_file /app/config.py \
  --host 0.0.0.0 \
  --port ${LITELLM_PORT:-4000} \
  --master_key ${LITELLM_MASTER_KEY:-test-key}' > /app/start.sh && \
chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${LITELLM_PORT:-4000}/models || exit 1

EXPOSE ${LITELLM_PORT:-4000}
CMD ["/app/start.sh"]
