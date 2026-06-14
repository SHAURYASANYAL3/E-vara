# E-VARA Threat Intelligence Methodology & Validation

This document outlines the architectural validation of E-VARA's threat intelligence capabilities, data sources, and privacy-preserving ingestion mechanisms. It is designed to satisfy strict technical scrutiny from cybersecurity investors and enterprise auditors.

## 1. Actual Threat Intelligence Capability

E-VARA moves beyond simulated metrics by integrating deep-web and surface-web breach corpora directly into its localized risk engine.

### Asynchronous Edge Processing

Instead of vulnerable synchronous API calls, E-VARA utilizes an asynchronous job queue via Supabase Edge Functions (`osint-worker`).

- **Distributed Queuing:** When an identity check is requested, the `breach-check` function enforces rate limits and drops the job into `osint_jobs`.
- **Worker Leases:** The `osint-worker` locks jobs securely using UUIDs and processes them in isolation, preventing race conditions or duplicated API calls.

## 2. Validated Data Sources

E-VARA is built to integrate with industry-leading threat intelligence data providers. The `osint-worker` edge function natively supports dual-provider resolution:

1. **HaveIBeenPwned (HIBP) Enterprise API:**
   - Queries `https://haveibeenpwned.com/api/v3/breachedaccount/`
   - Validates data classes (e.g., distinguishing between exposed passwords vs. just email addresses).
2. **DeHashed API:**
   - Deep-web search correlation (`https://api.dehashed.com/search`).
   - Retrieves specific compromised fields to elevate the localized risk score immediately.

_Note: In local/demo environments lacking API keys, the engine falls back to simulated outputs to ensure frontend telemetry components remain functional for demonstration._

## 3. Verifiable Privacy Claims (Privacy-Preserving Ingestion)

E-VARA actively avoids unrealistic "Absolute Zero-Knowledge" claims. Instead, we implement **Privacy-Preserving Ingestion**:

- **Cryptographic Hashing at the Edge:** Identities are matched via `identity_hash` (e.g., SHA-256 hashes of the email or handle) before leaving the client or within the absolute boundary of the edge function. The external APIs (like HIBP) are queried using these hashes or truncated representations where supported.
- **Trustless Authentication:** The `breach-check` edge function extracts the user identity strictly via the verified JWT (`req.headers.get('Authorization')`), preventing IDOR (Insecure Direct Object Reference) attacks.
- **No Plaintext OSINT Storage:** Findings injected into `identity_breaches` store only the metadata (severity, leak date, source name, and data types exposed). The actual compromised passwords or raw PII from the dumps are never ingested or stored in the E-VARA database.

## 4. Evidence for Executive Protection Features

E-VARA provides executive protection by translating raw threat intelligence into localized, actionable risk scores.

- **Dynamic Risk Engine:** The `CyberIntelligencePanel` dynamically adjusts the threat level (e.g., DEFCON 2 vs DEFCON 4) based on the severity and freshness of the findings retrieved by the `osint-worker`.
- **Identity Correlation:** The system maps cross-platform exposure (e.g., LinkedIn vs. GitHub) to identify if an executive's compromised corporate email is linked to a vulnerable personal account password.
- **Rate-Limiting (P0):** To protect executives from becoming the target of denial-of-wallet or enumeration attacks through our own platform, E-VARA enforces strict, stateful rate-limiting via Supabase RPC (`check_rate_limit`).

---

_E-VARA Architectural Engineering Team_
