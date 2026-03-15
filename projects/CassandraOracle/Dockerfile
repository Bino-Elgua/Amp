FROM node:20-alpine

WORKDIR /cassandra

# Install dependencies
RUN apk add --no-cache git curl

# Copy package files
COPY package.json package-lock.json ./

# Install npm dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Compile TypeScript
RUN npm run build

# Create data directories
RUN mkdir -p data logs shadow-branches

# Expose ports
EXPOSE 4000 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Start oracle
CMD ["npm", "start"]
