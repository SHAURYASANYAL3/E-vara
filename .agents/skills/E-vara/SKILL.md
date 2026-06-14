```markdown
# E-vara Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches you the core development patterns and workflows used in the E-vara repository, a TypeScript/React project. You'll learn the project's coding conventions, how to contribute new features or database changes, and how to follow established workflows for consistent, maintainable code.

## Coding Conventions

### File Naming

- Use **PascalCase** for all file names.

  **Example:**
  ```
  UserProfile.tsx
  AuthProvider.ts
  ```

### Import Style

- Use **alias imports** for modules.

  **Example:**
  ```typescript
  import UserService from '@/utils/UserService';
  import Dashboard from '@/components/Dashboard';
  ```

### Export Style

- Use **default exports** for modules and components.

  **Example:**
  ```typescript
  // src/components/Settings.tsx
  const Settings = () => { /* ... */ };
  export default Settings;
  ```

### Commit Messages

- Use prefixes like `fix:` and `feat:`.
- Keep commit messages concise (average ~59 characters).

  **Example:**
  ```
  feat: add user profile page
  fix: correct typo in dashboard title
  ```

## Workflows

### Add or Modify Supabase Database Schema
**Trigger:** When you need to add or change database structure or logic.
**Command:** `/new-table`

1. **Create a migration SQL file**  
   Add a new `.sql` file in `supabase/migrations/` describing the schema changes.

   _Example:_
   ```
   supabase/migrations/20240612_add_users_table.sql
   ```

2. **Update or add Supabase serverless functions**  
   Modify or create files in `supabase/functions/*/index.ts` to reflect new schema or logic.

   _Example:_
   ```typescript
   // supabase/functions/createUser/index.ts
   export default async function handler(req, res) {
     // logic using new table/column
   }
   ```

3. **(Optional) Update backend logic**  
   If needed, update utility files in `src/utils/` or related backend files.

   _Example:_
   ```typescript
   // src/utils/userHelpers.ts
   export default function getUserByEmail(email: string) { /* ... */ }
   ```

### Feature Development with UI and Backend
**Trigger:** When you want to develop a new end-to-end feature.
**Command:** `/new-feature`

1. **Add or modify React components**  
   Create or update components in `src/components/` or pages in `src/pages/`.

   _Example:_
   ```typescript
   // src/components/UserProfile.tsx
   const UserProfile = () => { /* ... */ };
   export default UserProfile;
   ```

2. **Update or create backend logic**  
   Add or modify utility functions in `src/utils/` or Supabase functions in `supabase/functions/`.

   _Example:_
   ```typescript
   // src/utils/userApi.ts
   export default async function fetchUser(id: string) { /* ... */ }
   ```

3. **(Optional) Update workflows or documentation**  
   If your feature affects workflows or requires documentation, update the relevant files.

   _Example:_
   ```
   docs/feature-overview.md
   .github/workflows/ci.yml
   ```

## Testing Patterns

- **Test files** use the pattern `*.test.*`.
- The specific testing framework is **unknown**, but tests are likely colocated with source files.

  _Example:_
  ```
  src/components/UserProfile.test.tsx
  src/utils/userApi.test.ts
  ```

## Commands

| Command      | Purpose                                            |
|--------------|----------------------------------------------------|
| /new-table   | Start a workflow to add or modify database schema  |
| /new-feature | Begin developing a new UI + backend feature        |
```
