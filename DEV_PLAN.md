# Development Plan

## Stage A Prompt
- Objective: establish required docs/rules skeleton before coding.
- Tasks: create directories per spec, add placeholder README, rules docs with rubric references, ensure no business logic yet.
- Checks: directory structure matches PRD, docs include required sections, git status clean aside from expected files.


### Stage A Completion
- Created required directory skeleton under `src`, `public`, `docs`, and `rules`.
- Authored rules and documentation files as specified.
- TODO: None for this stage.

## Stage B Prompt
- Initialize Vite React project with TailwindCSS setup.
- Configure routing with React Router, include global layout with header, footer, navigation placeholders.
- Ensure ESLint/Prettier defaults from Vite maintained; no business logic yet.
- Verify dev server runs locally (npm run dev) before ending stage if possible.

### Stage B Completion
- Manual Vite-style scaffolding created with React 18, React Router, Tailwind configs, and global layout.
- Added placeholder pages for dashboard, interviews, questions, applicants, and take interview.
- TODO: Install npm dependencies once registry access is available to run dev server.

## Stage C Prompt
- Implement `apiClient.js` with base URL + helpers, plus interview/question/applicant service modules with list fetchers.
- Create shared hooks or utilities for loading/error handling as needed.
- Build list pages consuming services with loading, empty, and error states (placeholder data until API integration validated).
- Ensure no direct fetch calls in components; rely on services abstraction.

### Stage C Completion
- Implemented centralized API client with error handling and abort support plus resource-specific service modules.
- Added `useAsyncData` hook for managing async lifecycle with cancellation.
- Updated interview, question, and applicant pages to consume services with loading/error/empty states and refresh controls.
- TODO: Enhance interview summaries with aggregated counts once related data fetching is implemented.

## Stage D Prompt
- Build shared forms for interviews, questions, and applicants supporting create/edit flows.
- Wire CRUD actions via services, including optimistic refresh or state updates and validation messaging.
- Introduce routing for add/edit pages and ensure no duplicate form logic across create/edit.
- Maintain loading/error handling and confirm unique applicant link generation placeholder.

### Stage D Completion
- Created reusable Interview, Question, and Applicant form components with validation and accessibility labels.
- Added editor pages leveraging shared forms for create/edit flows and wired CRUD actions via service layer.
- Enhanced list pages with filtering, refresh controls, action buttons, and delete handling; applicant links generate/copy via tokens.
- TODO: Improve question/applicant counts by aggregating related data from API in later stages.

## Stage E Prompt
- Build Take Interview flow: welcome screen, question progression (one per page) using recorded answers.
- Implement recording widget with pause/resume, disable re-recording, convert audio to transcript via placeholder transcription service, then save text using answer API.
- Ensure navigation is forward-only with persistent progress state and final thank-you screen.
- Handle loading/error states when fetching questions/applicant context.

### Stage E Completion
- Implemented candidate take-interview flow with welcome, question progression, and thank-you views.
- Added MediaRecorder-based audio controls (pause/resume, finish) with no re-recording and placeholder transcription workflow saving text answers via Answers API.
- Hooked applicant lookup by token, question fetching, progress continuation, and applicant completion status updates with error handling.
- TODO: Replace placeholder transcription utility with Whisper/Transformers integration and confirm API field mappings once schema is known.

## Stage F Prompt
- Design and integrate Advanced GenAI feature (e.g., HR summary) using placeholder that reads `VITE_LLM_API_KEY`.
- Create UI entry point within dashboard or applicants page to trigger AI summary, displaying loading/error states and caching results.
- Ensure API abstraction for LLM requests and document placeholder behavior for later key injection.

### Stage F Completion
- Added GenAI service placeholder that leverages `VITE_LLM_API_KEY` and simulates async summaries pending real API wiring.
- Integrated AI summary panel on applicants page with loading/error handling and ability to refresh or close insights.
- Wired applicant answers retrieval through service layer to feed the summary generator without direct fetch usage.
- TODO: Replace simulated summary logic with actual LLM request once backend endpoint is available.

## Stage G Prompt
- Run lint/tests (if available) and document limitations (e.g., npm install restrictions).
- Review implementation against QA checklist; ensure docs/README updated (including GenAI usage note).
- Prepare final summary and screenshots if required; verify git status clean before delivery.

### Stage G Completion
- Attempted `npm install` but registry access returned HTTP 403; document limitation in README.
- Reviewed implementation against QA checklist; docs already reference transcription options and GenAI placeholders.
- Updated root README with setup instructions, environment variables, sample data guidance, and GenAI disclosure.
- TODO: Integrate real transcription/LLM endpoints when credentials and network access become available.
