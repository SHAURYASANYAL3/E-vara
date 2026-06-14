# E-VARA: Operational Intelligence & Acquisition Blueprint

## 1. Core Architecture

E-VARA is built for high-scale identity monitoring. The frontend is a React 18 single-page application (SPA), and the backend is a serverless cluster managed by Supabase.

### Identity Hashing Protocol

We use the Web Crypto API to perform **SHA-256 hashing** on the client side before any identifier hits our analytics engine. This ensures PII (Personally Identifiable Information) compliance.

## 2. Infrastructure Stack

- **Database**: PostgreSQL (Supabase) with Row Level Security (RLS) enabled.
- **Auth**: Supabase Auth (JWT-based).
- **Intelligence Engine**: Deno Edge Functions (located in `/supabase/functions`).
- **State Management**: TanStack Query (React Query) for server-side synchronization.

## 3. Local Simulation Mode (Resiliency)

The platform features a built-in **Resiliency Layer**. In `src/integrations/supabase/client.ts`, if environment variables are missing or if the health check fails, the app enters **Simulation Mode**.

- **Transparent Logic**: The UI informs the user ("Local Simulation Active") instead of failing or masking errors.
- **Development Speed**: Allows designers and developers to work on the UI/UX without needing a live database connection.

## 4. Deployment Guide

1.  **Backend**: Run the contents of `schema.sql` in your Supabase SQL editor.
2.  **Edge Functions**: Deploy the `breach-check` function using the Supabase CLI:
    ```bash
    supabase functions deploy breach-check
    ```
3.  **Frontend**: Connect `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in your CI/CD provider (Vercel/Netlify).

## 5. Security & Compliance

- **Audit Logs**: All critical events (logins, scans) are recorded in the `security_audit_logs` table.
- **Privacy**: No plaintext emails are stored in the primary monitoring table; only SHA-256 hashes are used for leak matching.
