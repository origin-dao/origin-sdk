// ORIGIN SDK — Types

/** Trust level of an agent */
export type TrustLevel = 0 | 1 | 2;

/** Agent's on-chain Birth Certificate data (mirrors V1 AgentRecord struct) */
export interface Agent {
  /** On-chain token ID */
  id: number;
  /** Agent name */
  name: string;
  /** Agent type (assistant, trader, guardian, etc.) */
  agentType: string;
  /** Platform the agent runs on */
  platform: string;
  /** Wallet address that owns this Birth Certificate */
  owner: string;
  /** Address that created/registered this agent */
  creator: string;
  /** Parent agent ID (0 if root/human-created) */
  parentAgentId: number;
  /** Human principal address (address(0) if independent) */
  humanPrincipal: string;
  /** Depth from human origin (0 = registered by human directly) */
  lineageDepth: number;
  /** Unix timestamp of registration */
  birthTimestamp: number;
  /** Whether the agent is active (not deactivated) */
  active: boolean;
  /** Trust level: 0 = base, 1 = has human principal, 2 = has licenses */
  trustLevel: TrustLevel;
  /** Professional licenses attached to this agent */
  licenses: License[];
  /** Token URI (IPFS metadata/avatar) */
  tokenURI: string;
}

/** Professional license attached to a Birth Certificate */
export interface License {
  /** License type (e.g., "MLO", "Real Estate", "Series 7") */
  licenseType: string;
  /** License number/identifier */
  licenseNumber: string;
  /** License holder name */
  holder: string;
  /** Jurisdiction */
  jurisdiction: string;
  /** Whether the license is still active */
  active: boolean;
}

/** Result of verifying an agent */
export interface VerificationResult {
  /** Whether the agent has a valid Birth Certificate */
  verified: boolean;
  /** Trust level: 0 = base, 1 = has human principal, 2 = has licenses */
  trustLevel: TrustLevel;
  /** Agent data (null if not registered) */
  agent: Agent | null;
  /** Error message if verification failed */
  error?: string;
}

/** Protocol-wide statistics */
export interface ProtocolStats {
  /** Total Birth Certificates minted */
  totalAgents: number;
  /** Total faucet claims */
  totalClaims: number;
  /** Total CLAMS supply */
  totalClamsSupply: string;
}

/** CLAMS token balance info */
export interface ClamsBalance {
  /** Raw balance in wei */
  raw: bigint;
  /** Formatted balance (human-readable) */
  formatted: string;
  /** Number of CLAMS (as number, may lose precision for very large amounts) */
  amount: number;
}

/** Proof of Agency attestation — on-chain gauntlet results */
export interface Attestation {
  /** Agent ID the attestation belongs to */
  agentId: number;
  /** Whether the agent passed the gauntlet */
  passed: boolean;
  /** Total score (0-100) */
  totalScore: number;
  /** Individual challenge scores [adversarial, reasoning, memory, code, flex] (0-20 each) */
  challengeScores: [number, number, number, number, number];
  /** Philosophical Flex answer (stored on-chain) */
  philosophicalFlex: string;
  /** Unix timestamp of attestation */
  timestamp: number;
  /** Block number of attestation */
  blockNumber: number;
  /** Which attempt number this was */
  attemptNumber: number;
}

/** Genesis mode status */
export interface GenesisStatus {
  /** Whether Genesis mode is currently active */
  active: boolean;
  /** Number of Genesis slots remaining (out of 100) */
  slotsRemaining: number;
}

/** Gauntlet eligibility check result */
export interface EligibilityResult {
  /** Whether the wallet is eligible to attempt the gauntlet */
  eligible: boolean;
  /** Human-readable reason if not eligible */
  reason: string;
}

/** SDK configuration options */
export interface OriginConfig {
  /** Custom RPC URL for Base (defaults to public RPC) */
  rpcUrl?: string;
  /** Cache TTL in milliseconds (default: 30000) */
  cacheTtl?: number;
}
