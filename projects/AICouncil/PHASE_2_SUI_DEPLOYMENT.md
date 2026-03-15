# Phase 2: Sui Smart Contract Deployment

Deploy NeuralBrain Move contract to Sui blockchain.

## Prerequisites

- Sui CLI installed (`cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui`)
- Sui wallet configured (`sui client`)
- SUI tokens on testnet (request from [faucet](https://discord.gg/sui))

## Step 1: Setup Sui Project

```bash
cd contracts
```

The `Move.toml` is already configured for Sui testnet.

## Step 2: Build Contract

```bash
sui move build
```

Expected output:
```
Compiling neural_brain...
Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.52s
```

## Step 3: Deploy to Sui Testnet

```bash
sui client publish --gas-budget 100000000
```

This will:
1. Compile the contract
2. Sign with your Sui wallet
3. Deploy to testnet
4. Return package ID and object IDs

Expected output:
```
Transaction Digest: 0x1234...
Mutated Objects:
  - 0xabcd... (NeuralBrain package)
Created Objects:
  - 0x5678... (AgentRegistry object)
  - 0x9999... (RoundCounter object)
```

## Step 4: Save Deployment Info

Copy these values:
- **Package ID**: 0xabcd... (the published package)
- **AgentRegistry ID**: 0x5678...
- **RoundCounter ID**: 0x9999...

Add to `.env`:

```bash
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
NEURAL_BRAIN_PACKAGE_ID=0xabcd...
AGENT_REGISTRY_ID=0x5678...
ROUND_COUNTER_ID=0x9999...
```

## Step 5: Verify Deployment

Check on Sui testnet explorer:

```bash
# View package
sui client object 0xabcd...

# View registry
sui client object 0x5678...

# View counter
sui client object 0x9999...
```

Or open in browser:
```
https://testnet.suiscan.xyz/object/0xabcd...
```

## Step 6: Test Contract Functions

### Register an Agent

```bash
sui client call \
  --package 0xabcd... \
  --module neural_consensus \
  --function register_agent \
  --args 0x5678... "LogicAnalyzer" "[0x01, 0x02, 0x03]" \
  --gas-budget 10000000
```

### Record Neural Activity

```bash
sui client call \
  --package 0xabcd... \
  --module neural_consensus \
  --function record_neural_activity \
  --args 0x5678... <agent-id> "[0x04, 0x05]" 850 "QmXxxx..." \
  --gas-budget 10000000
```

### Create Consensus Round

```bash
sui client call \
  --package 0xabcd... \
  --module neural_consensus \
  --function create_consensus_round \
  --args 0x9999... "Test Topic" \
  --gas-budget 10000000
```

## Step 7: Integration Configuration

Update `services/neural-brain/.env`:

```bash
# Sui Configuration
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_NETWORK=testnet
NEURAL_BRAIN_PACKAGE_ID=0xabcd...
AGENT_REGISTRY_ID=0x5678...
ROUND_COUNTER_ID=0x9999...

# IPFS (for archival)
IPFS_HOST=/ip4/127.0.0.1/tcp/5001

# Consensus
CONSENSUS_THRESHOLD=0.5
DELIBERATION_TIMEOUT=30
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `sui` command not found | Install Sui CLI: `cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui` |
| Compilation errors | Check Move.toml dependencies, run `sui move build --dump-package` |
| Deployment fails | Ensure wallet has SUI tokens, use `sui client faucet` |
| Can't find objects | Use `sui client objects` to list your objects |

## Next: Phase 3

Contract deployed. Move to Phase 3 to integrate with council service.

You'll need:
- ✅ Package ID
- ✅ AgentRegistry ID
- ✅ RoundCounter ID
