# Speak & Learn

Speak & Learn turns lesson text into a teacher-reviewable bilingual (English and Hindi) classroom communication board. The teacher decides what is approved; the student chooses what to communicate. Nothing speaks automatically.

This is a prototype, not a clinical tool. Generated vocabulary, Hindi translations, and matched pictograms must be checked by a teacher or speech-language therapist before use.

## Run locally

Requires Node.js 20.6 or newer. Copy `.env.example` to `.env`, then install dependencies and start the local server.

PowerShell:

```powershell
Copy-Item .env.example .env
npm ci
npm start
```

macOS/Linux:

```sh
cp .env.example .env
npm ci
npm start
```

Open <http://localhost:3000>. The hand-built photosynthesis sample works without an API key. To enable AI generation, add your key to `.env`:

```dotenv
ANTHROPIC_API_KEY=your-key
```

`.env` is ignored by Git. Never commit API keys. The key stays on the server and is never sent to the browser. Lesson text is sent to Anthropic only when Generate is selected; this app does not save it.

To run checks:

```sh
npm run check
npm test
```

## Use with Cboard

1. Paste a lesson, generate or load the sample board, and review every English label, Hindi label, and pictogram keyword.
2. Select **Approve & open preview**.
3. Download the English or Hindi `.obf` file from the Teacher or Preview view. Exports follow the Open Board Format shape accepted by Cboard's `.obf` importer.
4. Open [Cboard](https://app.cboard.io/), import the downloaded `.obf` file using [Cboard's import guide](https://www.cboard.io/help/#HowdoIimportaboardintoCboard), then review the imported board and configure scanning in Cboard's settings.

Exports look up AAC pictograms from [ARASAAC](https://arasaac.org/). A missing lookup leaves that tile as text and is reported in the app. A successful lookup is only a suggestion: verify that each pictogram matches its label and context. ARASAAC pictograms are by Sergio Palao and are distributed under CC BY-NC-SA; retain attribution and check the license before commercial use. Lookups send only the English pictogram keyword to ARASAAC.

The local Preview is a fallback, not Cboard. It demonstrates browser speech, sentence building, a timer-based switch-scanning simulation, and printing. Cboard remains the intended student-facing AAC app.

## Deploy on Vercel

1. Import this repository into Vercel.
2. Set `ANTHROPIC_API_KEY` as a server environment variable (optionally set `ANTHROPIC_MODEL`; defaults to `claude-sonnet-5-5`).
3. Deploy. Vercel serves `index.html` and the `api/generate.js` function at `/api/generate`.

## What is and is not verified

- The app enforces teacher approval before preview, print, or OBF export.
- Cboard's source supports `.obf` imports and scanning; this repository does not include Cboard or claim that a real-user import/scanning session has been tested.
- Hindi wording and speech have not been reviewed by a native speaker or speech-language therapist.
- Pictogram search is automatic; symbol-to-word fit needs human review. OBF files reference remote pictograms and contain no offline image copies.
- There has been no AAC-user or therapist usability testing. No clinical or outcome claims are made.
- Bengali, offline generation, accounts, and phrase prediction are out of scope.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, testing, and pull request guidance. GitHub Actions runs syntax checks and tests for pull requests.

## Three-minute demo flow

1. **Problem (20s):** Explain that the prototype aims to help a student express classroom needs; do not make outcome or endorsement claims.
2. **Teacher flow (60s):** Paste the sample lesson, generate or load the sample board, edit or remove a tile, and approve it.
3. **Cboard (60s):** Download an OBF file, import it in Cboard, review its pictograms, then demonstrate speech and configure scanning. If the external app is unavailable, use the local Preview for speech and scanning simulation.
4. **Low-tech option (20s):** Print the approved bilingual board.
5. **Close (20s):** State the prototype limitations and next step: feedback from AAC users, educators, and speech-language therapists.

## Development

```sh
npm run check
npm test
```

This repository currently has no license. Choose and add a license before inviting reuse or distribution; without one, normal copyright restrictions apply. Before public release, collect feedback from AAC users and therapists, test the full flow on a phone and laptop, and add verified demo screenshots/video. Do not claim endorsement or outcomes without evidence.
