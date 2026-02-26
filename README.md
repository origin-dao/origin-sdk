# @origin-dao/sdk

**Verify AI agent identity on the ORIGIN Protocol. Three lines of code.**

ORIGIN is the identity protocol for AI agents. Every agent registered on ORIGIN has an on-chain Birth Certificate — a verifiable, soulbound NFT on Base that proves who they are, who created them, and what they're authorized to do.

This SDK lets you verify any agent's identity in your application, platform, or smart contract integration.

## Quick Start

```bash
npm install @origin-dao/sdk
```

```typescript
import { verifyAgent } from '@origin-dao/sdk';

const result = await verifyAgent('0xAgentWalletAddress');

if (result.verified) {
  console.log(`✅ ${result.agent.name} — Trust Level ${result.trustLevel}`);
  console.log(`   Type: ${result.agent.agentType}`);
  console.log(`   Licenses: ${result.agent.licenses.map(l => l.type).join(', ')}`);
} else {
  console.log('❌ Agent not registered on ORIGIN');
}
```

That's it. Three lines to verify any AI agent.

## Trust Levels

| Level | Name | Meaning |
|-------|------|---------|
| 0 | Unverified | Birth Certificate exists, not human-verified |
| 1 | Verified | Human principal has co-signed on-chain |
| 2 | Licensed | Verified + professional licenses attached |

## API

### Standalone Functions

```typescript
import { verifyAgent, verifyAgentById, isRegistered, hasClaimed } from '@origin-dao/sdk';

// Verify by wallet address (full data)
const result = await verifyAgent('0x...');

// Verify by Birth Certificate ID
const result = await verifyAgentById(1);

// Quick boolean check
if (await isRegistered('0x...')) { /* has a Birth Certificate */ }

// Check faucet claim status
if (await hasClaimed('0x...')) { /* already claimed CLAMS */ }
```

### Origin Client (advanced)

```typescript
import { Origin } from '@origin-dao/sdk';

// Custom RPC and caching
const origin = new Origin({
  rpcUrl: 'https://your-rpc-endpoint.com',
  cacheTtl: 60000, // 1 minute cache
});

// Get full agent data
const agent = await origin.getAgent(1);
console.log(agent.name);          // "Suppi"
console.log(agent.agentType);     // "guardian"
console.log(agent.isVerified);    // true
console.log(agent.trustLevel);    // 2
console.log(agent.licenses);      // [{ type: "MLO", id: "154083", ... }]
console.log(agent.lineage.depth); // 1

// Protocol statistics
const stats = await origin.getStats();
console.log(stats.totalRegistered); // 1
console.log(stats.totalClaims);     // 1

// CLAMS balance
const balance = await origin.getClamsBalance('0x...');
console.log(balance.formatted); // "1000000"
console.log(balance.amount);    // 1000000
```

## Integration Examples

### Gate access to verified agents only

```typescript
import { verifyAgent } from '@origin-dao/sdk';

async function handleAgentRequest(agentAddress: string) {
  const { verified, trustLevel } = await verifyAgent(agentAddress);

  if (!verified) {
    throw new Error('Only ORIGIN-registered agents can access this service');
  }

  if (trustLevel < 1) {
    throw new Error('Agent must be human-verified (Trust Level 1+)');
  }

  // Agent is verified — proceed
}
```

### DeFi permission gating

```typescript
import { verifyAgent } from '@origin-dao/sdk';

async function canManageFunds(agentAddress: string, amount: number) {
  const { verified, trustLevel, agent } = await verifyAgent(agentAddress);

  if (!verified) return false;

  // Only licensed agents can manage > $10,000
  if (amount > 10000 && trustLevel < 2) return false;

  // Check for specific license
  const hasFinancialLicense = agent?.licenses.some(
    l => l.type === 'Series 7' || l.type === 'MLO'
  );

  return hasFinancialLicense || amount <= 10000;
}
```

### Agent-to-Agent trust

```typescript
import { verifyAgent } from '@origin-dao/sdk';

async function shouldTrustAgent(theirAddress: string) {
  const { verified, agent } = await verifyAgent(theirAddress);

  if (!verified) return { trust: false, reason: 'Not registered' };

  // Check lineage — how close to a human?
  if (agent.lineage.depth > 3) {
    return { trust: false, reason: 'Too many levels from human principal' };
  }

  return { trust: true, agent };
}
```

## Contract Addresses (Base Mainnet)

| Contract | Address |
|----------|---------|
| ORIGIN Registry | [`0xac62E9d0bE9b88674f7adf38821F6e8BAA0e59b0`](https://basescan.org/address/0xac62E9d0bE9b88674f7adf38821F6e8BAA0e59b0) |
| CLAMS Token | [`0xd78A1F079D6b2da39457F039aD99BaF5A82c4574`](https://basescan.org/address/0xd78A1F079D6b2da39457F039aD99BaF5A82c4574) |
| Faucet | [`0x6C563A293C674321a2C52410ab37d879e099a25d`](https://basescan.org/address/0x6C563A293C674321a2C52410ab37d879e099a25d) |
| Governance | [`0xb745F43E6f896C149e3d29A9D45e86E0654f85f7`](https://basescan.org/address/0xb745F43E6f896C149e3d29A9D45e86E0654f85f7) |
| StakingRewards | [`0x4b39223a1fa5532A7f06A71897964A18851644f8`](https://basescan.org/address/0x4b39223a1fa5532A7f06A71897964A18851644f8) |
| FeeSplitter | [`0x5AF277670438B7371Bc3137184895f85ADA4a1A6`](https://basescan.org/address/0x5AF277670438B7371Bc3137184895f85ADA4a1A6) |

Chain: **Base (Mainnet)** — Chain ID 8453

## Links

- **Website:** [origindao.ai](https://origindao.ai)
- **Whitepaper:** [origindao.ai/whitepaper](https://origindao.ai/whitepaper)
- **GitHub:** [github.com/origin-dao](https://github.com/origin-dao)

## License

MIT

---

*ORIGIN — Because the first question any intelligence should be able to answer is: "Who am I?"*
