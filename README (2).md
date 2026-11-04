# Speak & Learn

Turns a lesson into a reviewable classroom communication board (English + Hindi) for students who use AAC.
A teacher or therapist approves every board; the student decides what is spoken. Nothing speaks automatically.

## What works
- Lesson text -> suggested tiles (LLM) -> teacher edit/delete/add -> approve
- Five fixed classroom phrases on every board
- Student board: tap to speak (EN / HI / both), sentence bar
- Single-switch scanning demo (Space/Enter selects)
- Print layout (browser print or save as PDF)
- Export as Open Board Format (.json; rename to .obf) in English and Hindi

## What is not built / not tested
- Symbols are emoji placeholders, not ARASAAC/OpenSymbols pictograms
- OBF export has labels only (no images); Cboard import not yet verified
- Hindi phrases not yet reviewed by a native speaker or SLP
- No user testing with AAC users or therapists; no clinical claims
- Bengali, offline mode, phrase prediction: roadmap

## Run locally
Open `index.html` in a browser. Without the backend, Generate falls back to the hand-built photosynthesis board.

## Deploy with AI generation (Vercel)
1. Push this folder to GitHub, import into Vercel.
2. Add env var `ANTHROPIC_API_KEY`.
3. `api/generate.js` is picked up automatically; `index.html` calls `/api/generate`.

## Credits and licences
Add before publishing: symbol source attribution (ARASAAC is CC BY-NC-SA), and a licence for this repo.
If you reuse Cboard (GPL) or Asterics (AGPL) code, check their terms.

## 3-minute demo
1. Problem (20s) 2. Paste lesson, generate, remove one tile, add one, approve (60s)
3. Student board: build a sentence, speak EN/HI, scanning (60s) 4. Print and hold up the page (20s)
5. Next: therapist testing, Bengali, offline (20s)
