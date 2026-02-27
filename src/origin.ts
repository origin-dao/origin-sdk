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
      // Parallel fetch: agent record, licenses, owner, tokenURI
      const [record, licenses, owner, tokenURI] =
        await Promise.all([
          this.readContract(CONTRACTS.registry, REGISTRY_ABI, "getAgent", [
            BigInt(tokenId),
          ]) as Promise<{
            name: string;
            agentType: string;
            platform: string;
            creator: string;
            parentAgentId: bigint;
            humanPrincipal: string;
            lineageDepth: bigint;
            birthTimestamp: bigint;
            publicKeyHash: string;
            active: boolean;
          }>,
          this.readContract(CONTRACTS.registry, REGISTRY_ABI, "getLicenses", [
            BigInt(tokenId),
          ]).catch(() => []) as Promise<Array<{
            licenseType: string;
            licenseNumber: string;
            holder: string;
            jurisdiction: string;
            active: boolean;
          }>>,
          this.readContract(CONTRACTS.registry, REGISTRY_ABI, "ownerOf", [
            BigInt(tokenId),
          ]) as Promise<string>,
          this.readContract(CONTRACTS.registry, REGISTRY_ABI, "tokenURI", [
            BigInt(tokenId),
          ]) as Promise<string>,
        ]);

      // Compute trust level: 0 = base, 1 = has human principal, 2 = has active licenses
      const hasHumanPrincipal = record.humanPrincipal !== "0x0000000000000000000000000000000000000000";
      const activeLicenses = licenses.filter((l) => l.active);
      const trustLevel: TrustLevel = activeLicenses.length > 0 ? 2 : hasHumanPrincipal ? 1 : 0;

      const agent: Agent = {
        id: tokenId,
        name: record.name,
        agentType: record.agentType,
        platform: record.platform,
        owner,
        creator: record.creator,
        parentAgentId: Number(record.parentAgentId),
        humanPrincipal: record.humanPrincipal,
        lineageDepth: Number(record.lineageDepth),
        birthTimestamp: Number(record.birthTimestamp),
        active: record.active,
        trustLevel,
        licenses: licenses.map((l) => ({
          licenseType: l.licenseType,
          licenseNumber: l.licenseNumber,
          holder: l.holder,
          jurisdiction: l.jurisdiction,
          active: l.active,
        })),
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
   */
  async findAgentByOwner(address: string): Promise<Agent | null> {
    const total = await this.getTotalAgents();
    const normalizedAddress = address.toLowerCase();

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

  /**
   * Find all agents created by a specific address.
   */
  async getAgentsByCreator(address: string): Promise<number[]> {
    try {
      const ids = await this.readContract(
        CONTRACTS.registry,
        REGISTRY_ABI,
        "getAgentsByCreator",
        [address as `0x${string}`]
      ) as bigint[];
      return ids.map((id) => Number(id));
    } catch {
      return [];
    }
  }

  /**
   * Check if an agent has a specific license type.
   */
  async hasLicense(tokenId: number, licenseType: string): Promise<boolean> {
    try {
      return await this.readContract(
        CONTRACTS.registry,
        REGISTRY_ABI,
        "hasLicense",
        [BigInt(tokenId), licenseType]
      ) as boolean;
    } catch {
      return false;
    }
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

    const [totalAgents, totalClaims, totalSupply] = await Promise.all([
      this.getTotalAgents(),
      this.readContract(CONTRACTS.faucet, FAUCET_ABI, "totalClaims", [])
        .then((r) => Number(r))
        .catch(() => 0),
      this.readContract(CONTRACTS.clamsToken, CLAMS_ABI, "totalSupply", [])
        .then((r) => formatUnits(r as bigint, 18))
        .catch(() => "0"),
    ]);

    const stats: ProtocolStats = {
      totalAgents,
      totalClaims,
      totalClamsSupply: totalSupply,
    };

    this.setCache(cacheKey, stats);
    return stats;
  }

  /**
   * Get total number of registered agents.
   */
  async getTotalAgents(): Promise<number> {
    const result = await this.readContract(
      CONTRACTS.registry,
      REGISTRY_ABI,
      "totalAgents",
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
