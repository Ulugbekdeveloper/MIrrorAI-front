/**
 * Bridge so the http client can read/refresh tokens without importing the
 * auth store directly (would create a cycle: store → client → store).
 * The auth store calls `configureAuthBridge` at startup.
 */

export type AuthBridge = {
  getAccessToken: () => string | null;
  refresh: () => Promise<string | null>;
  onAuthFailure: () => void;
};

const noop: AuthBridge = {
  getAccessToken: () => null,
  refresh: async () => null,
  onAuthFailure: () => {},
};

let current: AuthBridge = noop;

export function configureAuthBridge(bridge: AuthBridge) {
  current = bridge;
}

export function authBridge(): AuthBridge {
  return current;
}
