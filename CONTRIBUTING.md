# Contributing

Thanks for helping improve Speak & Learn. This is an early prototype; keep changes focused, explain trade-offs, and avoid presenting prototype behavior as a clinical result.

## Set up locally

1. Install Node.js 20.6 or newer.
2. Clone the repository and enter its folder.
3. Copy `.env.example` to `.env` (`Copy-Item .env.example .env` in PowerShell, or `cp .env.example .env` on macOS/Linux). The sample works without credentials; add an Anthropic API key only if you want to test AI generation.
4. Run `npm ci`.
5. Run `npm start` and open <http://localhost:3000>.
6. Run `npm run check` and `npm test` before submitting a pull request.

The app does not save lesson text. When testing AI generation, lesson text is sent to Anthropic. Never use real student information or identifiable/personal data in test prompts or issue reports.

## Pull requests

- Describe the problem and user-facing behavior.
- Include reproduction steps for fixes and tests for changed behavior.
- Keep API keys and `.env` files out of commits.
- Preserve the teacher approval step; the app must not speak on a student's behalf.
- Treat AI vocabulary, translations, and pictogram matches as suggestions that need human review.
- Do not add symbols or code without checking their license and required attribution.
- Do not claim endorsement, clinical effectiveness, or user testing that did not happen.

Use the pull request template and report bugs or propose changes through GitHub Issues.
