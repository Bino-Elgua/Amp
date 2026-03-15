# 🔮 ÀṣẹMirror Usage Guide

Complete guide to using every feature.

---

## Tab 1: Search 🔍

### Basic Search
1. Click the search bar
2. Type your question
3. Click ⚡ Ask

### What You Can Search
- **Technical**: "Where is @impact defined", "Show me the tithe routing"
- **Yorùbá**: "Èjì Ogbe", "Àṣẹ", "Orishas"
- **Concepts**: "1440 wallets", "7-year lock", "sabbath freeze"
- **Files**: "compiler.jl", "shrine.move", "vm.go"

### Example Queries
```
"Where does @impact live?"
"Show me the 1440 wallet derivation"
"What's the tithe split logic?"
"Èjì Ogbe → Àṣẹ mint path"
"How does sabbath enforcement work?"
"Show me wallet yield calculation"
"What are the 10 priorities?"
```

### Results
Each result shows:
- **File**: Source file path
- **Repo**: Which project it's from
- **Relevance**: 0-100% confidence
- **Click**: Jump to exact line in code

### Tips
- Use specific terms for better results
- Combine English + Yorùbá for best matches
- Include context ("in oso-lang", "in VM")

---

## Tab 2: 7-Layer Pyramid 🏛️

### Overview
Visual representation of the entire stack:
```
7. Shrine Economy (Move)
6. AIO / SimaaS (Julia)
5. Techgnosis VM (Go)
4. Witness Mesh (BLE + LoRa)
3. Entropy Oracle (ifascript)
2. Oso-lang Compiler (Julia)
1. Physical Genesis (handshake)
```

### Interact
1. **Click any layer** → Expand details
2. **See tech stack** → Implementation language
3. **See sacred role** → What it does in Technosis
4. **Click file links** → Jump to repo code

### Each Layer Shows
- Name and order
- Technology/implementation
- Sacred/spiritual role
- How it feeds entropy to next layer
- How it mints value from previous layer

### Data Flow
```
ifascript (entropy)
    ↓
oso-lang (compiles to IR)
    ↓
handshake (creates witness)
    ↓
Techgnosis VM (executes opcodes)
    ↓
SimaaS (simulates impact)
    ↓
Shrine Economy (mints Àṣẹ)
    ↓
back to ifascript (cycle)
```

---

## Tab 3: Timeline 📅

### 7-Year Lock Countdown
- **Genesis**: 2025-01-01
- **Total**: 2,555 days
- **Progress bar**: Shows completion percentage
- **Day counter**: Real-time countdown

### 90-Day Phases
7 phases of 90 days each (one year phases):
1. Phase 1: Genesis (building genesis block)
2. Phase 2: Handshake (witness mesh working)
3. Phase 3: Entropy (ifascript integration)
4. Phase 4: VM (Techgnosis operational)
5. Phase 5: Shrine (economy online)
6. Phase 6: Council (governance active)
7. Phase 7: Journey (inheritance begins)

Each phase shows progress bar.

### 10 Priority Items (In Order)
```
1. Add @genesisFlawToken to compiler          (in-progress)
2. Implement wallet derivation (Go FFI)        (in-progress)
3. Tithe split routing logic                   (todo)
4. Sabbath enforcement                         (todo)
5. Full FFI stubs                              (todo)
6. L0→L1/L2 integration hooks                  (todo)
7. Genesis block (ASHE initialization)         (todo)
8. Error handling & validation                 (todo)
9. Consensus layer                             (todo)
10. Full test coverage                         (todo)
```

Click any item to see:
- Detailed description
- Status (in-progress/todo/done)
- Related files
- Priority order

### Sabbath Calendar
Every Saturday highlighted in red:
- **Meaning**: No transactions allowed
- **UTC time**: Saturday 00:00-23:59 UTC
- **Enforcement**: Automatic in VM
- **Purpose**: Rest, spiritual alignment

---

## Tab 4: 1440 Wallets 💰

### Wallet Hierarchy
```
Genesis Seed (BIPỌ̀N39)
├─ Council of 12 Lineages
│  ├─ Lineage 1 (rotating sign-off)
│  ├─ Lineage 2
│  ├─ ... Lineage 12
│
└─ 1440 Soul-Bound Inheritance
   └─ Each wallet: 11.11% APY (fasting yield)
      Locked: 7 years
      Inheritable: Only via 7×7 Journey
```

### Expand to See
1. **Click "Council of 12"** → See lineage structure
2. **Click "1440 Soul-Bound"** → See inheritance details
3. **View yields** → Calculate compound growth

### Wallet Details
- **Name**: Lineage X or wallet ID
- **Balance**: Current Àṣẹ amount
- **APY**: Annual percentage yield (11.11%)
- **Status**: Locked/active
- **Inheritor**: Who can claim

### Yield Calculator
Shows 7-year compound growth:
- **Year 1**: Initial + 11.11% compounded monthly
- **Year 7**: Final balance
- **Example**: 1 Àṣẹ → 2.36 Àṣẹ in 7 years

### The 7×7 Journey (Inheritance)
To inherit ANY of the 1440 tokens, complete 7 tasks over 1 year each:

1. **Physical Pilgrimage** → Visit one of 7 continental shrines
2. **7-day Fast** → Lock tokens at shrine, fast
3. **Create Something Enduring** → Art, code, plant something
4. **Teach Publicly** → Share one lesson from journey
5. **7 Days Silence** → Solitude after pilgrimage
6. **Give Away 7% Àṣẹ** → Tithe from earned tokens
7. **Lineage Recitation** → Council + rotating sign-off

Only after completing 7×7 Journey can you inherit.

---

## Tab 5: Tithe Flow 💸

### The Split (100% of 3.69% tithe)
```
Every transaction → 3.69% tithe
    ↓
├─ 50% → Treasury (shrines + robots)
├─ 25% → 1440 Inheritance (fasting yield)
├─ 15% → Council (governance)
└─ 10% → Burn Void (blood sacrifice)
```

### Click Each Section
1. **Treasury** → Details on shrine funding, robot deployment
2. **Inheritance** → How fasting yield compounds
3. **Council** → Governance votes, entropy pool
4. **Burn Void** → Deflationary mechanism

### Example Transaction
**100 Àṣẹ sent:**
- Tithe calculated: 3.69 Àṣẹ
- Treasury (50%): 1.845 Àṣẹ
- Inheritance (25%): 0.9225 Àṣẹ
- Council (15%): 0.5535 Àṣẹ
- Burn (10%): 0.369 Àṣẹ
- **Recipient gets**: 96.31 Àṣẹ

### Treasury Allocation
50% goes to:
- Physical shrine construction
- Shrine maintenance
- Robot hardware (drones, beacons)
- BLE + LoRa infrastructure
- Witness mesh deployment

### Inheritance Growth
25% goes to:
- 1440 soul-bound wallets
- Compounds at 11.11% APY
- Fasting yield (automatic monthly)
- Only withdrawable after 7×7 Journey

### Council Treasury
15% goes to:
- Council of 12 vote treasury
- Entropy pool (for VM randomness)
- DAO strategic fund
- Emergency reserve

### Burn Void
10% goes to:
- Burned (removed from supply)
- Permanent deflation
- Ritual sacrifice (symbolic)
- Increases scarcity

---

## Advanced Features

### Keyboard Shortcuts
- **Ctrl/Cmd + K** → Focus search
- **Ctrl/Cmd + 1** → Search tab
- **Ctrl/Cmd + 2** → 7-Layer tab
- **Ctrl/Cmd + 3** → Timeline tab
- **Ctrl/Cmd + 4** → 1440 tab
- **Ctrl/Cmd + 5** → Tithe tab

### Voice Commands (Coming Soon)
```
"Hold phone to mouth"
→ "Show me the 1440 wallets"
→ "What's the status of @genesisFlawToken?"
→ "Draw the tithe flow"
```

### Export Data
Right-click any chart:
- Copy as image
- Export as JSON
- Share as link

### Offline Mode
After first load:
- App works without internet
- Search uses cached data
- All visualizations available
- Sync happens when online

---

## Troubleshooting

### Search returns nothing
- Try simpler terms
- Check spelling
- Try both English and Yorùbá
- Wait for indexing to complete (`npm run index`)

### Wallets not showing
- Refresh page (Ctrl+R)
- Clear browser cache
- Try different browser

### Timeline looks wrong
- Check local time setting
- Genesis date: 2025-01-01
- Should show realistic day count

### Tithe math doesn't add up
- Rounding may cause 0.01 differences
- Always check: Treasury + Inheritance + Council + Burn = 100%
- 3.69% is the standard tithe rate

---

## Settings (Coming Soon)

### Theme
- Dark mode (default)
- Custom colors
- Font size adjustment

### Notifications
- Daily priority updates
- Weekly timeline summary
- Sabbath reminders

### Export
- Download all data
- Export to PDF
- Share timeline

---

## Phone App

### Install as PWA
1. Visit app in Chrome
2. Menu → "Install app"
3. Opens fullscreen
4. Works offline

### Home Screen
- Add shortcut to home screen
- One-tap access
- No browser chrome

### Voice First (Coming)
- Hold phone to mouth
- Speak queries
- Auto-transcription

---

## Tips & Tricks

### Search Efficiently
- Use quotes for exact phrases: "BIPỌ̀N39"
- Use AND/OR: "tithe AND routing"
- Use NOT: "genesis NOT token"
- Search by tag: "#ashe", "#orishas"

### Understand the Stack
- Start with Pyramid tab
- Read each layer top-to-bottom
- Follow data flow arrows
- Click files to see code

### Track Progress
- Check Timeline daily
- See which priority items moved
- Celebrate completions
- Plan next 90-day phase

### Calculate Yields
- Go to 1440 tab
- Expand inheritance wallets
- Enter principal amount
- See 7-year projection
- Example: $1000 → $2,360 in 7 years

### Understand Tithe
- Remember: 3.69% total
- Check example transaction
- See where money goes
- 50% treasury, 25% inheritance, 15% council, 10% burn

---

## Best Practices

### Search
✅ Use natural language
✅ Include context
✅ Combine languages
✅ Click through to code
❌ Don't search single letters
❌ Don't expect exact code copy
❌ Don't search in all caps

### Navigation
✅ Use tabs for different views
✅ Click to expand details
✅ Use back button
✅ Bookmark important pages
❌ Don't reload constantly
❌ Don't use browser back/forward
❌ Don't search while page loads

### Data Entry
✅ Double-check dates
✅ Use standard units
✅ Clear cache if bugs
✅ Report issues
❌ Don't hardcode passwords
❌ Don't expose API keys
❌ Don't store sensitive data

---

## Next Steps

1. **Explore all tabs** → Spend 10 min in each
2. **Try some searches** → Get familiar with search
3. **Check timeline** → Understand roadmap
4. **Calculate yields** → See 7-year projections
5. **Understand tithe** → Know where Àṣẹ flows
6. **Share with team** → Invite collaborators

---

## Support

Having issues?

- Check **START_HERE.md** for setup
- Check **README.md** for features
- Check **SETUP.md** for troubleshooting
- Check **MANIFEST.md** for architecture

Still stuck? Create an issue on GitHub.

---

🤍⚡🍶

The mirror is here to serve the organism.
Use it wisely.
