import { useState, useEffect } from "react";

interface DeviceIntegrityScore {
  score: number;
  factors: string[];
  passkeySupported: boolean;
  secureEnclave: boolean;
}

export const useDeviceIntegrity = () => {
  const [integrity, setIntegrity] = useState<DeviceIntegrityScore>({
    score: 0,
    factors: [],
    passkeySupported: false,
    secureEnclave: false,
  });

  useEffect(() => {
    // Layer 1: Device Integrity Shield (Client-Side Heuristics)
    const checkIntegrity = async () => {
      let currentScore = 50; // Base score
      const factors: string[] = [];
      let passkeySupported = false;
      const secureEnclave = false;

      // 1. Check WebAuthn / Passkey Support
      if (window.PublicKeyCredential) {
        try {
          const available =
            await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          if (available) {
            currentScore += 30;
            passkeySupported = true;
            factors.push("Hardware Authenticator Available");
          }
        } catch (e) {
          // Ignore
        }
      }

      // 2. Browser Environment Checks (Basic heuristic for isolation)
      if (window.isSecureContext) {
        currentScore += 10;
        factors.push("Secure Context (HTTPS)");
      }

      // 3. Hardware Concurrency / Memory (Rough heuristic to detect basic VMs/headless)
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 4) {
        currentScore += 10;
        factors.push("Standard Hardware Signature");
      } else {
        factors.push("Suspicious Hardware Allocation");
      }

      setIntegrity({
        score: Math.min(100, currentScore),
        factors,
        passkeySupported,
        secureEnclave,
      });
    };

    checkIntegrity();
  }, []);

  return integrity;
};
