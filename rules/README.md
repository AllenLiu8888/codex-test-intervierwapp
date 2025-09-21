# Engineering Rules

## Core Principles
- **SOLID**: Design components and services that respect single responsibility, rely on abstractions, and can be extended without modification. Avoid tightly coupled modules that hinder testing.
- **DRY**: Extract reusable logic into hooks, utilities, or shared components to prevent duplication. Review new code for repeated patterns.
- **KISS**: Keep implementations straightforward; prefer simple data flows and obvious state transitions over clever but opaque solutions.
- **Readability**: Name variables and functions descriptively, document non-obvious behavior, and maintain consistent formatting via ESLint/Prettier.

## Anti-Patterns to Refactor
- **Duplicated Fetch Logic** → Centralize API access in `/services` modules.
- **God Components** → Split large UI components into smaller, focused units.
- **Hidden Coupling** → Use props/state explicitly; avoid relying on shared mutable state.
- **Incomplete Error Paths** → Surface loading, empty, and error states across the UI.

## Self-Check Before Commit
1. Are there repeated blocks that could live in hooks/components?
2. Does each module have a single clear responsibility?
3. Are error/loading states handled for every async operation?
4. Are Type/prop assumptions documented or validated?
