# Deployment Rules

- No additional backend services may be introduced; the app must rely on the provided REST API.
- Read API base URL from `VITE_API_BASE_URL`, defaulting to `https://comp2140a2.uqcloud.net/api` in development configs.
- Any GenAI integrations must use `VITE_LLM_API_KEY`; never commit real secrets, only document how to supply them.
- Ensure Vite build artifacts include source maps and reference assets relatively for static hosting.
- Document environment configuration in `/docs/how_to_run.md` and the project `README.md`.
