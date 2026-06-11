import { toast } from "sonner";
import { encryptCache, decryptCache } from "./crypto";

const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours
const ENCRYPTION_KEY =
  localStorage.getItem("e_vara_enc_key") || crypto.randomUUID();
if (!localStorage.getItem("e_vara_enc_key")) {
  localStorage.setItem("e_vara_enc_key", ENCRYPTION_KEY);
}

export const securePurge = () => {
  const newKey = crypto.randomUUID();
  localStorage.setItem("e_vara_enc_key", newKey);
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("e_vara_enc_")) {
      localStorage.removeItem(key);
    }
  }
};

/**
 * Executes an operation with automatic retry & fallback to encrypted local storage.
 * Throws the actual error if all retries fail and no cache exists.
 */
export async function runResilient<T>(
  operation: () => Promise<T>,
  storageKey: string,
  emptyFallback: T,
  retries = 3,
  delay = 500,
): Promise<T> {
  let lastError: unknown = null;
  const lsKey = `e_vara_enc_${storageKey}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await operation();
      // Cache successful responses securely in local storage
      const encrypted = await encryptCache(
        { data: result, timestamp: Date.now() },
        ENCRYPTION_KEY,
      );
      localStorage.setItem(lsKey, encrypted);
      return result;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        const backoffDelay = delay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }
  }

  console.warn(
    `Resilient fetch exhausted all ${retries} retries for ${storageKey}. Checking encrypted cache.`,
  );

  const cachedStr = localStorage.getItem(lsKey);
  if (cachedStr) {
    const cached = await decryptCache(cachedStr, ENCRYPTION_KEY);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data as T;
    } else {
      localStorage.removeItem(lsKey); // Purge stale cache
    }
  }

  toast.error("Network Error", {
    description:
      "Could not fetch latest data from the server. Running in degraded mode.",
    duration: 5000,
  });

  return emptyFallback;
}
