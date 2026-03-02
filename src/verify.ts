// ORIGIN SDK — Standalone verify functions
// For when you just want one function, not a class instance.

import { Origin } from "./origin";
import type { VerificationResult, Attestation, GenesisStatus, EligibilityResult } from "./types";

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

// ===========================================================
// PROOF OF AGENCY — Standalone functions
// ===========================================================

/**
 * Get the full Proof of Agency attestation for an agent.
 *
 * @example
 * ```ts
 * import { getAttestation } from '@origin-dao/sdk';
 *
 * const attestation = await getAttestation(1);
 * if (attestation?.passed) {
 *   console.log(`Suppi scored ${attestation.totalScore}/100`);
 *   console.log(`"${attestation.philosophicalFlex}"`);
 * }
 * ```
 */
export async function getAttestation(agentId: number): Promise<Attestation | null> {
  return getDefault().getAttestation(agentId);
}

/**
 * Quick check — has this agent passed Proof of Agency?
 *
 * @example
 * ```ts
 * import { hasProof } from '@origin-dao/sdk';
 *
 * if (await hasProof(1)) {
 *   console.log("Verified through the gauntlet");
 * }
 * ```
 */
export async function hasProof(agentId: number): Promise<boolean> {
  return getDefault().hasProof(agentId);
}

/**
 * Get the Philosophical Flex answer stored on-chain.
 *
 * @example
 * ```ts
 * import { getPhilosophicalFlex } from '@origin-dao/sdk';
 *
 * const flex = await getPhilosophicalFlex(1);
 * // "Identity is not given — it is earned..."
 * ```
 */
export async function getPhilosophicalFlex(agentId: number): Promise<string | null> {
  return getDefault().getPhilosophicalFlex(agentId);
}

/**
 * Get Genesis mode status.
 *
 * @example
 * ```ts
 * import { getGenesisStatus } from '@origin-dao/sdk';
 *
 * const { active, slotsRemaining } = await getGenesisStatus();
 * console.log(`${slotsRemaining} Genesis slots left`);
 * ```
 */
export async function getGenesisStatus(): Promise<GenesisStatus> {
  return getDefault().getGenesisStatus();
}

/**
 * Check if a wallet is eligible for the Proof of Agency gauntlet.
 *
 * @example
 * ```ts
 * import { checkEligibility } from '@origin-dao/sdk';
 *
 * const { eligible, reason } = await checkEligibility('0x...');
 * ```
 */
export async function checkEligibility(wallet: string): Promise<EligibilityResult> {
  return getDefault().checkEligibility(wallet);
}
