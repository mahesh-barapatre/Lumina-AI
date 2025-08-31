# ✅ Manual Test Script — Lumina Discord Bot

This test script ensures all major flows, edge cases, and error handling are covered.  
Follow this checklist when running the bot locally or after deployment.

---

## 1. Slash Command Flows

- [ ] `/remind text=drink water time=1m`  
       → Bot confirms & pings you after 1 minute.

- [ ] `/music mood=chill`  
       → Returns 3 playable Spotify links (tracks or playlists).

- [ ] `/hangout near=Delhi type=cafe`  
       → Returns 3 cafes with name, rating, and Google Maps link.

- [ ] `/ai input="Remind me to call mom at 8pm"`  
       → Parsed into `remind` action; sets a reminder.

---

## 2. Free-Text AI Flows

- [ ] `remind me to shower in 5m`  
       → Parsed correctly; reminder set.

- [ ] `suggest chill music`  
       → Spotify recommendations returned.

- [ ] `find a bar near Mumbai`  
       → Returns 3 bars with rating + link.

---

## 3. Edge Cases

- [ ] `/remind text=study time=1h ago`  
       → Bot rejects with: `❌ time must be in the future`.

- [ ] `/hangout near=Atlantis type=cafe`  
       → Bot replies: `⚠️ No results found`.

- [ ] `/music mood=sadboi`  
       → Bot defaults to `/music random`.

- [ ] `/ai ""` (empty input)  
       → Bot replies: `❌ Sorry, I couldn’t understand that.`

---

## 4. API Failure Handling

- [ ] **Spotify API Down**  
       → Bot replies: `⚠️ Music service unavailable`.

- [ ] **Google Maps Billing Error**  
       → Bot replies: `⚠️ Maps not available (billing required)`.

- [ ] **LLM Timeout / Error**  
       → Bot replies: `❌ Couldn’t parse that.`

---

## 5. Code Quality Checks

- [ ] All API calls wrapped in `try/catch`.
- [ ] `console.error` logs contain helpful context (not silent).
- [ ] Inline comments explain tricky logic (LLM parsing, Spotify auth).
- [ ] Unused imports removed, consistent code formatting.
- [ ] `README.md` updated with install + usage + screenshots.

---

## 🎯 Done When

- All above test cases **pass locally**.
- Bot runs clean with **no unhandled promise rejections**.
- Repo has `README.md` + `TESTS.md` so others can run and test easily.

---
