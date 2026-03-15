# DNABOT — Deep Dive Report

> **Category:** AI/SaaS Platform  
> **Status:** 🔶 WIP  
> **Monetization:** 🟡 Cost tracking only  
> **Est. Y1 Revenue:** N/A (consolidate with Full-Core)

---

## Overview
"Sacred Core" enterprise AI marketing platform — near-identical to CoreDNA2-work and Full-Core. Campaign management, lead scoring, brand DNA, image/video gen, A/B testing, SSO, sonic branding. Has Docker + CI/CD + Fastify backend.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Zustand, Lucide
- **Backend:** Fastify, 77 services
- **Database:** Supabase
- **AI/ML:** Google Gemini
- **DevOps:** Docker, GitHub Actions CI/CD, Sentry, Concurrently

## Monetization Analysis
### Current Revenue Mechanisms
- Affiliate system, cost tracking service, quota management
- Integration marketplace (planned)

### Recommended Revenue Model
**Do not launch separately** — consolidate into Full-Core.

## Verdict
Third variant of Sacred Core with best DevOps setup (Docker/CI). Merge CI/CD pipeline into Full-Core repo. ⭐⭐ (2/5 standalone)
