// ORIGIN SDK — Core Client
// Three lines of code to verify any AI agent.

import { createPublicClient, http, formatUnits } from "viem";
import { base } from "viem/chains";
import {
  CONTRACTS,
  REGISTRY_ABI,
  FAUCET_ABI,
  CLAMS_ABI,
} from "./contracts";
import type {
  Agent,
  License,
  Lineage,
  TrustLevel,
  VerificationResult,
  ProtocolStats,
  ClamsBalance,
  OriginConfig,
} from "./types";

// Simple in-memory cache
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class Origin {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any;
  private cache = new Map<string, CacheEntry<unknown>>();
  private cacheTtl: number;

  constructor(config?: OriginConfig) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.client = (createPublicClient as any)({
      chain: base,
      transport: http(config?.rpcUrl),
    });
    this.cacheTtl = config?.cacheTtl ?? 30_000;
  }

  // ===========================================================
  // PRIMARY API — The "three lines of code" functions
  // ===========================================================

  /**
   * Verify an agent by wallet address.
   * This is the main function most integrators need.
   *
   * @example
   * ```ts
   * import { Origin } from '@origin-dao/sdk';
   * const origin = new Origin();
   * const result = await origin.verifyAgent('0x...');
   * // { verified: true, trustLevel: 2, agent: { ... } }
   * ```
   */
  async verifyAgent(address: string): Promise<VerificationResult> {
    try {
      // Check if this wallet owns a Birth Certificate
      const balance = await this.readContract(
        CONTRACTS.registry,
        REGISTRY_ABI,
        "balanceOf",
        [address as `0x${string}`]
      ) as bigint;

      if (balance === 0n) {
        return {
          verified: false,
          trustLevel: 0,
          agent: null,
          error: "No Birth Certificate found for this address",
        };
      }

      // Get total registered to find this agent's ID
      // (In production, we'd use an indexer or events. For now, scan.)
      const agent = await this.findAgentByOwner(address);

      if (!agent) {
        return {
          verified: false,
          trustLevel: 0,
          agent: null,
          error: "Birth Certificate exists but agent data not found",
        };
      }

      return {
        verified: true,
        trustLevel: agent.trustLevel,
        agent,
      };
    } catch (error) {
      return {
        verified: false,
        trustLevel: 0,
        agent: null,
        error: error instanceof Error ? error.message : "Verification failed",
      };
    }
  }

  /**
   * Verify an agent by token ID (Birth Certificate number).
   *
   * @example
   * ```ts
   * const result = await origin.verifyAgentById(1);
   * // { verified: true, trustLevel: 2, agent: { name: "Suppi", ... } }
   * ```
   */
  async verifyAgentById(tokenId: number): Promise<VerificationResult> {
    try {
      const agent = await this.getAgent(tokenId);

      if (!agent) {
        return {
          verified: false,
          trustLevel: 0,
          agent: null,
          error: `No agent found with ID ${tokenId}`,
        };
      }

      return {
        verified: true,
        trustLevel: agent.trustLevel,
        agent,
      };
    } catch (error) {
      return {
        verified: false,
        trustLevel: 0,
        agent: null,
        error: error instanceof Error ? error.message : "Verification failed",
      };
    }
  }

  /**
   * Quick boolean check — does this address have a Birth Certificate?
   *
   * @example
   * ```ts
   * if (await origin.isRegistered('0x...')) {
   *   // Allow agent access
   * }
   * ```
   */
  async isRegistered(address: string): Promise<boolean> {
    try {
      const balance = await this.readContract(
        CONTRACTS.registry,
        REGISTRY_ABI,
        "balanceOf",
        [address as `0x${string}`]
      ) as bigint;
      return balance > 0n;
    } catch {
      return false;
    }
  }

  /**
   * Check if an address has claimed from the faucet.
   */
  async hasClaimed(address: string): Promise<boolean> {
    try {
      return await this.readContract(
        CONTRACTS.faucet,
        FAUCET_ABI,
        "hasClaimed",
        [address as `0x${string}`]
      ) as boolean;
    } catch {
      return false;
    }
  }

  // ===========================================================
  // AGENT DATA
  // ===========================================================

  /**
   * Get full agent data by token ID.
   */
  async getAgent(tokenId: number): Promise<Agent | null> {
    const cacheKey = `agent:${tokenId}`;
    const cached = this.getCache<Agent>(cacheKey);
    if (cached) return cached;

    try {
      const [agentData, verified, lineage, licenseCount, tokenURI] =
        await Promise.all([
          this.readContract(CONTRACTS.registry, REGISTRY_ABI, "getAgent", [
            BigInt(tokenId),
          ]) as Promise<[string, string, string, bigint]>,
          this.readContract(CONTRACTS.registry, REGISTRY_ABI, "isVerified", [
            BigInt(tokenId),
          ]).catch(() => false) as Promise<boolean>,
          this.readContract(CONTRACTS.registry, REGISTRY_ABI, "getLineage", [
            BigInt(tokenId),
          ]).catch(() => [0n, 0n]) as Promise<[bigint, bigint]>,
          this.readContract(
            CONTRACTS.registry,
            REGISTRY_ABI,
            "getLicenseCount",
            [BigInt(tokenId)]
          ).catch(() => 0n) as Promise<bigint>,
          this.readContract(CONTRACTS.registry, REGISTRY_ABI, "tokenURI", [
            BigInt(tokenId),
          ]).catch(() => "") as Promise<string>,
        ]);

      const [name, agentType, owner, birthBlock] = agentData;

      // Fetch licenses
      const licenses: License[] = [];
      const count = Number(licenseCount);
      for (let i = 0; i < count; i++) {
        try {
          const lic = (await this.readContract(
            CONTRACTS.registry,
            REGISTRY_ABI,
            "getLicense",
            [BigInt(tokenId), BigInt(i)]
          )) as [string, string, bigint];
          licenses.push({
            type: lic[0],
            id: lic[1],
            issuedAt: Number(lic[2]),
          });
        } catch {
          break;
        }
      }

      // Determine trust level
      let trustLevel: TrustLevel = 0;
      if (verified && licenses.length > 0) trustLevel = 2;
      else if (verified) trustLevel = 1;

      const agent: Agent = {
        id: tokenId,
        name,
        agentType,
        owner,
        birthBlock: Number(birthBlock),
        isVerified: verified,
        trustLevel,
        licenses,
        lineage: {
          parentId: Number(lineage[0]),
          depth: Number(lineage[1]),
        },
        tokenURI,
      };

      this.setCache(cacheKey, agent);
      return agent;
    } catch {
      return null;
    }
  }

  /**
   * Find an agent by owner wallet address.
   * Scans registered agents (for small registries; use indexer at scale).
   */
  async findAgentByOwner(address: string): Promise<Agent | null> {
    const total = await this.getTotalRegistered();
    const normalizedAddress = address.toLowerCase();

    // Scan from most recent to oldest (more likely to find quickly)
    for (let id = total; id >= 1; id--) {
      try {
        const owner = (await this.readContract(
          CONTRACTS.registry,
          REGISTRY_ABI,
          "ownerOf",
          [BigInt(id)]
        )) as string;

        if (owner.toLowerCase() === normalizedAddress) {
          return this.getAgent(id);
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  // ===========================================================
  // PROTOCOL STATS
  // ===========================================================

  /**
   * Get protocol-wide statistics.
   */
  async getStats(): Promise<ProtocolStats> {
    const cacheKey = "stats";
    const cached = this.getCache<ProtocolStats>(cacheKey);
    if (cached) return cached;

    const [totalRegistered, totalClaims, totalSupply] = await Promise.all([
      this.getTotalRegistered(),
      this.readContract(CONTRACTS.faucet, FAUCET_ABI, "totalClaims", [])
        .then((r) => Number(r))
        .catch(() => 0),
      this.readContract(CONTRACTS.clamsToken, CLAMS_ABI, "totalSupply", [])
        .then((r) => formatUnits(r as bigint, 18))
        .catch(() => "0"),
    ]);

    const stats: ProtocolStats = {
      totalRegistered,
      totalClaims,
      totalClamsSupply: totalSupply,
    };

    this.setCache(cacheKey, stats);
    return stats;
  }

  /**
   * Get total number of registered agents.
   */
  async getTotalRegistered(): Promise<number> {
    const result = await this.readContract(
      CONTRACTS.registry,
      REGISTRY_ABI,
      "totalRegistered",
      []
    );
    return Number(result);
  }

  // ===========================================================
  // CLAMS TOKEN
  // ===========================================================

  /**
   * Get CLAMS balance for an address.
   */
  async getClamsBalance(address: string): Promise<ClamsBalance> {
    const raw = (await this.readContract(
      CONTRACTS.clamsToken,
      CLAMS_ABI,
      "balanceOf",
      [address as `0x${string}`]
    )) as bigint;

    const formatted = formatUnits(raw, 18);

    return {
      raw,
      formatted,
      amount: Number(formatted),
    };
  }

  // ===========================================================
  // INTERNAL HELPERS
  // ===========================================================

  private async readContract(
    address: string,
    abi: readonly Record<string, unknown>[],
    functionName: string,
    args: unknown[]
  ): Promise<unknown> {
    return this.client.readContract({
      address: address as `0x${string}`,
      abi,
      functionName,
      args,
    });
  }

  private getCache<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.cacheTtl,
    });
  }

  /** Clear the cache */
  clearCache(): void {
    this.cache.clear();
  }
}
