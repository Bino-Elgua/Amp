# AICouncil OpenWebUI

Beautiful, responsive web interface for the AICouncil blockchain consensus engine.

## Features

✅ **Modern Chat Interface**
- Clean, intuitive design
- Real-time message display
- Typing indicators
- Message timestamps

✅ **Blockchain Mode Toggle**
- Switch between regular and blockchain-backed deliberation
- Visual indicator of current mode
- Different styling for blockchain mode

✅ **Agent Control**
- Select number of agents (1-5)
- Quick agent count adjustment
- Visual feedback for current selection

✅ **Consensus Visualization**
- Real-time consensus scores
- Agent vote breakdown
- Confidence indicators
- Position display (agree/partial/disagree)

✅ **Blockchain Proof Display**
- On-chain transaction links
- Arweave archive integration
- Agent influence networks
- Decision summaries
- Full audit trail

✅ **Responsive Design**
- Works on desktop, tablet, mobile
- Optimized scrolling
- Touch-friendly controls
- Adaptive layout

✅ **Dark Theme**
- Eye-friendly colors
- Blockchain aesthetic
- High contrast
- Beautiful gradients

## Quick Start

### Prerequisites
- Node.js 16+
- npm 7+
- Council Service running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## Usage

### Regular Deliberation

1. Type your question or topic
2. Select number of agents (1-5)
3. Click "💬 Send" button
4. Wait for council consensus

### Blockchain Deliberation

1. Toggle "🧠 Blockchain Mode" on
2. Type your question or topic
3. Select number of agents (1-5)
4. Click "⛓️ Send" button
5. Wait for blockchain recording
6. View full proofs, explorer links, and Arweave archives

## Components

### Main Page (`src/routes/+page.svelte`)
- Chat interface
- Message display
- Input controls
- Mode toggle
- Agent selection
- Blockchain proof display

### BlockchainProofDisplay (`src/lib/BlockchainProofDisplay.svelte`)
- Consensus visualization
- Explorer links
- Agent votes
- Synapse network
- Arweave archives
- Decision summary

## Configuration

### API Endpoints

The app proxies API requests to the Council Service:
- `POST /api/council/deliberate` - Regular deliberation
- `POST /api/council/deliberate-blockchain` - Blockchain deliberation
- `GET /api/council/blockchain/status` - Check status
- `GET /api/council/blockchain/history` - Get history
- `GET /api/council/blockchain/agent-state/{id}` - Get agent state

### Proxy Settings

Edit `vite.config.js` to change API proxy:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',  // Change this
    changeOrigin: true
  }
}
```

## Styling

### Colors
- **Primary**: `#00d4ff` (Cyan)
- **Success**: `#00d400` (Green)
- **Error**: `#ff006e` (Red)
- **Background**: Dark gradients

### Themes
- Dark mode (default)
- Blockchain accent colors
- High contrast for readability

## Performance

- ⚡ Fast startup (<1s)
- 🎯 Smooth animations
- 📱 Optimized for mobile
- 🔄 Real-time updates

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### API Connection Issues
- Verify Council Service is running: `cd services/council && python3 main.py`
- Check API is available: `curl http://localhost:8000/health`
- Verify proxy settings in `vite.config.js`

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild: `npm run build`
- Check browser console for errors

### Message Not Appearing
- Check browser console for JavaScript errors
- Verify API response in Network tab
- Check Council Service logs

## Development

### Project Structure
```
apps/openwebui/
├── src/
│   ├── routes/
│   │   └── +page.svelte (Main chat interface)
│   └── lib/
│       └── BlockchainProofDisplay.svelte (Proof display)
├── svelte.config.js
├── vite.config.js
├── tsconfig.json
└── package.json
```

### Dependencies
- **Svelte 4**: UI framework
- **SvelteKit**: Full-stack framework
- **Vite**: Build tool

### Customization

#### Change Theme Colors
Edit `src/routes/+page.svelte` style section:
```css
--color-primary: #00d4ff;
--color-success: #00d400;
/* etc */
```

#### Add Custom Agents
Edit the agent selection in `+page.svelte`:
```svelte
let numAgents = 3;
const agentOptions = [1, 2, 3, 4, 5];
```

#### Modify Layout
Adjust CSS grid/flex in styles section

## Production Deployment

### Build
```bash
npm run build
```

### Deploy
```bash
# Using Node.js
npm run preview

# Using Docker
docker build -t aicouncil-ui .
docker run -p 3000:3000 aicouncil-ui
```

### Environment Variables
```bash
VITE_API_BASE=https://api.aicouncil.com
VITE_APP_NAME=AICouncil
```

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

## Performance Tips

1. Use `npm run build` for production
2. Enable gzip compression on server
3. Use CDN for static assets
4. Consider caching API responses

## License

Part of AICouncil project

## Support

- Issues: GitHub Issues
- Documentation: `/docs` folder
- API Docs: `http://localhost:8000/docs`

---

**Ready to use!** Start with `npm install && npm run dev`
