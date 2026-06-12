```markdown
# E-vara Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development conventions and patterns used in the E-vara repository, a React application written in TypeScript. It covers file organization, code style, commit message conventions, and testing patterns, providing clear examples and suggested commands for efficient collaboration.

## Coding Conventions

### File Naming
- Use **PascalCase** for all file names (each word capitalized, no separators).
  - **Example:**  
    `UserProfile.tsx`  
    `LoginForm.ts`

### Import Style
- Use **alias imports** for modules.
  - **Example:**  
    ```typescript
    import Button from '@components/Button';
    import { fetchUser } from '@utils/api';
    ```

### Export Style
- Use **default exports** for components and modules.
  - **Example:**  
    ```typescript
    // UserProfile.tsx
    const UserProfile = () => { /* ... */ };
    export default UserProfile;
    ```

### Commit Message Conventions
- Use **conventional commit** format with prefixes such as `chore` and `style`.
- Keep commit messages concise (average ~46 characters).
  - **Examples:**  
    ```
    chore: update dependencies
    style: fix button alignment
    ```

## Workflows

### Commit Changes
**Trigger:** When making any code or style change  
**Command:** `/commit-changes`

1. Make your code or style modifications.
2. Stage the changes with `git add`.
3. Write a commit message using the conventional format:
   - Prefix: `chore` or `style`
   - Short, descriptive message
   - Example:  
     ```
     git commit -m "style: update header spacing"
     ```

### Add New Component
**Trigger:** When adding a new React component  
**Command:** `/add-component`

1. Create a new file using PascalCase in the appropriate directory.
   - Example: `UserMenu.tsx`
2. Write the component using TypeScript and React.
3. Use alias imports for dependencies.
4. Export the component as default.
   - Example:
     ```typescript
     import React from 'react';
     import Button from '@components/Button';

     const UserMenu = () => (
       <div>
         <Button>Logout</Button>
       </div>
     );

     export default UserMenu;
     ```
5. Add and commit the file using the commit conventions.

## Testing Patterns

- Test files use the pattern `*.test.*` (e.g., `UserMenu.test.tsx`).
- The specific testing framework is not detected, but follow the file naming pattern for all tests.
  - Example:
    ```
    UserMenu.test.tsx
    ```
- Place test files alongside the components they test or in a dedicated `__tests__` directory as appropriate.

## Commands
| Command           | Purpose                                         |
|-------------------|-------------------------------------------------|
| /commit-changes   | Guide for making and committing changes         |
| /add-component    | Steps for adding a new React component          |
```
