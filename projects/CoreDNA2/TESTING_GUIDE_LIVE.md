# CoreDNA2 - Live Testing Guide

**Server Status:** Running on http://localhost:3001/  
**Date:** January 26, 2026  
**Build Status:** ✓ Clean (0 errors, 1432 modules, 22 seconds)

---

## 🧪 TEST PLAN - 5 Core Flows

The dev server is now running. Test each flow below and verify the fixes are working.

---

## TEST 1: Campaign Content Depth ✓

**What to do:**
1. Open http://localhost:3001/#/campaigns
2. Make sure a brand DNA is selected in the dropdown
3. Enter campaign goal: `"Increase brand awareness among Gen-Z professionals"`
4. Select channels: `Instagram, Email`
5. Click `Execute Sequence` button
6. Wait for generation (60-90 seconds)

**What to look for:**
- ✓ Campaign generates without errors
- ✓ Copy text appears (not just headlines)
- ✓ Each asset has 200+ character content
- ✓ Content mentions specific benefits (not generic)

**Check in browser console (F12 → Console tab):**
```
[generateCampaignAssets] Asset 1 content length: 247 chars
[generateCampaignAssets] Asset 2 content length: 231 chars
[generateCampaignAssets] Asset 3 content length: 218 chars
```

**Expected:**
- All content lengths 200+ characters
- NOT 1-2 sentences
- NOT generic "Check this out!"

---

## TEST 2: Campaign Images Relevance ✓

**What to do:**
1. While campaign is generating, watch for the `Generating visual assets...` message
2. Wait for images to load under each asset card
3. Right-click on an image → "Open Image in New Tab"
4. Look at the image URL

**What to look for:**
- ✓ Images load (either Unsplash or API provider)
- ✓ Images appear relevant to content
- ✓ Not obviously generic/random

**Check the image URL:**
```
GOOD: https://source.unsplash.com/1024x768/?marketing,brand,strategy
BAD:  https://source.unsplash.com/800x600/?business
```

**Expected:**
- URL contains specific keywords (marketing, brand, strategy, etc.)
- Image size is 1024x768 (larger, better quality)
- Image is relevant to campaign topic

---

## TEST 3: Data Persistence Across Pages ✓

**What to do:**
1. Generate a campaign (from Test 1)
2. Click `📦 Saved Campaigns` button in top right
3. You should see a count (e.g., `📦 (1)`)
4. Click the button to open saved campaigns modal
5. Close the modal (click X or click outside)
6. Click `📅 Schedule` button
7. Navigate to `/scheduler` page
8. **Verify:** Campaign appears in the queue

**Continue testing:**
9. Click on "Portfolio" in sidebar
10. **Verify:** Campaign is still there
11. Click on "Campaigns" in sidebar
12. **Verify:** Campaign still exists

**Check in browser console:**
```
[CampaignProvider] ✓ Loaded 1 campaigns
[CampaignContext] Campaigns available from global context: 1
```

**Expected:**
- Campaign count increases after generation
- Campaign visible in Scheduler queue
- Campaign visible in Portfolio
- Campaign still exists when returning to Campaigns
- All synced via global context

---

## TEST 4: Realistic Lead Data ✓

**What to do:**
1. Go to http://localhost:3001/#/settings
2. Scroll down to "Lead Agent" section
3. Enter a niche (e.g., "digital marketing", "fitness", "restaurants")
4. Leave location blank (will use mock data)
5. Click search/fetch button
6. Wait for leads to load

**What to look for:**
- ✓ Company names look real (not "Business 1", "Business 2")
- ✓ Addresses have real cities (New York, Los Angeles, Chicago, etc.)
- ✓ Ratings between 3.8-5.0 (not random 0-5)
- ✓ Phone numbers look real: `(200)-555-1234` format
- ✓ Review counts 15-135 (not obviously random)

**Examples of GOOD leads:**
```
Company: Velocity Marketing Group
Rating: 4.3 ⭐
Address: 1245 Broadway, New York, NY 10001
Phone: (200)-555-1234
Reviews: 47
```

**Examples of BAD leads (what we fixed):**
```
Company: Digital Marketing Business 1
Rating: 2.7 ⭐
Address: 4892 Business St, City, State 12345
Phone: +15551234567
```

**Expected:**
- All leads look professional and realistic
- Company names are industry-specific
- Data is plausible (not obviously generated)

---

## TEST 5: Error Handling & Clear Messages ✓

**What to do:**
1. Go to http://localhost:3001/#/settings
2. Scroll to "API Keys" section
3. Clear all LLM provider API keys (delete the keys)
4. Go back to http://localhost:3001/#/campaigns
5. Try to generate a campaign

**What to look for:**
- ✓ Clear error message appears
- ✓ Message tells you to go to Settings
- ✓ Message shows which API key is missing
- ✓ No cryptic errors

**Expected message:**
```
❌ No API Keys Configured

Go to Settings → API Keys and add at least one LLM provider 
(OpenAI, Claude, Gemini, etc.) with its API key.
```

**Then:**
6. Add a dummy API key (even fake one for testing)
7. Try generation again
8. **Should work** (or at least try to call the API)

---

## BROWSER CONSOLE CHECKS (F12 → Console Tab)

### What to look for (Successes):
```
✓ [CampaignProvider] ✓ Loaded 1 campaigns
✓ [generateCampaignAssets] Asset 1 content length: 247 chars
✓ [CampaignsPage] ✓ Campaign auto-saved to global context
✓ [SchedulerPage] Global campaigns available: 1
```

### What to NOT see (Errors):
```
✗ Asset content is shallow
✗ undefined content
✗ Campaign data lost
✗ Failed to persist
```

---

## QUICK REFERENCE - EXPECTED RESULTS

| Test | Before Fix | After Fix | Status |
|------|-----------|-----------|--------|
| Content Length | 20-50 chars | 200+ chars | ✓ Fixed |
| Content Quality | Generic | Brand-aware | ✓ Fixed |
| Image Size | 800x600 | 1024x768 | ✓ Fixed |
| Image Relevance | Generic | Specific | ✓ Fixed |
| Data Persistence | Disappears | Persists | ✓ Fixed |
| Lead Names | Business 1 | Real names | ✓ Fixed |
| Lead Ratings | 0-5 random | 3.8-5.0 | ✓ Fixed |
| Errors | Unclear | Clear | ✓ Fixed |

---

## TROUBLESHOOTING

### Campaign generation fails
- Check browser console for error message
- Verify LLM provider API key is set in Settings
- Try with a free provider (Google Gemini has free tier)

### Images don't load
- Check Settings → Image Generation for API key
- Unsplash fallback should work (always free)
- Check image provider selection

### Data disappears on navigation
- Check browser DevTools → Application → Local Storage
- Should see `core_dna_saved_campaigns` key
- If missing, localStorage might be disabled

### Leads still look fake
- Page might be cached
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or clear browser cache and reload

### Build didn't pick up changes
- Kill dev server: Ctrl+C
- Run `npm run dev` again
- Files should auto-reload (Vite hot module reload)

---

## FINAL VERIFICATION CHECKLIST

After testing all 5 flows, verify:

- [ ] Campaign content is 200+ characters
- [ ] Campaign content uses brand mission/values
- [ ] Campaign images are specific (contain keywords in URL)
- [ ] Campaigns persist when navigating between pages
- [ ] Leads look realistic (not "Business 1", "Business 2")
- [ ] Leads have realistic ratings (3.8-5.0)
- [ ] Leads have real city names
- [ ] Error messages are clear and helpful
- [ ] Browser console shows success logs
- [ ] No TypeScript errors in console
- [ ] No "undefined" warnings

**When all checks pass = Core engine is fixed ✓**

---

## SUCCESS CRITERIA

✓ All 5 test flows complete without errors
✓ Console shows success messages
✓ No broken functionality
✓ Data persists correctly
✓ User experience improved

**THEN: Ready to deploy to production**
