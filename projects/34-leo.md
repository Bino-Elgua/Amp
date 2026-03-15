# LÉO — Deep Dive Report
> **Category:** AI / Trading  
> **Status:** 🔶 Alpha  
> **Monetization:** ✅ Trading revenue  
> **Est. Y1 Revenue:** Variable (trading profits)
## Overview
Recursive AI crypto trading agent — Claude synthesizes strategies, Monte Carlo backtests (1000 runs), deploys via Flashbots + Safe{Core} multisig. FHE encryption for strategy storage. 9 files.
## Tech Stack
- **Agent:** TypeScript (Anthropic Claude SDK)
- **Backtest:** Python (Backtrader, NumPy, SciPy)
- **Wallet:** ethers.js, Flashbots Protect, WalletConnect
- **Privacy:** Zama FHE
## Risk Assessment
| Risk | Severity | Mitigation |
|------|----------|------------|
| Trading losses | Critical | Sharpe > 1.2 target, paper trading first |
| Regulatory | High | Non-custodial, no advice given |
| Smart contract risk | High | Phase 5 audit required |
## Verdict
High risk, high reward. Do NOT deploy to mainnet without full audit. Interesting IP. ⭐⭐⭐ (3/5)
