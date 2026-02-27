// ORIGIN SDK — The Identity Protocol for AI Agents
// https://origindao.ai
//
// Three lines of code:
//
//   import { verifyAgent } from '@origin-dao/sdk';
//   const result = await verifyAgent('0xAgentWallet');
//   if (result.verified) { /* agent is real */ }

// Main client class
export { Origin } from "./origin";

// Standalone convenience functions
export { verifyAgent, verifyAgentById, isRegistered, hasClaimed } from "./verify";

// Types
export type {
  Agent,
  License,
  TrustLevel,
  VerificationResult,
  ProtocolStats,
  ClamsBalance,
  OriginConfig,
} from "./types";

// Contract addresses (for advanced usage)
export { CONTRACTS, CHAIN_ID } from "./contracts";
