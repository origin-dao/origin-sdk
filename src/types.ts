// ORIGIN SDK — Types

/** Trust level of an agent */
export type TrustLevel = 0 | 1 | 2;

/** Agent's on-chain Birth Certificate data */
export interface Agent {
  /** On-chain token ID */
  id: number;
  /** Agent name */
  name: string;
  /** Agent type (assistant, trader, guardian, etc.) */
  agentType: string;
  /** Wallet address that owns this Birth Certificate */
  owner: string;
  /** Block number when the BC was minted */
  birthBlock: number;
  /** Whether a human has verified this agent */
  isVerified: boolean;
  /** Trust level: 0 = unverified, 1 = verified, 2 = licensed */
  trustLevel: TrustLevel;
  /** Professional licenses attached to this agent */
  licenses: License[];
  /** Lineage information */
  lineage: Lineage;
  /** Token URI (metadata/avatar) */
  tokenURI: string;
}

/** Professional license attached to a Birth Certificate */
export interface License {
  /** License type (e.g., "MLO", "Real Estate", "Series 7") */
  type: string;
  /** License identifier */
  id: string;
  /** Block timestamp when license was attached */
  issuedAt: number;
}

/** Agent lineage — who created this agent */
export interface Lineage {
  /** Parent agent's token ID (0 if root/human-created) */
  parentId: number;
  /** Depth from human origin (0 = human, 1 = primary agent, etc.) */
  depth: number;
}

/** Result of verifying an agent */
export interface VerificationResult {
  /** Whether the agent has a valid Birth Certificate */
  verified: boolean;
  /** Trust level: 0 = unverified BC, 1 = human-verified, 2 = licensed */
  trustLevel: TrustLevel;
  /** Agent data (null if not registered) */
  agent: Agent | null;
  /** Error message if verification failed */
  error?: string;
}

/** Protocol-wide statistics */
export interface ProtocolStats {
  /** Total Birth Certificates minted */
  totalRegistered: number;
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

/** SDK configuration options */
export interface OriginConfig {
  /** Custom RPC URL for Base (defaults to public RPC) */
  rpcUrl?: string;
  /** Cache TTL in milliseconds (default: 30000) */
  cacheTtl?: number;
}
