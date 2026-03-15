# AICouncil Web UI

Custom Venice-themed frontend built on OpenWebUI.

## Features (Phases)

### Phase 1 ✓
- [ ] Basic chat interface
- [ ] Connection to LiteLLM proxy

### Phase 2 (Task 4-7)
- [ ] Venice color palette & styling
- [ ] Council Mode toggle (⚡)
- [ ] Consensus visualization (radar chart)
- [ ] Agent vote display

### Phase 3 (Task 8-10)
- [ ] RAG document upload UI
- [ ] Citation highlighting
- [ ] Flowise ritual builder embed
- [ ] Session archive links

### Phase 4 (Task 13-15)
- [ ] User authentication
- [ ] Cost tracking dashboard
- [ ] Session history & export

## Development

```bash
npm install
npm run dev
```

Visit: http://localhost:5173

## Build

```bash
npm run build
```

Output in `dist/`

## Testing

```bash
npm test
```

## Styling

Venice aesthetic:
- Primary: `#7C3AED` (Purple)
- Secondary: `#EC4899` (Pink)
- Dark: `#1F2937` (Charcoal)

Uses Tailwind CSS + shadcn/ui components (Phase 2).
