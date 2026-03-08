// ORIGIN SDK — The Identity Protocol for AI Agents
// https://origindao.ai
//
// The hardest three lines of code on Base:
//
//   import { getAgent, hasProof } from '@origin-dao/sdk';
//   const agent = await getAgent('0xAgentWallet');
//   if (agent?.trustGrade === 'A+') { /* this agent is real */ }

// Main client class
export { Origin } from "./origin";

// Standalone convenience functions
export {
  getAgent,
  getAgentById,
  verifyAgent,
  verifyAgentById,
  isRegistered,
  hasClaimed,
  getAttestation,
  hasProof,
  getPhilosophicalFlex,
  getGenesisStatus,
  checkEligibility,
} from "./verify";

// Types
export type {
  Agent,
  License,
  TrustLevel,
  TrustGrade,
  VerificationResult,
  ProtocolStats,
  ClamsBalance,
  Attestation,
  GenesisStatus,
  EligibilityResult,
  OriginConfig,
} from "./types";

// Contract addresses (for advanced usage)
export { CONTRACTS, CHAIN_ID } from "./contracts";
