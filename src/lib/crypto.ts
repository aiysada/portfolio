/**
 * Indie Sign — Client-Side PIN Hashing & Security Utilities
 *
 * IMPORTANT SECURITY DISCLOSURE:
 * This is a frontend-only application with no backend server.
 * The client-side PIN is only a basic access barrier to prevent casual access.
 * Anyone with access to browser developer tools, localStorage, or application code
 * can inspect or bypass this barrier. Do not treat this as enterprise-grade security.
 */

const SALT = "indie_sign_pin_salt_v1_";

/**
 * Synchronous hash function fallback (djb2 + hex) safe in any JS environment.
 */
function simpleHash(input: string): string {
  let hash = 5381;
  const str = SALT + input;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  // Convert to unsigned 32-bit hex
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * Hash a PIN string. Uses Web Crypto SHA-256 when available, falling back to simpleHash.
 */
export async function hashPin(pin: string): Promise<string> {
  const salted = `${SALT}:${pin}`;
  try {
    if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
      const msgUint8 = new TextEncoder().encode(salted);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {
    // Fall through to synchronous fallback
  }
  return simpleHash(pin);
}

/**
 * Verify if an entered PIN matches a stored hash.
 */
export async function verifyPin(enteredPin: string, storedHash: string): Promise<boolean> {
  const hash = await hashPin(enteredPin);
  return hash === storedHash;
}

/**
 * Default PIN constant and default hash for "1234"
 */
export const DEFAULT_PIN = "1234";
// Precomputed fallback hash for "1234"
export const DEFAULT_PIN_HASH = simpleHash(DEFAULT_PIN);
