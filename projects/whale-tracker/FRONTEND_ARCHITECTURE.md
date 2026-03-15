# Whale Tracker Pro — Frontend Architecture & Components

## Tech Stack

```
Framework:    Next.js 14 (App Router)
Language:     TypeScript
Styling:      Tailwind CSS + CSS-in-JS
Charts:       TradingView Lightweight Charts + Recharts
Real-time:    WebSocket (Socket.io)
State:        Zustand + TanStack Query
UI Library:   Radix UI / Headless UI
Icons:        Lucide React / Heroicons
Animation:    Framer Motion
```

## Project Structure

```
whale-tracker-pro/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard layout
│   │   ├── page.tsx                # Home/Overview
│   │   ├── live-feed/
│   │   │   └── page.tsx            # Real-time whale transactions
│   │   ├── signals/
│   │   │   └── page.tsx            # AI signal generation
│   │   ├── whales/
│   │   │   ├── page.tsx            # Whale intelligence database
│   │   │   └── [address]/          # Individual whale detail
│   │   ├── portfolio/
│   │   │   └── page.tsx            # Your tracked whales
│   │   ├── backtest/
│   │   │   └── page.tsx            # Historical signal testing
│   │   ├── alerts/
│   │   │   └── page.tsx            # Alert customization
│   │   └── settings/
│   │       └── page.tsx            # User preferences
│   ├── auth/
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/               # OAuth callback
│   ├── api/
│   │   ├── whales/                 # Whale data API
│   │   ├── signals/                # Signal generation API
│   │   ├── transactions/           # Transaction feed API
│   │   ├── portfolios/             # Portfolio tracking API
│   │   ├── backtest/               # Backtesting API
│   │   └── webhooks/               # Discord/Telegram webhooks
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
│
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx          # Top nav + sidebar
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   │
│   ├── dashboard/
│   │   ├── StatCard.tsx            # KPI cards
│   │   ├── WhaleChart.tsx          # Whale net flow chart
│   │   ├── SignalMetrics.tsx       # Signal performance
│   │   └── QuickStats.tsx          # 24h metrics
│   │
│   ├── feed/
│   │   ├── TransactionFeed.tsx     # Real-time list
│   │   ├── TransactionCard.tsx     # Individual transaction
│   │   ├── SignalBadge.tsx         # Accumulation/Distribution badge
│   │   └── FeedFilters.tsx         # Filter controls
│   │
│   ├── signals/
│   │   ├── SignalList.tsx          # All active signals
│   │   ├── SignalCard.tsx          # Individual signal detail
│   │   ├── SignalChart.tsx         # Historical signal performance
│   │   ├── ConfidenceMeter.tsx     # ML confidence indicator
│   │   └── ImpactPrediction.tsx    # Market impact visualization
│   │
│   ├── whales/
│   │   ├── WhaleDatabase.tsx       # Searchable whale list
│   │   ├── WhaleCard.tsx           # Whale profile card
│   │   ├── HoldingsTable.tsx       # Asset breakdown
│   │   ├── PerformanceChart.tsx    # Historical trades
│   │   └── FollowButton.tsx        # Add to portfolio
│   │
│   ├── portfolio/
│   │   ├── PortfolioOverview.tsx   # Your tracked whales
│   │   ├── PortfolioChart.tsx      # Net worth over time
│   │   ├── WhalePosition.tsx       # Individual whale tracking
│   │   └── AlertTimeline.tsx       # When they moved
│   │
│   ├── backtest/
│   │   ├── BacktestSetup.tsx       # Configuration
│   │   ├── BacktestResults.tsx     # Historical performance
│   │   ├── BacktestChart.tsx       # P&L over time
│   │   └── BacktestStats.tsx       # Win rate, Sharpe, etc.
│   │
│   ├── charts/
│   │   ├── WhaleNetFlow.tsx        # Inflow/outflow
│   │   ├── SignalPerformance.tsx   # Win rate chart
│   │   ├── PriceWithSignals.tsx    # Price + signal overlay
│   │   ├── HeatmapChart.tsx        # Whale activity heatmap
│   │   └── CorrelationMatrix.tsx   # Whale correlation
│   │
│   ├── alerts/
│   │   ├── AlertSettings.tsx       # Notification preferences
│   │   ├── AlertHistory.tsx        # Past alerts received
│   │   ├── AlertTest.tsx           # Send test alert
│   │   └── ChannelConfig.tsx       # Discord/Telegram setup
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── AuthProvider.tsx
│   │
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Loading.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── NotFound.tsx
│   │
│   └── icons/
│       ├── WhaleSVG.tsx
│       ├── SignalSVG.tsx
│       └── [other custom icons]
│
├── hooks/
│   ├── useWhales.ts               # Fetch whale data
│   ├── useSignals.ts              # Fetch AI signals
│   ├── useTransactions.ts         # Real-time transaction stream
│   ├── usePortfolio.ts            # User portfolio tracking
│   ├── useBacktest.ts             # Backtesting
│   ├── useAuth.ts                 # Authentication
│   ├── useWebSocket.ts            # Real-time updates
│   └── useLocalStorage.ts         # Client-side persistence
│
├── lib/
│   ├── api.ts                     # API client (axios/fetch)
│   ├── websocket.ts               # WebSocket connection
│   ├── formatter.ts               # Format numbers/dates
│   ├── colors.ts                  # Signal/metric colors
│   ├── constants.ts               # App constants
│   └── utils.ts                   # Helper functions
│
├── store/
│   ├── authStore.ts               # Auth state (Zustand)
│   ├── whaleStore.ts              # Whale data cache
│   ├── signalStore.ts             # Signal cache
│   ├── alertStore.ts              # Alert settings
│   └── preferencesStore.ts        # User preferences
│
├── types/
│   ├── whale.ts                   # Whale types
│   ├── signal.ts                  # Signal types
│   ├── transaction.ts             # Transaction types
│   ├── api.ts                     # API response types
│   └── common.ts                  # Common types
│
├── styles/
│   ├── globals.css                # Global styles
│   ├── variables.css              # CSS variables
│   └── animations.css             # Animations
│
├── public/
│   ├── images/
│   ├── icons/
│   └── data/
│
├── .env.local                     # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## Key Pages

### 1. Dashboard (Home)
**URL:** `/`  
**Purpose:** Overview of all whale activity + your key metrics

**Layout:**
```
┌─ Navigation ────────────────────────────────────────────┐
│                                                         │
├─ Dashboard ─────────────────────────────────────────────┤
│                                                         │
│  📊 KEY METRICS (Top)                                  │
│  ├─ Active Whales: 2,483                              │
│  ├─ Signals Today: 47 (73% accurate)                  │
│  ├─ Total Volume: $4.2B                               │
│  └─ Largest Transaction: $85M (2 min ago)             │
│                                                         │
│  🐋 WHALE NET FLOW CHART (Center - Large)            │
│  └─ [Real-time line chart - inflow vs outflow]        │
│                                                         │
│  📈 SIGNAL PERFORMANCE (Bottom Left)                   │
│  ├─ Win Rate: 73%                                     │
│  ├─ Avg Confidence: 82%                               │
│  └─ [Small chart]                                     │
│                                                         │
│  🎪 TOP SIGNALS (Bottom Right)                         │
│  ├─ 1. Distribution signal - ETH (89% conf)          │
│  ├─ 2. Accumulation signal - BTC (85% conf)          │
│  └─ [See all]                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2. Live Feed
**URL:** `/live-feed`  
**Purpose:** Real-time whale transactions with ML signal generation

**Layout:**
```
┌─ Filters ────────────────────────────────────────────────┐
│ Min Value: [slider] | Chains: [multi-select] | Sort: ▼  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 🔴 [2 seconds ago] DISTRIBUTION Signal                  │
│    $12.5M (6,000 ETH)                                   │
│    0x1234...→ Binance                                   │
│    Confidence: 87% | Impact: -2.1%                      │
│    [View Whale] [Add to Portfolio]                      │
│                                                          │
│ 🟢 [45 seconds ago] ACCUMULATION Signal                 │
│    $8.3M (4,000 ETH)                                    │
│    0x5678...→ 0xabcd...                                 │
│    Confidence: 79% | Impact: +1.8%                      │
│    [View Whale] [Add to Portfolio]                      │
│                                                          │
│ 🟠 [2 minutes ago] WHALE CLUSTERING Signal              │
│    3 whales buying $25M total                           │
│    Synchronized accumulation pattern                     │
│    Confidence: 91% | Combined Impact: +3.2%            │
│    [View All] [Add All to Portfolio]                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 3. Signals
**URL:** `/signals`  
**Purpose:** AI-generated signals with backtesting

**Layout:**
```
┌─ Signal Explorer ────────────────────────────────────────┐
│ Type: [All/Accumulation/Distribution] | Chain: Ethereum │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ SIGNAL #2847                                            │
│ ├─ Type: DISTRIBUTION                                  │
│ ├─ Confidence: 89%                                     │
│ ├─ Asset: ETH                                          │
│ ├─ Amount: $45M (21,635 ETH)                           │
│ ├─ Whale: 0x1234... (Pantera Capital)                  │
│ │   Win Rate: 72% | Historical Accuracy: +650%        │
│ ├─ Similar Patterns: 12 found                          │
│ │   ├─ Pattern 1 (Apr 2024): -2.8% impact             │
│ │   ├─ Pattern 2 (Jul 2023): -1.5% impact             │
│ │   └─ Avg Pattern Result: -2.1%                       │
│ ├─ Current Market Impact Prediction: -2.1%            │
│ ├─ Recommendation: SELL (take profits)                 │
│ └─ [View on Chain] [Backtest] [Add Alert]             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4. Whales (Intelligence Database)
**URL:** `/whales`  
**Purpose:** Searchable database of 5,000+ major whales

**Layout:**
```
┌─ Whale Search ──────────────────────────────────────────┐
│ [Search whale name/address] [Category filter ▼]        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 1. MicroStrategy          🏢 $12.5B AUM                │
│    Category: Company | Win Rate: 87% | Holdings: BTC  │
│    Recent: Accumulating BTC since 2020                 │
│    [VIEW PROFILE]                                       │
│                                                          │
│ 2. Pantera Capital        🏦 $3.2B AUM                 │
│    Category: VC Fund | Win Rate: 72% | Holdings: Mixed│
│    Recent: Taking profits on ETH (Jan 2025)            │
│    [VIEW PROFILE]                                       │
│                                                          │
│ 3. 0x123456...            👤 $450M AUM                 │
│    Category: Unknown | Win Rate: 68%                   │
│    Holdings: ETH, UNI, LINK                            │
│    [VIEW PROFILE]                                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 5. Individual Whale Profile
**URL:** `/whales/[address]`

**Layout:**
```
┌─ Whale: MicroStrategy ──────────────────────────────────┐
│                                                         │
│ 🏢 MicroStrategy Inc.           Follow ✓ | Actions ▼  │
│ Category: Company | Founded: 2014                      │
│ Official: https://microstrategy.com                    │
│                                                         │
│ 📊 PORTFOLIO METRICS                                   │
│ ├─ Total Assets: $12.5B                                │
│ ├─ Holdings: BTC ($8.2B), USDC ($3.1B), Other ($1.2B) │
│ ├─ Average Cost (BTC): $21,480                         │
│ ├─ Unrealized Gain: +89%                               │
│ └─ Win Rate: 87% (historical)                          │
│                                                         │
│ 📈 TRADING HISTORY                                     │
│ ├─ Trades Analyzed: 47                                 │
│ ├─ Avg Hold Time: 11.3 months                          │
│ ├─ Best Trade: +450% (BTC 2020-2021)                  │
│ ├─ Worst Trade: -8% (TSLA position)                    │
│ └─ Sharpe Ratio: 2.1                                   │
│                                                         │
│ 💹 RECENT ACTIVITY (Last 30 days)                      │
│ ├─ Jan 28: Bought $50M more BTC (accumulation)        │
│ ├─ Jan 20: Hodling (no activity)                       │
│ └─ Jan 15: Acquired $100M BTC                          │
│                                                         │
│ 📉 HOLDINGS BREAKDOWN                                  │
│ ├─ BTC: $8.2B (65.6%) - Unrealized: +95%              │
│ ├─ USDC: $3.1B (24.8%) - Reserves                      │
│ ├─ ETH: $800M (6.4%) - Unrealized: +45%                │
│ └─ Other: $400M (3.2%)                                 │
│                                                         │
│ [BACKTEST - What if you copied this whale?]           │
│ [ADD TO PORTFOLIO]                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 6. Portfolio (Tracked Whales)
**URL:** `/portfolio`  
**Purpose:** Track your followed whales in real-time

**Layout:**
```
┌─ Your Whale Portfolio ──────────────────────────────────┐
│                                                         │
│ 📊 PORTFOLIO SUMMARY                                   │
│ ├─ Tracked Whales: 8                                   │
│ ├─ Total Tracked AUM: $45.2B                           │
│ ├─ If You Followed All: +$2.1M (in 6 months)          │
│ └─ Average Win Rate: 74%                               │
│                                                         │
│ 🐋 WHALE POSITIONS                                     │
│                                                         │
│ [1] MicroStrategy - $12.5B AUM                        │
│     Status: 🟢 ACCUMULATING BTC                        │
│     24h Change: +$50M (+0.4%)                          │
│     Your Copycat P&L: +$250k (theoretical)             │
│     Next Move Prediction: More BTC in 2-3 weeks       │
│                                                         │
│ [2] Pantera Capital - $3.2B AUM                        │
│     Status: 🔴 DISTRIBUTING ETH                        │
│     24h Change: -$45M (-1.4%)                          │
│     Your Copycat P&L: -$180k (if you mirrored)        │
│     Alert: Selling pressure expected                   │
│                                                         │
│ [3] 0x123456... - $450M AUM                            │
│     Status: 🟡 MIXED (rebalancing)                     │
│     24h Change: +$5M (+1.1%)                           │
│     Your Copycat P&L: +$45k                            │
│                                                         │
│ ...                                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7. Backtest Engine
**URL:** `/backtest`  
**Purpose:** Historical signal testing

**Layout:**
```
┌─ Backtest Wizard ───────────────────────────────────────┐
│                                                         │
│ STEP 1: Select Whale                                   │
│ [Search/Select: MicroStrategy]                         │
│                                                         │
│ STEP 2: Time Period                                    │
│ From: [Jan 1, 2024]  To: [Jan 31, 2025]              │
│                                                         │
│ STEP 3: Copy Strategy                                  │
│ ○ Copy all trades       ○ Copy only BUY signals       │
│ ○ Copy only SELL signals                              │
│                                                         │
│ [RUN BACKTEST]                                         │
│                                                         │
├─ BACKTEST RESULTS ──────────────────────────────────────┤
│                                                         │
│ Starting Capital: $10,000                              │
│ Final Value: $18,900                                   │
│ Total Return: +89%                                     │
│                                                         │
│ 📊 METRICS                                             │
│ ├─ Win Rate: 78%                                       │
│ ├─ Avg Win: +12.5%                                     │
│ ├─ Avg Loss: -3.2%                                     │
│ ├─ Profit Factor: 2.1                                  │
│ ├─ Sharpe Ratio: 1.8                                   │
│ ├─ Max Drawdown: -18%                                  │
│ └─ Trades: 47                                          │
│                                                         │
│ 📈 P&L CHART (over time)                               │
│ [Large equity curve visualization]                     │
│                                                         │
│ 📋 TOP TRADES                                          │
│ ├─ Best: +320% (Mar 2024 BTC)                          │
│ ├─ 2nd: +145% (Jun 2024 ETH)                           │
│ └─ Worst: -8% (Jul 2024 position)                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Component Examples

### WhaleChart Component
```typescript
// components/charts/WhaleNetFlow.tsx

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSignals } from '@/hooks/useSignals';

export function WhaleNetFlow() {
  const { signals, isLoading } = useSignals();
  
  const data = signals.map(s => ({
    timestamp: s.timestamp,
    inflow: s.type === 'ACCUMULATION' ? s.amount : 0,
    outflow: s.type === 'DISTRIBUTION' ? s.amount : 0,
    netFlow: s.type === 'ACCUMULATION' ? s.amount : -s.amount,
  }));
  
  return (
    <div className="w-full h-96 bg-gray-900 p-4 rounded-lg">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="netFlow" stroke="#10b981" />
      </LineChart>
    </div>
  );
}
```

### SignalCard Component
```typescript
// components/signals/SignalCard.tsx

interface SignalCardProps {
  signal: Signal;
  onBacktest: () => void;
  onAddAlert: () => void;
}

export function SignalCard({ signal, onBacktest, onAddAlert }: SignalCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-600">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <SignalBadge type={signal.type} />
            <h3 className="text-lg font-bold">{signal.asset}</h3>
            <ConfidenceMeter confidence={signal.confidence} />
          </div>
          <p className="text-sm text-gray-400 mt-1">{signal.whaleLabel}</p>
        </div>
        <p className="text-xl font-bold">${(signal.amount / 1e6).toFixed(1)}M</p>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
        <div>
          <p className="text-gray-400">Historical Win Rate</p>
          <p className="text-green-400 font-bold">+{signal.whaleWinRate}%</p>
        </div>
        <div>
          <p className="text-gray-400">Predicted Impact</p>
          <p className={signal.impact > 0 ? 'text-green-400' : 'text-red-400'}>
            {signal.impact > 0 ? '+' : ''}{signal.impact.toFixed(1)}%
          </p>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <button onClick={onBacktest} className="btn-secondary flex-1">
          Backtest
        </button>
        <button onClick={onAddAlert} className="btn-primary flex-1">
          Alert
        </button>
      </div>
    </div>
  );
}
```

## Design System

### Colors (Crypto Native)
```css
/* Signals */
--signal-buy: #10b981 (Accumulation - Green)
--signal-sell: #ef4444 (Distribution - Red)
--signal-neutral: #f59e0b (Clustering - Orange)

/* Chart Colors */
--chart-inflow: #10b981
--chart-outflow: #ef4444
--chart-background: #111827

/* Confidence */
--confidence-high: #10b981 (80-100%)
--confidence-medium: #f59e0b (50-80%)
--confidence-low: #ef4444 (<50%)

/* Background */
--bg-primary: #0f172a (Dark navy)
--bg-secondary: #1e293b
--bg-tertiary: #334155
--text-primary: #f1f5f9
--text-secondary: #cbd5e1
```

### Typography
```css
/* Headings */
h1: 28px, bold, #f1f5f9
h2: 24px, bold, #f1f5f9
h3: 20px, semibold, #f1f5f9
h4: 18px, semibold, #cbd5e1

/* Body */
body: 16px, normal, #cbd5e1
small: 14px, normal, #94a3b8
tiny: 12px, normal, #64748b
```

## Real-Time Updates

### WebSocket Connection
```typescript
// hooks/useWebSocket.ts

export function useWebSocket(url: string, onMessage: (data: any) => void) {
  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    return () => ws.close();
  }, [url, onMessage]);
}

// Usage in component:
useWebSocket('wss://api.whaltracker.pro/live', (tx) => {
  console.log('New whale transaction:', tx);
  // Update UI with new transaction
});
```

---

**Ready to build the frontend?** This will be the most beautiful whale tracking platform ever built.
