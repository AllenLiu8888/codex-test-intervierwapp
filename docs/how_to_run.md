# How to Run

## Prerequisites
- Node.js 18+ and npm.

## Setup
```bash
npm install
npm run dev
```

## Environment Variables
- `VITE_API_BASE_URL` — defaults to `https://comp2140a2.uqcloud.net/api` if unspecified.

- `VITE_LLM_API_KEY` — provide the GenAI key when enabling advanced features (use `.env.local` during development).

## Recording & Transcription
- **Transformers.js**: Use the browser-based Whisper example from the course to transcribe recorded audio before sending to the Answers endpoint.
- **Express + Whisper CLI**: Alternatively, proxy recordings to the sample Express service from the course that wraps the Whisper CLI; ensure the frontend only stores text transcripts.

## Demo Data
- Seed the UI with at least one example interview (e.g., "Frontend Engineer Screen") for rubric item 1.1.
