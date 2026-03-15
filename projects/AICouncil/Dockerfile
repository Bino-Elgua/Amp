# Multi-stage build for AICouncil services

# Stage 1: Python services builder
FROM python:3.11-slim as python-builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies
COPY pyproject.toml ./
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -e .

# Stage 2: Node.js builder
FROM node:20-alpine as node-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/ ./apps/
COPY services/ ./services/
COPY middleware/ ./middleware/

# Install dependencies
RUN npm ci && \
    npm run build

# Stage 3: Runtime - Python services
FROM python:3.11-slim as python-runtime

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python environment from builder
COPY --from=python-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=python-builder /usr/local/bin /usr/local/bin

# Copy application code
COPY services/ ./services/
COPY middleware/ ./middleware/

EXPOSE 8000 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Default to council service
CMD ["uvicorn", "services.council.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Stage 4: Runtime - Node.js services
FROM node:20-alpine as node-runtime

WORKDIR /app

# Copy built artifacts from builder
COPY --from=node-builder /app/dist ./dist
COPY --from=node-builder /app/node_modules ./node_modules
COPY --from=node-builder /app/package*.json ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["npm", "start"]
