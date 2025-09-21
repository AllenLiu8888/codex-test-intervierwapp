# ReadySetHire – AI Interview Platform

Front-end client for the ReadySetHire assessment. Built with React, React Router, and TailwindCSS. The app manages interviews, questions, applicants, and delivers a guided interview experience with audio recording and transcription placeholders.

## Features
- **Interview Management**: Create, edit, and delete interview templates with status badges and navigation into related resources.
- **Question Bank**: Filterable list with shared create/edit form and difficulty tagging.
- **Applicants**: Manage candidates, generate/copy unique interview links, and review AI-powered summaries.
- **Take Interview Flow**: Candidate experience with welcome page, one-question-at-a-time navigation, MediaRecorder-based audio capture (pause/resume, no re-record), placeholder transcription, and thank-you screen.
- **Advanced GenAI**: Simulated HR summary that reads `VITE_LLM_API_KEY` and can be replaced with a real LLM integration.

## Getting Started
1. Install dependencies (requires npm registry access):
   ```bash
   npm install
   ```
2. Start the development server (Vite listens on **http://localhost:5176**):
   ```bash
   npm run dev
   ```

> **Note:** The provided execution environment blocks npm registry access. Run the install command locally where the registry is reachable.

## Environment Variables
Create a `.env.local` file with the following keys:

```
VITE_API_BASE_URL=https://comp2140a2.uqcloud.net/api
VITE_API_JWT=YOUR-POSTGREST-JWT
VITE_API_USERNAME=YOUR-STUDENT-ID # optional when JWT payload already includes username
VITE_LLM_API_KEY=YOUR-LLM-KEY-HERE
```

`VITE_API_JWT` is required for every API request and will be injected into the `Authorization: Bearer` header automatically.
`VITE_API_USERNAME` is optional—the app will attempt to read the username from the JWT payload automatically.

`VITE_LLM_API_KEY` is optional for the placeholder GenAI feature but required once a production integration is wired.

## Documentation
Additional docs live in the [`docs/`](./docs/README.md) folder:
- Product requirements mapping
- API usage notes
- How to run instructions (including transcription options)
- QA checklist used for self-review
- Step-by-step build plan for recreating the project from scratch

## Sample Data
Use the interview creation form to add at least one interview (e.g., “Frontend Engineer Screen”) so rubric item 1.1 is satisfied. The UI supports seeding via the provided forms without additional tooling.

## GenAI Disclosure
This project currently ships with a simulated summary generator. Replace the implementation in `src/services/genAiApi.js` with your production GenAI call when you are ready to connect a commercial API.
