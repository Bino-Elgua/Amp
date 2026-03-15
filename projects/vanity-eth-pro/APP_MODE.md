# 🔮 ÀṣẹMirror App — Zero Config Launch

**The easiest way to run ÀṣẹMirror as a standalone app.**

No `.env` files to edit. No API key copying. Everything in the app.

---

## 🚀 Launch In 1 Command

```bash
cd /data/data/com.termux/files/home/aśẹmirror
bash RUN.sh
```

That's it. The app opens on **localhost:1111**.

---

## ⚙️ First Time Setup (In the App)

When you launch for the first time, you'll see a **Configure ÀṣẹMirror** modal:

1. **Choose your LLM provider** (dropdown)
   - OpenAI (GPT-4o) - Most powerful
   - Claude (Anthropic) - Best reasoning
   - Gemini (Google) - Free tier, cheapest
   - Mistral - Privacy-friendly
   - Groq - Fastest, free tier
   - Cohere - Enterprise

2. **Paste your API key** (the modal shows where to get it)

3. **Configure Qdrant URL** (defaults to localhost:6333)

4. **Add GitHub repos** (defaults already set)

5. **Click "Save Settings"** ✅

That's it. Settings save to your browser's localStorage.

---

## 🌐 Settings Location (In App)

After configuration, click the **⚙️ Settings** button (bottom right) to:
- View current configuration
- See masked API key
- Reset everything

---

## 📱 How It Works

### First Launch
- App shows configuration modal
- You fill in your LLM API key + settings
- Browser saves to localStorage

### Future Launches
- App checks localStorage for settings
- If found, skips modal, starts normally
- Click ⚙️ to change settings anytime

### No .env needed
- Everything is in-app
- No file editing required
- Portable (can move to different computer, re-configure)

---

## 🧠 LLM Provider Setup (What You Need)

### OpenAI (GPT-4o)
1. Visit: https://platform.openai.com/api-keys
2. Create API key
3. Paste in settings modal

### Claude (Anthropic)
1. Visit: https://console.anthropic.com
2. Create API key
3. Paste in settings modal

### Gemini (Google) - FREE TIER
1. Visit: https://aistudio.google.com
2. Create API key (free)
3. Paste in settings modal

### Groq - FREE TIER
1. Visit: https://console.groq.com
2. Create API key (free)
3. Paste in settings modal

### Mistral
1. Visit: https://console.mistral.ai
2. Create API key
3. Paste in settings modal

### Cohere
1. Visit: https://dashboard.cohere.ai
2. Create API key
3. Paste in settings modal

---

## 🔧 Qdrant Setup (Vector Database)

Default: `http://localhost:6333`

### Option 1: Local Docker (Recommended)
```bash
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant
```

Then change nothing in settings (defaults work).

### Option 2: Cloud Qdrant
1. Visit: https://qdrant.tech
2. Create cloud instance
3. Paste URL in settings (e.g., `https://your-instance.qdrant.io`)
4. Add API key if required

### Option 3: Skip (Later)
Leave default. If it fails, settings show error.

---

## 🔄 Data Indexing

After settings are saved, you have two options:

### Option A: Index later (recommended for first run)
- Just use the app
- Try search, timeline, wallets, etc.
- Click Settings → "Index Repositories" when ready

### Option B: Index from terminal
```bash
npm run index
```

This syncs all 4 repos and creates semantic embeddings.

---

## 📋 App Features (Now Available)

Once configured:

✅ **Semantic Search**
- Ask questions in English or Yorùbá
- Get answers from your repos

✅ **7-Layer Pyramid**
- Visual stack visualization
- Click to see details

✅ **Timeline**
- 7-year roadmap
- 10 priorities tracker
- Sabbath calendar

✅ **1440 Wallets**
- Derivation tree
- Yield calculator
- 7×7 Journey

✅ **Tithe Flow**
- 50/25/15/10 allocation
- Example transactions

✅ **Settings**
- Change LLM provider anytime
- Update configuration
- Reset all settings

---

## 🛠️ Troubleshooting

### App won't start
```bash
npm install   # Install dependencies
bash RUN.sh   # Try again
```

### Settings modal won't go away
- Make sure you added an API key
- Click "Save Settings"
- If still stuck, reload page (Ctrl+R)

### Search doesn't work
1. Check settings has API key
2. Run `npm run index` in terminal
3. Wait for repos to sync (5-10 min)
4. Try search again

### Qdrant connection error
1. Start Qdrant: `docker run -d --name qdrant -p 6333:6333 qdrant/qdrant`
2. Or update settings to use cloud Qdrant
3. Reload page

### Can't access from another computer
1. Find your IP: `hostname -I`
2. Share link: `http://YOUR_IP:1111`
3. Firewall may need port 1111 opened

---

## 💾 Settings Backup

Your settings are stored in browser localStorage.

### Backup
```javascript
// In browser console (F12):
copy(localStorage.getItem('asemirror_config'))
```

### Restore
```javascript
// In browser console:
localStorage.setItem('asemirror_config', PASTED_VALUE)
```

---

## 🚀 Production Deployment

If you want to deploy this app online:

1. **Configure locally first** (test it works)
2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```
3. **App is live** at `asemirror.vercel.app`
4. **Users set their own API keys** in settings
5. **No secrets in code** ✅

---

## 📱 Mobile App (PWA)

The app works on phones!

1. Open http://localhost:1111 on your phone
2. Chrome menu → "Install app"
3. App appears on home screen
4. Works offline after first load
5. Set configuration in settings

---

## 🔐 Security Note

- API keys stored in browser localStorage (not sent to server unless you use shared instances)
- Recommended: Use free tier API keys for testing
- For production: Use API keys with rate limits
- Never share your settings link with API key visible

---

## 📚 What's Different from Terminal Mode?

| Feature | Terminal | App |
|---------|----------|-----|
| Configuration | .env file | Settings modal |
| API key setup | Manual edit | Copy/paste in app |
| Change settings | Edit .env, restart | Click ⚙️, instant |
| Portable | No (config in repo) | Yes (localStorage) |
| Easy for users | No | Yes |
| Works without terminal | No | Yes |

---

## 🤍⚡🍶

**This is ÀṣẹMirror in app mode.**

No configuration files. No terminal knowledge needed. Just:

```bash
bash RUN.sh
```

Then configure in the app.

That's it.

The organism sees itself.
