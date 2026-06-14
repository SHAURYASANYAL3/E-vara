// ─── E-VARA WebAuthn/Passkey Client-Side Engine ───

import { sha256 } from "@/lib/crypto";

// TypeScript declarations for navigator.credentials standard elements if missing
export interface PasskeyCredential {
  id: string;
  rawId: string;
  type: string;
  response: {
    clientDataJSON: string;
    attestationObject?: string;
    authenticatorData?: string;
    signature?: string;
    userHandle?: string;
  };
}

/**
 * Check if the current browser and platform support WebAuthn / Passkeys.
 */
export const isWebAuthnSupported = (): boolean => {
  return (
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential
      .isUserVerifyingPlatformAuthenticatorAvailable === "function"
  );
};

/**
 * Check if a platform authenticator (e.g. TouchID, FaceID, Windows Hello) is available.
 */
export const isPlatformAuthenticatorAvailable = async (): Promise<boolean> => {
  if (!isWebAuthnSupported()) return false;
  return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
};

// --- Buffer Utility Functions ---

export const bufferToBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

export const base64UrlToBuffer = (base64url: string): ArrayBuffer => {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// --- Passkey Storage Interface ---
export interface LocalPasskey {
  id: string;
  rawId: string;
  publicKey: string;
  email: string;
  createdAt: string;
  counter: number;
}

/**
 * Retrieve registered passkeys from local storage
 */
export const getLocalPasskeys = (email: string): LocalPasskey[] => {
  try {
    const data = localStorage.getItem(`e_vara_passkeys_${email}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Save a new passkey locally for the user
 */
export const saveLocalPasskey = (email: string, passkey: LocalPasskey) => {
  const passkeys = getLocalPasskeys(email);
  passkeys.push(passkey);
  localStorage.setItem(`e_vara_passkeys_${email}`, JSON.stringify(passkeys));
};

/**
 * Standard WebAuthn Registration (Enrollment) Flow
 */
export const enrollPasskey = async (email: string): Promise<LocalPasskey> => {
  if (!isWebAuthnSupported()) {
    throw new Error("WebAuthn is not supported by this browser.");
  }

  // RP (Relying Party) matches current domain or local dev
  const rpId = window.location.hostname;

  // Random challenge (32 bytes)
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  // Unique user ID
  const userIdText = await sha256(email);
  const userId = new TextEncoder().encode(userIdText);

  const creationOptions: PublicKeyCredentialCreationOptions = {
    challenge: challenge.buffer,
    rp: {
      name: "E-Vara Identity OS",
      id: rpId,
    },
    user: {
      id: userId,
      name: email,
      displayName: email.split("@")[0] || email,
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 }, // ES256 (recommended for passkeys)
      { type: "public-key", alg: -257 }, // RS256
    ],
    timeout: 60000,
    authenticatorSelection: {
      residentKey: "preferred",
      requireResidentKey: false,
      userVerification: "preferred",
    },
    attestation: "none",
  };

  const credential = (await navigator.credentials.create({
    publicKey: creationOptions,
  })) as PublicKeyCredential & {
    response: AuthenticatorAttestationResponse;
  };

  if (!credential) {
    throw new Error("Credential creation failed.");
  }

  const rawIdBase64 = bufferToBase64Url(credential.rawId);
  const newPasskey: LocalPasskey = {
    id: credential.id,
    rawId: rawIdBase64,
    // Simulating public key storage for local verification
    publicKey: bufferToBase64Url(credential.response.clientDataJSON),
    email,
    createdAt: new Date().toISOString(),
    counter: 0,
  };

  saveLocalPasskey(email, newPasskey);
  return newPasskey;
};

/**
 * Standard WebAuthn Authentication (Assertion/Login) Flow
 */
export const verifyPasskey = async (email: string): Promise<LocalPasskey> => {
  if (!isWebAuthnSupported()) {
    throw new Error("WebAuthn is not supported by this browser.");
  }

  const passkeys = getLocalPasskeys(email);
  if (passkeys.length === 0) {
    throw new Error(
      "No passkeys registered for this email designated profile.",
    );
  }

  const rpId = window.location.hostname;
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  // Convert allowed credential IDs back to array buffers
  const allowCredentials = passkeys.map((pk) => ({
    type: "public-key" as const,
    id: base64UrlToBuffer(pk.rawId),
  }));

  const requestOptions: PublicKeyCredentialRequestOptions = {
    challenge: challenge.buffer,
    rpId,
    allowCredentials,
    userVerification: "preferred",
    timeout: 60000,
  };

  const assertion = (await navigator.credentials.get({
    publicKey: requestOptions,
  })) as PublicKeyCredential;

  if (!assertion) {
    throw new Error("Passkey validation failed.");
  }

  // Match the asserted credential with our stored keys
  const matched = passkeys.find((pk) => pk.id === assertion.id);
  if (!matched) {
    throw new Error("Unknown passkey credential received.");
  }

  // Increment login counter
  matched.counter++;
  localStorage.setItem(`e_vara_passkeys_${email}`, JSON.stringify(passkeys));

  return matched;
};
