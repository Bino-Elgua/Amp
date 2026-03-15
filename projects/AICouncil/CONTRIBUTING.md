# Contributing to AICouncil

Thank you for considering contributing to AICouncil! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors.

**Be respectful, kind, and professional in all interactions.**

Harassment, discrimination, or disruptive behavior will not be tolerated.

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Git

### Development Setup

```bash
# Clone the repository
git clone https://github.com/jbino85/AIcouncil.git
cd AIcouncil

# Create a development branch
git checkout -b feature/your-feature-name

# Install dependencies (both Node and Python)
npm install
pip install -e .

# Copy environment template
cp .env.example .env.local

# Start development stack
docker compose -f docker-compose.dev.yml up
```

## Workflow

### 1. Find or Create an Issue

- Check the [Issues](https://github.com/jbino85/AIcouncil/issues) tab
- Comment if you'd like to work on an issue
- Create a new issue if your contribution doesn't fit existing ones

### 2. Create a Feature Branch

```bash
git checkout -b feature/descriptive-name
# or
git checkout -b fix/bug-description
# or
git checkout -b docs/update-description
```

Branch naming conventions:
- `feature/` – New functionality
- `fix/` – Bug fixes
- `docs/` – Documentation updates
- `refactor/` – Code refactoring
- `test/` – Test additions
- `chore/` – Build, dependencies, etc.

### 3. Make Your Changes

Follow these guidelines:

#### Code Style

**JavaScript/TypeScript:**
```bash
npm run lint
npm run format
```

**Python:**
```bash
black services/
flake8 services/
mypy services/
```

#### Testing

Add tests for new features:

```bash
# JavaScript
npm test

# Python
pytest services/ -v
```

Coverage target: **80%+**

#### Commits

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add council consensus visualization"
git commit -m "fix: resolve LiteLLM timeout issue"
git commit -m "docs: update Venice API integration guide"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (no logic change)
- `refactor:` Code refactoring
- `test:` Test additions
- `chore:` Build, deps, CI

### 4. Push and Create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a PR on GitHub:

1. **Title:** Clear, concise (use conventional commits format)
2. **Description:** Explain the change, why it matters, how to test it
3. **Linked Issues:** Reference related issues with `Closes #123`
4. **Screenshots/Videos:** If UI changes, show before/after

#### PR Checklist

- [ ] Code follows style guidelines (`npm run lint` passes)
- [ ] Tests added/updated (coverage ≥80%)
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Commits are clear and squashed
- [ ] Attribution updated if using external code
- [ ] Licenses compatible (MIT/Apache 2.0 preferred)

### 5. Code Review

A maintainer will review your PR:
- Provide constructive feedback
- Request changes if needed
- Approve and merge when ready

Once merged, your changes will be included in the next release.

## Architecture & Areas

### High Priority Areas (Immediate Help Needed)

- **Task 3:** Venice API integration (`services/litellm/`)
- **Task 6:** Council FastAPI service (`services/council/`)
- **Task 7:** Council button UI (`apps/web/`)

### Contribution Areas

| Area | Path | Language | Level |
|------|------|----------|-------|
| OpenWebUI theming | `apps/web/` | TypeScript/React | Medium |
| LiteLLM middleware | `middleware/` | Python | Advanced |
| Council service | `services/council/` | Python/FastAPI | Advanced |
| RAG integration | `services/anything-llm/` | JavaScript/Python | Advanced |
| On-chain minting | `services/nft-minter/` | TypeScript/Move | Expert |
| Guardrails | `middleware/refusal.py` | Python | Medium |
| Documentation | `docs/` | Markdown | Beginner |

## Testing

### Unit Tests

```bash
# JavaScript
npm test -- --coverage

# Python
pytest services/ -v --cov=services/
```

### Integration Tests

```bash
# Start test stack
docker compose -f docker-compose.test.yml up

# Run tests
npm run test:integration
pytest tests/integration/ -v
```

### Manual Testing

1. Start the development stack
2. Verify features work as expected
3. Test edge cases and error handling
4. Check API responses with `curl` or Postman

## Documentation

For new features, update:

1. **README.md** – Add feature overview
2. **Relevant guide in `/docs`** – Deep dive
3. **API docs** – If adding endpoints
4. **Configuration docs** – If adding env vars

Example structure:

```markdown
## Feature Name

**What it does:**
[One sentence]

**How to use:**
[Code example]

**Configuration:**
[Required env vars]

**Troubleshooting:**
[Common issues & solutions]
```

## Licensing

By contributing, you agree that:

1. Your code is licensed under the **same license as the component** (MIT or Apache 2.0)
2. You own the rights to the code you're contributing
3. You grant AICouncil a perpetual license to use and distribute it

If using external code:
- Include license headers in files
- Update `ATTRIBUTION.md`
- Ensure compatible licensing (MIT/Apache 2.0 preferred)

## Questions?

- **Discussions:** GitHub Discussions tab
- **Discord:** Join our community channel
- **Issues:** Open an issue and tag `@question`
- **Email:** contribute@aicouncil.dev

---

**Thank you for helping build AICouncil!** 🙏
