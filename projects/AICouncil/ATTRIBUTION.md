# Attribution & Licensing

AICouncil is built on the shoulders of excellent open-source projects. This document details all dependencies and their licensing requirements.

## Direct Dependencies

| Project | License | Link | Credit Text |
|---------|---------|------|-------------|
| OpenWebUI | MIT | https://github.com/open-webui/open-webui | Chat interface by OpenWebUI team |
| LiteLLM | MIT | https://github.com/BerriAI/litellm | API proxy by BerriAI |
| Ollama | MIT | https://github.com/ollama/ollama | Local model runtime by Ollama |
| jbino85/council | MIT | https://github.com/jbino85/Council | Epistemic deliberation engine by jbino85 |
| AnythingLLM | MIT | https://github.com/Mintplex-Labs/anything-llm | RAG system by Mintplex Labs |
| Flowise | Apache 2.0 | https://github.com/FlowiseAI/Flowise | Agent builder by FlowiseAI |
| Supabase | Apache 2.0 | https://github.com/supabase/supabase | Auth infrastructure by Supabase |
| shadcn/ui | MIT | https://github.com/shadcn-ui/ui | UI component library by shadcn |
| Tailwind CSS | MIT | https://github.com/tailwindlabs/tailwindcss | Styling framework |
| Bundlr | Apache 2.0 | https://bundlr.network | Data bundling service |
| Sui SDK | Apache 2.0 | https://github.com/MystenLabs/sui | On-chain provenance by Mysten Labs |
| Arweave | Apache 2.0 | https://github.com/ArweaveTeam/arweave | Permanent storage network |

## Transitive Dependencies

All transitive dependencies are included in `package-lock.json` and `poetry.lock` files. Full license compliance is automatically checked via:

```bash
npm audit --audit-level=moderate
pip-audit --skip-editable
```

## License Compliance

### MIT License Projects
The following projects use MIT licensing and require:
1. License text included in distributions
2. Copyright notice retained
3. No warranty provided

**AICouncil MIT components:**
- `apps/web/` (UI customizations)
- `services/council/` (wrapper around jbino85/council)
- `middleware/` (LiteLLM extensions)

### Apache 2.0 Projects
The following projects use Apache 2.0 licensing and require:
1. License text included in distributions
2. Copyright notice retained
3. Statement of modifications if changed
4. NOTICE file provided

**AICouncil Apache 2.0 components:**
- `services/archiver/` (Arweave integration)
- `services/nft-minter/` (Sui integration)
- `deploy/` (Akash SDL templates)

## Required Attribution Lines

These must appear in any distribution, deployment, or public-facing documentation:

```
AICouncil is built with:
- OpenWebUI (MIT) – Chat interface by OpenWebUI team
- LiteLLM (MIT) – API proxy by BerriAI
- Ollama (MIT) – Local model runtime by Ollama
- jbino85/council (MIT) – Epistemic engine by jbino85
- AnythingLLM (MIT) – RAG by Mintplex Labs
- Flowise (Apache 2.0) – Agent builder by FlowiseAI
- Sui SDK (Apache 2.0) – On-chain provenance by Mysten Labs
- Arweave (Apache 2.0) – Permanent storage
- Supabase (Apache 2.0) – Auth infrastructure
- shadcn/ui (MIT) – UI components by shadcn
```

## Deployment Attribution

When deploying AICouncil to production:

1. **Docker images** – Include LICENSE file in each container
2. **Kubernetes manifests** – Add ConfigMap with attribution
3. **Web UI** – Add `<footer>` with credit links
4. **API documentation** – List all dependencies
5. **Releases** – Include ATTRIBUTION.md in release artifacts

## Modifications & Forks

If you modify AICouncil:

1. **MIT components:** Retain copyright, describe changes
2. **Apache 2.0 components:** Add modification notice
3. **Dual-licensed parts:** Choose appropriate license
4. **New code:** Use same license as parent component

Example modification header:

```python
# Original: jbino85/council (MIT)
# Modified by: Your Name (2025)
# Changes: Added Venice API integration support
# License: MIT
```

## Third-Party Notices

Additional open-source components loaded at runtime:

### Models (via Ollama)
- **Llama 2** (MIT) – Meta
- **Mistral 7B** (Apache 2.0) – Mistral AI
- **Neural Chat** (Apache 2.0) – Intel
- **Orca** (Custom License) – Microsoft Research

### JavaScript/Python ecosystems
All npm and pip dependencies are licensed under permissive (MIT, Apache 2.0, BSD, etc.) or copyleft (GPL) licenses. GPL dependencies are listed separately:

```bash
# Check for GPL dependencies
npm list --depth=0 | grep -i gpl
pip list | grep -i gpl
```

Currently: **No GPL dependencies.**

## Questions?

If you have questions about licensing or attribution, please:

1. Open an issue: https://github.com/jbino85/AIcouncil/issues
2. Email: licensing@aicouncil.dev
3. Check `/docs/LICENSE_FAQ.md` for common questions

---

Last updated: 2025-12-03
