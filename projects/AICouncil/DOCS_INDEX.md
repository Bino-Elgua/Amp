# AICouncil Documentation Index

## 🚀 Getting Started

**[START_HERE_PHASES_2_3_4_1.md](START_HERE_PHASES_2_3_4_1.md)** – Quick overview of execution phases  
**[EXECUTION_ORDER_2_3_4_1.md](EXECUTION_ORDER_2_3_4_1.md)** – Master execution guide with timelines

## 📊 Architecture & Design

**[README.md](README.md)** – Project vision and overview  
**[BLOCKCHAIN_NEURAL_INTEGRATION.md](BLOCKCHAIN_NEURAL_INTEGRATION.md)** – Complete architectural vision  
**[NEURAL_ARCHITECTURE.md](NEURAL_ARCHITECTURE.md)** – Diagrams, data structures, API specs  
**[BLOCKCHAIN_NEURAL_PROJECT_SUMMARY.md](BLOCKCHAIN_NEURAL_PROJECT_SUMMARY.md)** – Quick reference guide

## 🔧 Implementation Guides

**[PHASE_2_SUI_DEPLOYMENT.md](PHASE_2_SUI_DEPLOYMENT.md)** – Deploy Move contract to Sui  
**[PHASE_3_INTEGRATION.md](PHASE_3_INTEGRATION.md)** – Add blockchain endpoints to council service  
**[PHASE_4_UI.md](PHASE_4_UI.md)** – Display blockchain proofs in OpenWebUI  
**[PHASE_1_LOCAL_TESTING.md](PHASE_1_LOCAL_TESTING.md)** – Test everything locally

## 📖 Additional Resources

**[NEURAL_INTEGRATION_GUIDE.md](NEURAL_INTEGRATION_GUIDE.md)** – Detailed setup & advanced features  
**[NEURAL_DELIVERABLES.md](NEURAL_DELIVERABLES.md)** – Complete deliverables manifest  
**[CONTRIBUTING.md](CONTRIBUTING.md)** – Contributing guidelines  
**[ATTRIBUTION.md](ATTRIBUTION.md)** – Project attribution & licenses

---

## 📁 Code Structure

```
AIcouncil/
├── contracts/
│   ├── neural_brain.move         (Sui Move smart contract)
│   ├── Move.toml                 (Move.lock config)
│   └── .env.example
├── services/
│   ├── council/
│   │   └── council_blockchain.py (Council service blockchain integration)
│   └── neural-brain/
│       ├── blockchain_core.py    (Sui RPC integration)
│       ├── test_blockchain_integration.py
│       ├── requirements.txt
│       └── .env.example
├── apps/
│   └── openwebui/
│       └── src/lib/
│           └── BlockchainProofDisplay.svelte (UI component)
├── docs/
│   └── (existing documentation)
└── README.md
```

## 🎯 Quick Links

| Task | File |
|------|------|
| Deploy contract | PHASE_2_SUI_DEPLOYMENT.md |
| Integrate council | PHASE_3_INTEGRATION.md |
| Add UI | PHASE_4_UI.md |
| Test locally | PHASE_1_LOCAL_TESTING.md |
| Understand architecture | NEURAL_ARCHITECTURE.md |
| Full vision | BLOCKCHAIN_NEURAL_INTEGRATION.md |

## ⏱️ Execution Timeline

Total: ~2.5 hours

- Phase 2: 30 min (Sui deployment)
- Phase 3: 45 min (Integration)
- Phase 4: 30 min (UI)
- Phase 1: 30 min (Testing)

---

Start with: **[START_HERE_PHASES_2_3_4_1.md](START_HERE_PHASES_2_3_4_1.md)**
