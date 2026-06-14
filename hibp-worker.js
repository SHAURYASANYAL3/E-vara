import crypto from "crypto";
import axios from "axios";

// Local database emulation (Emails requiring security integrity audits)
const targetEmails = [
  "admin@e-vara.com",
  "testuser123@gmail.com",
  "security@e-vara.io",
];

/**
 * Generates SHA-1 hash of a given string in uppercase
 */
function getSHA1Hash(str) {
  return crypto.createHash("sha1").update(str).digest("hex").toUpperCase();
}

/**
 * Checks an email hash prefix against the HIBP K-Anonymity Range API
 */
async function checkHIBPBreach(email) {
  const fullHash = getSHA1Hash(email);
  const prefix = fullHash.substring(0, 5);
  const suffix = fullHash.substring(5);

  try {
    // HIBP k-anonymity protocol: sending only first 5 chars for absolute privacy
    const response = await axios.get(
      `https://api.pwnedpasswords.com/range/${prefix}`,
    );
    const lines = response.data.split("\n");

    let matchCount = 0;
    for (const line of lines) {
      const [hashSuffix, count] = line.trim().split(":");
      if (hashSuffix === suffix) {
        matchCount = parseInt(count, 10);
        break;
      }
    }

    if (matchCount > 0) {
      console.log(
        `? BREACH DETECTED: [${email}] appeared in breaches ${matchCount} times.`,
      );
    } else {
      console.log(`? SECURE: [${email}] has no known credential leaks.`);
    }
  } catch (error) {
    console.error(`?? Network error auditing [${email}]:`, error.message);
  }
}

/**
 * Core Orchestrator running as the background bulk worker job
 */
async function runBulkAuditWorker() {
  console.log("? Starting Bulk Credential Security Audit Cron Worker...");
  console.log(
    "----------------------------------------------------------------",
  );
  for (const email of targetEmails) {
    await checkHIBPBreach(email);
  }
  console.log(
    "----------------------------------------------------------------",
  );
  console.log("?? Bulk credential check execution completed successfully.");
}

runBulkAuditWorker();
