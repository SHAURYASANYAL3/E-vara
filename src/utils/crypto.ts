// Browser-compatible encryption utility using Web Crypto API (AES-GCM)
const ENCRYPTION_KEY_SECRET = "super-secret-key-must-be-32-bytes-long!"; // Fallback string

// Helper to derive a stable CryptoKey from a secret string
async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(ENCRYPTION_KEY_SECRET.padEnd(32, "0").slice(0, 32)),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"],
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("e-vara-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}

/**
 * Encrypts clear text using AES-GCM 256
 */
export async function encrypt(text: string): Promise<string> {
  try {
    const cryptoKey = await getCryptoKey();
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      cryptoKey,
      enc.encode(text),
    );

    const encryptedBytes = new Uint8Array(encryptedBuffer);

    // Combine IV and Encrypted content to safe hex format
    const combined = new Uint8Array(iv.length + encryptedBytes.length);
    combined.set(iv);
    combined.set(encryptedBytes, iv.length);

    return Array.from(combined)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Could not securely encrypt data");
  }
}

/**
 * Decrypts hex encoded values back to clear text
 */
export async function decrypt(hexString: string): Promise<string> {
  try {
    const cryptoKey = await getCryptoKey();

    // Convert hex string back to byte array
    const combined = new Uint8Array(
      hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
    );

    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      cryptoKey,
      encryptedData,
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Could not securely decrypt data");
  }
}
