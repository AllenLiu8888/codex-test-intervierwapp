# Frontend Implementation Rules

## Architecture
- Maintain clear separation: `pages` orchestrate data, `components` render UI, `services` handle HTTP, `hooks` encapsulate logic, and `utils` host pure helpers.
- Do **not** call `fetch` inside React components; always go through `/services/*Api.js` built atop `apiClient.js`.
- Ensure every async view covers loading, empty, and error states.
- Form screens must reuse shared create/edit forms to satisfy DRY and rubric expectations.
- Keep routes and data flow unidirectional; validate URL params before use and guard against race conditions with cancellation or stale responses.

## UI & Accessibility
- Provide a consistent header, footer, and navigation bar across the app.
- Include labels, helper text, and keyboard-accessible controls for all form inputs and recording features.
- The Take Interview flow must present one question per screen with a single `Next` control, no backtracking, and prevent re-recording while allowing pause/resume.
- After recording, transcribe audio to text and persist via the Answers API using text only.

## Error Handling & Guidance
- Surface actionable messages for network failures or validation issues.
- Provide contextual guidance so users understand the process (interview creation, applicant management, recording steps).
