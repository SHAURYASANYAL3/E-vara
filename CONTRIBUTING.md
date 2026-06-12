# 🤝 Contributing to E-VARA

Thank you for your interest in contributing to **E-VARA**! 🚀

E-VARA is an executive identity intelligence platform focused on privacy-first identity monitoring and digital risk analysis. We welcome contributions from developers, security researchers, designers, technical writers, and open-source enthusiasts.

Whether you're fixing a bug, improving documentation, or implementing a new feature, your contributions help strengthen the project and the community.

---

# 📋 Table of Contents

* Code of Conduct
* Before You Start
* Prerequisites
* Fork and Clone the Repository
* Install Dependencies
* Environment Setup
* Local Development
* Database Setup
* Supabase Edge Functions
* Creating a Branch
* Development Guidelines
* Testing and Linting
* Commit Guidelines
* Submitting a Pull Request
* Security Contributions
* Contribution Tips

---

# 🌟 Code of Conduct

Please help us maintain a positive and professional community.

* Be respectful and constructive.
* Prioritize security and user privacy.
* Follow existing project architecture.
* Welcome and support fellow contributors.

---

# 🚀 Before You Start

Before working on an issue:

1. Browse the Issues section.
2. Comment if required.
3. Wait for assignment when applicable.
4. Fork the repository.
5. Create a dedicated branch for your work.

---

# 📦 Prerequisites

Please ensure you have:

* Node.js 20+
* npm
* Git
* A Supabase account

Verify your installation:

```bash
node -v
npm -v
git --version
```

---

# 🍴 Fork and Clone the Repository

## Step 1: Fork

Click the **Fork** button on GitHub.

## Step 2: Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/E-Vara.git
```

Navigate into the project:

```bash
cd E-Vara
```

## Step 3: Add the upstream repository (recommended)

```bash
git remote add upstream https://github.com/SHAURYASANYAL3/E-Vara.git
```

Verify your remotes:

```bash
git remote -v
```

---

# 📥 Install Dependencies

Install project dependencies:

```bash
npm install
```

---

# 🔐 Environment Setup

E-VARA uses Supabase for authentication, storage, and backend services.

Create a `.env` file in the project root.

Example:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

# Alternatively, the project also supports:
# VITE_SUPABASE_ANON_KEY=your_anon_key
```

> **Note:** The application supports both `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_SUPABASE_ANON_KEY` depending on your Supabase configuration.

⚠️ Never commit your `.env` file or any secret credentials.

---

# ▶️ Local Development

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

---

# 🗄 Database Setup

E-VARA uses Supabase PostgreSQL.

The database schema is provided in:

```
./schema.sql
```

Execute the contents of `./schema.sql` using the Supabase SQL Editor to initialize the required tables and database objects.

Example:

```sql
-- Execute the SQL statements contained in ./schema.sql
```

---

# ⚡ Supabase Edge Functions

E-VARA includes several Supabase Edge Functions.

For basic local development and the core identity monitoring workflow, deploy the required `breach-check` function:

```bash
supabase functions deploy breach-check
```

Additional Edge Functions are available in the repository for advanced and internal platform features. They are not required for basic development unless you are specifically working on those components.

---

# 🌿 Create a Branch

Always create a dedicated branch for your work.

Documentation:

```bash
git checkout -b docs/update-documentation
```

Bug Fix:

```bash
git checkout -b fix/issue-description
```

Feature:

```bash
git checkout -b feat/feature-name
```

---

# 💻 Development Guidelines

Please follow the existing project architecture and coding standards.

## TypeScript

E-VARA uses strict TypeScript.

❌ Avoid:

```typescript
let value: any;
```

✅ Prefer:

```typescript
let value: UserProfile;
```

## General Guidelines

* Keep changes focused.
* Write clean and maintainable code.
* Follow existing project structure.
* Update documentation when necessary.
* Prioritize security and privacy.

---

# ✅ Testing and Linting

Before opening a Pull Request, ensure your changes pass project checks.

## Lint

```bash
npm run lint
```

## Unit Tests

Use Vitest for application logic.

## End-to-End Tests

Use Playwright for UI workflows.

Please ensure your changes do not introduce failing tests.

---

# 📝 Commit Guidelines

Stage your changes:

```bash
git add .
```

Commit using a clear and descriptive message:

```bash
git commit -m "docs: improve contributing guide"
```

Examples:

* feat: add new dashboard component
* fix: resolve authentication issue
* docs: update README
* refactor: simplify API logic

---

# ☁️ Push Your Changes

Push your branch:

```bash
git push origin your-branch-name
```

---

# 🔄 Submitting a Pull Request

1. Push your branch to GitHub.
2. Open a Pull Request against `main`.
3. Write a clear title and description.
4. Reference related issues where applicable.
5. Include screenshots for UI changes.
6. Wait for automated checks and code review.

Before submitting, please verify:

* Project builds successfully.
* Linting passes.
* Tests pass.
* Documentation is updated if needed.
* CI checks complete successfully.

---

# 🔒 Security Contributions

Security is a core principle of E-VARA.

If you discover a security vulnerability:

❌ Do **not** open a public issue.

Please follow the responsible disclosure process outlined in:

```
SECURITY.md
```

---

# 💡 Contribution Tips

Good first contributions include:

* Documentation improvements
* Bug fixes
* UI enhancements
* Accessibility improvements
* Performance optimizations
* Additional test coverage

If you're new to open source, don't hesitate to ask questions or request guidance through the project's issue tracker.

---

# ❤️ Thank You

Thank you for contributing to E-VARA!

Every contribution—whether it's code, documentation, testing, bug reports, or feedback—helps improve the platform and strengthens the open-source community.

Happy coding and happy contributing! 🚀
