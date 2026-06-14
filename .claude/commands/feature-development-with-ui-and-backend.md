---
name: feature-development-with-ui-and-backend
description: Workflow command scaffold for feature-development-with-ui-and-backend in E-vara.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-development-with-ui-and-backend

Use this workflow when working on **feature-development-with-ui-and-backend** in `E-vara`.

## Goal

Implements a new feature involving both frontend React components and backend logic, often including utility files and sometimes updating workflows or documentation.

## Common Files

- `src/components/**/*.tsx`
- `src/pages/**/*.tsx`
- `src/utils/**/*.ts`
- `supabase/functions/*/index.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or modify React component(s) in src/components/ or src/pages/
- Update or create backend logic in src/utils/ or supabase/functions/
- Optionally update workflow files or documentation

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.