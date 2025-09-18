# API Reference

- **Base URL**: `https://comp2140a2.uqcloud.net/api`
- PostgREST-style filtering and CRUD endpoints.

## Examples
- `GET /interview` — list all interviews.
- `GET /interview?id=eq.1` — fetch interview with `id = 1`.
- `POST /interview` — create an interview (JSON body with required fields).
- `PATCH /interview?id=eq.1` — update interview `1`.
- `DELETE /interview?id=eq.1` — delete interview `1`.

> Note: Table schemas beyond provided requirements must be discovered at runtime via `OPTIONS` or initial fetches; avoid hardcoding assumptions that are not confirmed by the API responses.
