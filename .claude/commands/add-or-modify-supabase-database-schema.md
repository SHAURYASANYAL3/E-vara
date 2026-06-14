---
name: add-or-modify-supabase-database-schema
description: Workflow command scaffold for add-or-modify-supabase-database-schema in E-vara.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-modify-supabase-database-schema

Use this workflow when working on **add-or-modify-supabase-database-schema** in `E-vara`.

## Goal

Adds or modifies database tables, columns, or policies in Supabase by creating new migration SQL files and updating serverless functions.

## Common Files

- `supabase/migrations/*.sql`
- `supabase/functions/*/index.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create new migration SQL file(s) in supabase/migrations/
- Update or add relevant Supabase serverless function(s) in supabase/functions/
- Optionally update backend logic in src/utils/ or related files

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.