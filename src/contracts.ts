// ORIGIN Protocol — Contract Addresses & ABIs (Base Mainnet)
// ABI derived from OriginRegistry.sol (V1) deployed at 0xac62E9d0bE9b88674f7adf38821F6e8BAA0e59b0

export const CHAIN_ID = 8453; // Base Mainnet
export const BASE_RPC = "https://mainnet.base.org";

export const CONTRACTS = {
  registry: "0xac62E9d0bE9b88674f7adf38821F6e8BAA0e59b0",
  clamsToken: "0xd78A1F079D6b2da39457F039aD99BaF5A82c4574",
  faucet: "0x6C563A293C674321a2C52410ab37d879e099a25d",
  governance: "0xb745F43E6f896C149e3d29A9D45e86E0654f85f7",
  stakingRewards: "0x4b39223a1fa5532A7f06A71897964A18851644f8",
  feeSplitter: "0x5AF277670438B7371Bc3137184895f85ADA4a1A6",
} as const;

// OriginRegistry ABI (V1) — deployed contract
export const REGISTRY_ABI = [
  // getAgent(uint256) → AgentRecord (V1 struct — no humanVerified fields)
  {
    inputs: [{ name: "agentId", type: "uint256" }],
    name: "getAgent",
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "agentType", type: "string" },
          { name: "platform", type: "string" },
          { name: "creator", type: "address" },
          { name: "parentAgentId", type: "uint256" },
          { name: "humanPrincipal", type: "address" },
          { name: "lineageDepth", type: "uint256" },
          { name: "birthTimestamp", type: "uint256" },
          { name: "publicKeyHash", type: "bytes32" },
          { name: "active", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // totalAgents() → uint256
  {
    inputs: [],
    name: "totalAgents",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // ownerOf(uint256) → address (ERC-721)
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  // balanceOf(address) → uint256 (ERC-721)
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // tokenURI(uint256) → string (ERC-721)
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  // isValid(uint256) → bool
  {
    inputs: [{ name: "agentId", type: "uint256" }],
    name: "isValid",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // verifyByKey(bytes32) → (uint256, AgentRecord)
  {
    inputs: [{ name: "publicKeyHash", type: "bytes32" }],
    name: "verifyByKey",
    outputs: [
      { name: "agentId", type: "uint256" },
      {
        name: "record",
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "agentType", type: "string" },
          { name: "platform", type: "string" },
          { name: "creator", type: "address" },
          { name: "parentAgentId", type: "uint256" },
          { name: "humanPrincipal", type: "address" },
          { name: "lineageDepth", type: "uint256" },
          { name: "birthTimestamp", type: "uint256" },
          { name: "publicKeyHash", type: "bytes32" },
          { name: "active", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // getAgentsByCreator(address) → uint256[]
  {
    inputs: [{ name: "creator", type: "address" }],
    name: "getAgentsByCreator",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  // getChildAgents(uint256) → uint256[]
  {
    inputs: [{ name: "parentAgentId", type: "uint256" }],
    name: "getChildAgents",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  // getLicenses(uint256) → License[]
  {
    inputs: [{ name: "agentId", type: "uint256" }],
    name: "getLicenses",
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "licenseType", type: "string" },
          { name: "licenseNumber", type: "string" },
          { name: "holder", type: "string" },
          { name: "jurisdiction", type: "string" },
          { name: "active", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // hasLicense(uint256, string) → bool
  {
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "licenseType", type: "string" },
    ],
    name: "hasLicense",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Faucet ABI (read functions)
export const FAUCET_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "hasClaimed",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalClaims",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// CLAMS ERC-20 ABI (read functions)
export const CLAMS_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
