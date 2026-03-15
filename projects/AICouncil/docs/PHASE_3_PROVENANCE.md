# Phase 3: Ritual Orchestration & Provenance

Complete guide to implementing permanent storage, on-chain provenance, and agent creation.

## Overview

Phase 3 transforms AICouncil from a deliberation engine into a permanently-recorded system with:
- Document ingestion & RAG pipelines (Task 8-9)
- Permanent archival to Arweave (Task 11)
- On-chain NFT provenance via Sui (Task 12)
- Drag-and-drop ritual builder via Flowise (Task 10)

## Task 8: AnythingLLM RAG Microservice

### Purpose
Add document upload and semantic search capabilities.

### API Reference

#### Collections

```bash
# Create collection
curl -X POST http://localhost:3001/api/collections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research Papers",
    "description": "Council deliberation resources"
  }'

# List collections
curl http://localhost:3001/api/collections

# Get collection
curl http://localhost:3001/api/collections/{id}

# Delete collection
curl -X DELETE http://localhost:3001/api/collections/{id}
```

#### Documents

```bash
# Upload document
curl -X POST http://localhost:3001/api/collections/{collectionId}/documents \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "research.pdf",
    "content": "Full text of document...",
    "metadata": {
      "source": "arxiv",
      "date": "2024-01-15"
    }
  }'

# List documents in collection
curl http://localhost:3001/api/collections/{collectionId}/documents

# Get document
curl http://localhost:3001/api/documents/{documentId}

# Delete document
curl -X DELETE http://localhost:3001/api/documents/{documentId}
```

#### Search & Retrieval

```bash
# Semantic search
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "consensus algorithms",
    "collectionId": "collection-id",
    "limit": 5
  }'

# Query with RAG
curl -X POST http://localhost:3001/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is Byzantine agreement?",
    "collectionId": "collection-id",
    "context": "Background about distributed systems"
  }'
```

### Implementation Roadmap

1. **Phase 3a** (Complete)
   - Basic document storage (in-memory)
   - Keyword search
   - Collection management

2. **Phase 3b** (Next)
   - Vector embeddings (sentence-transformers)
   - Semantic similarity search
   - Integration with LiteLLM embeddings

3. **Phase 3c** (Later)
   - Persistent storage (PostgreSQL)
   - Vector database (Chroma, Weaviate)
   - File upload via multipart

## Task 9: RAG-before-Council Pipeline

### Concept
Automatically retrieve relevant documents before council deliberation.

### Flow

```
User Query
    ↓
Retrieve Documents (AnythingLLM)
    ↓
Augment Prompt with Relevant Context
    ↓
Send to Council Service
    ↓
Council deliberates WITH document context
    ↓
Return votes + citations
```

### Implementation

```python
# In council/main.py - modify /api/council/deliberate endpoint

async def deliberate(request: DeliberationRequest):
    """Enhanced with RAG"""
    
    # 1. Retrieve relevant documents
    rag_response = await httpx.AsyncClient().post(
        "http://anything-llm:3001/api/query",
        json={
            "question": request.topic,
            "context": request.context,
        }
    )
    
    # 2. Augment prompt with citations
    augmented_prompt = rag_response.json()["augmentedPrompt"]
    
    # 3. Send to agents
    agent_responses = await get_agent_responses(augmented_prompt)
    
    # 4. Return with sources
    return DeliberationResponse(
        topic=request.topic,
        votes=agent_responses,
        sources=rag_response.json()["sources"],  # Citation links
    )
```

## Task 10: Flowise Embedded Ritual Builder

### Purpose
Allow users to create custom agent chains via drag-and-drop.

### Features
- Drag-and-drop workflow builder
- Pre-built node templates
- Export chains as JSON
- Import into chat

### Deployment

Flowise is already in docker-compose on port 3000.

```bash
# Access UI
open http://localhost:3000

# Create workflow
1. Click "Create new flow"
2. Drag nodes: Input → LLM → Output
3. Configure each node
4. Click "Save" then "Export"
```

### API Integration

```typescript
// Embed Flowise in OpenWebUI
import FloweiseBrowser from 'flowise-embed-react';

export const RitualBuilder = () => {
  return (
    <FloweiseBrowser
      chatflowid="your-flow-id"
      apiHost="http://localhost:3000"
    />
  );
};
```

## Task 11: Arweave Permanent Storage

### Purpose
Archive every council session forever on Arweave.

### How It Works

1. Council deliberation completes
2. Session data serialized to JSON
3. Upload to Bundlr (batching service)
4. Bundlr submits to Arweave
5. TX ID returned & stored in Postgres
6. UI displays Arweave link

### API

```bash
# Archive session
curl -X POST http://localhost:8001/archive \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session-123",
    "topic": "Council deliberation topic",
    "consensus_score": 0.75,
    "votes": [...],
    "chairman_summary": "Summary text",
    "disagreement_severity": 0.25
  }'

# Response:
# {
#   "archive": {
#     "tx_id": "txid...",
#     "url": "https://arweave.net/txid...",
#     "timestamp": "2024-01-15T10:00:00Z"
#   }
# }

# Retrieve archived session
curl http://localhost:8001/retrieve/{tx_id}

# Verify storage
curl http://localhost:8001/verify/{tx_id}
```

### Setup (Testnet)

```bash
# Install Bundlr CLI
npm install -g @bundlr-network/bundlr-cli

# Create bundle
bundlr fund 0.1 --node https://node1.bundlr.network:8000

# Verify balance
bundlr balance
```

### Configuration

```bash
ARWEAVE_ENDPOINT=https://arweave.net
BUNDLR_NODE=http://node1.bundlr.network:8000
BUNDLR_CURRENCY=arweave
BUNDLR_PRIVATE_KEY=your-private-key
```

## Task 12: Sui Testnet Provenance & NFT Minting

### Purpose
Mint NFTs representing high-disagreement council sessions.

### NFT Structure

```typescript
{
  sessionId: string;
  topic: string;
  consensusScore: number;    // 0-1
  disagreementSeverity: number; // 0-1
  agentCount: number;
  timestamp: string;
  chairmanSummary: string;
}
```

### Minting Trigger

NFT is minted if: `disagreement_severity >= 0.6`

### API

```bash
# Mint NFT (automatic from Council service)
# After council deliberation with high disagreement

# Get NFT metadata
curl http://localhost:3002/nft/{objectId}

# Verify ownership
curl http://localhost:3002/verify \
  -d '{
    "nftId": "nft-id",
    "userAddress": "0x..."
  }'

# Get user's NFTs
curl http://localhost:3002/user/{address}/nfts
```

### Setup (Testnet)

```bash
# Install Sui CLI
curl -sSLf https://sui-releases.s3-us-west-2.amazonaws.com/sui-0.33.0-linux-x86_64.zip | unzip -d ~/.local/bin

# Configure network
sui client switch --env testnet

# Get test tokens
curl --location --request POST 'https://faucet.testnet.sui.io/gas' \
  --header 'Content-Type: application/json' \
  --data-raw '{ "FixedAmountRequest": { "recipient": "'$(sui client active-address)'" } }'

# Publish package
sui client publish --gas-budget 10000000
```

### Sui Move Contract (Skeleton)

```move
// Move NFT contract
module aicouncil::disagreement_nft {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    
    struct DisagreementNFT has key, store {
        id: UID,
        session_id: vector<u8>,
        consensus_score: u64,
        disagreement_severity: u64,
        timestamp: u64,
    }
    
    public entry fun mint_nft(
        session_id: vector<u8>,
        consensus_score: u64,
        disagreement_severity: u64,
        ctx: &mut TxContext
    ) {
        let nft = DisagreementNFT {
            id: object::new(ctx),
            session_id,
            consensus_score,
            disagreement_severity,
            timestamp: sui::clock::timestamp_ms(&clock),
        };
        
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }
}
```

## Phase 3 Integration

### Full Flow

```
1. User uploads PDF to AnythingLLM
2. Document indexed & searchable
3. User asks council question
4. AnythingLLM retrieves relevant docs
5. Council receives augmented prompt
6. Deliberation completes
7. If disagreement >= 0.6:
   - Archive to Arweave
   - Mint NFT on Sui
8. UI shows:
   - Council results
   - Arweave link
   - NFT address
```

### Testing

```bash
# Start Phase 3 services
docker compose up anything-llm archiver

# Create collection
curl -X POST http://localhost:3001/api/collections \
  -d '{"name": "Test", "description": "Test docs"}'

# Upload document
curl -X POST http://localhost:3001/api/collections/{id}/documents \
  -d '{
    "filename": "test.txt",
    "content": "Council deliberation about consensus algorithms..."
  }'

# Query
curl -X POST http://localhost:3001/api/query \
  -d '{"question": "How does consensus work?"}'

# Get council response with citations
curl -X POST http://localhost:8000/api/council/deliberate \
  -d '{
    "topic": "How does consensus work?",
    "context": "Retrieved from knowledge base"
  }'
```

## Troubleshooting

### AnythingLLM won't start
```bash
docker logs aicouncil-anything-llm
# Check: NODE_ENV set to production?
export NODE_ENV=development
docker compose up anything-llm
```

### Arweave connection fails
```bash
# Check Bundlr connectivity
curl http://node1.bundlr.network:8000/status

# Use testnet
ARWEAVE_ENDPOINT=https://testnet.arweave.net
```

### NFT mint fails
```bash
# Check Sui testnet network
sui client call --module aicouncil::disagreement_nft --function mint_nft

# Get test tokens
curl -X POST https://faucet.testnet.sui.io/gas \
  -H "Content-Type: application/json" \
  -d '{"FixedAmountRequest": {"recipient": "<YOUR_ADDRESS>"}}'
```

## See Also

- [Architecture](./ARCHITECTURE.md)
- [Deployment](./DEPLOYMENT.md)
- [AnythingLLM Docs](https://docs.anythingllm.com)
- [Arweave Docs](https://docs.arweave.org)
- [Sui Docs](https://docs.sui.io)
