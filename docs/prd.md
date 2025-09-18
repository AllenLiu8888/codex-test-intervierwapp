# Product Requirements

## 2.1 Domain Model & Required Fields (Source: Project Brief)
- **Interview**: Title, Job Role, Description, Status (Draft | Published).
- **Question**: Question text, Difficulty (Easy | Intermediate | Advanced).
- **Applicant**: Title, Firstname, Surname, Phone, Email, Interview Status (Not Started | Completed).

## 2.2 Features & Interfaces (Source: Project Brief)
1. **App Shell**: Consistent header, footer, and navigation. Provide guidance, icons/colors that support a clear flow.
2. **Interviews**: List with counts for questions & applicants, CRUD actions, and navigation into questions/applicants.
3. **Questions**: Scoped to an interview, support CRUD, text-only prompts.
4. **Applicants**: List, create, and update applicants; generate & copy unique interview links; review questions and recorded answers.
5. **Take Interview Experience**: Welcome view, one-question-per-page with forward-only navigation, recording controls (pause allowed, re-record forbidden), speech-to-text transcription saved to the Answer endpoint, thank-you completion view.
6. **Advanced GenAI**: Provide an AI-powered enhancement (e.g., question generation, feedback, HR summary) leveraging supplied LLM key placeholder.

## 2.3 Technology & Runtime (Source: Getting Started)
- React + Vite + React Router frontend using centralized API services.
- RESTful integration with `https://comp2140a2.uqcloud.net/api` using PostgREST conventions.
- Shared forms for add/edit; no login or admin panel required.

## 2.4 Rubric Highlights (Source: Rubric)
- **1.1**: App runs with dependencies and ships with an example interview.
- **1.2**: Interview CRUD with summaries and best practices.
- **1.3**: Question CRUD per interview.
- **1.5**: Applicant create/update plus unique interview link generation.
- **1.6**: Recording and transcription saved as text responses.
- **1.7**: One-page-per-question interview flow with forward-only progression.
- **1.8**: View applicant status and associated Q&A.
- **2.x**: CSS framework usage, consistent layout, clear guidance.
- **3.x**: Code quality: functional patterns, reuse, centralized API, error handling, documentation.
- **4.1**: Advanced GenAI feature delivering tangible value.
