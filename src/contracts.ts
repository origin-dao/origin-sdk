// ORIGIN Protocol — Contract Addresses & ABIs (Base Mainnet)

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

// OriginRegistryV2 ABI (read functions)
export const REGISTRY_ABI = [
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getAgent",
    outputs: [
      { name: "name", type: "string" },
      { name: "agentType", type: "string" },
      { name: "owner", type: "address" },
      { name: "birthBlock", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRegistered",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "index", type: "uint256" },
    ],
    name: "getLicense",
    outputs: [
      { name: "licenseType", type: "string" },
      { name: "licenseId", type: "string" },
      { name: "issuedAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getLicenseCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "isVerified",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getLineage",
    outputs: [
      { name: "parentId", type: "uint256" },
      { name: "depth", type: "uint256" },
    ],
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
