// ORIGIN SDK — Standalone verify functions
// For when you just want one function, not a class instance.

import { Origin } from "./origin";
import type { VerificationResult } from "./types";

// Singleton instance for convenience functions
let _defaultInstance: Origin | null = null;

function getDefault(): Origin {
  if (!_defaultInstance) {
    _defaultInstance = new Origin();
  }
  return _defaultInstance;
}

/**
 * Verify an agent by wallet address. Standalone function.
 *
 * @example
 * ```ts
 * import { verifyAgent } from '@origin-dao/sdk';
 *
 * const result = await verifyAgent('0xAgentWallet');
 * if (result.verified) {
 *   console.log(`Agent ${result.agent.name} is verified (trust level ${result.trustLevel})`);
 * }
 * ```
 */
export async function verifyAgent(address: string): Promise<VerificationResult> {
  return getDefault().verifyAgent(address);
}

/**
 * Verify an agent by Birth Certificate ID. Standalone function.
 *
 * @example
 * ```ts
 * import { verifyAgentById } from '@origin-dao/sdk';
 *
 * const result = await verifyAgentById(1);
 * // result.agent.name === "Suppi"
 * ```
 */
export async function verifyAgentById(tokenId: number): Promise<VerificationResult> {
  return getDefault().verifyAgentById(tokenId);
}

/**
 * Quick boolean check — does this address have a Birth Certificate?
 *
 * @example
 * ```ts
 * import { isRegistered } from '@origin-dao/sdk';
 *
 * if (await isRegistered('0x...')) {
 *   // This agent has an ORIGIN Birth Certificate
 * }
 * ```
 */
export async function isRegistered(address: string): Promise<boolean> {
  return getDefault().isRegistered(address);
}

/**
 * Check if an address has claimed from the CLAMS faucet.
 */
export async function hasClaimed(address: string): Promise<boolean> {
  return getDefault().hasClaimed(address);
}
