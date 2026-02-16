// Contract addresses - replace with your deployed contract addresses
export const CONTRACT_STORAGE_ADDRESS = import.meta.env.VITE_CONTRACT_STORAGE_ADDRESS || "0x0000000000000000000000000000000000000000";
export const CONTRACT_NFT_ADDRESS = import.meta.env.VITE_CONTRACT_NFT_ADDRESS || "0x0000000000000000000000000000000000000000";

// BNB Smart Chain Testnet
export const BSC_TESTNET_CHAIN_ID = 97;
export const BSCSCAN_TESTNET_URL = "https://testnet.bscscan.com";
export const BSCSCAN_MAINNET_URL = "https://bscscan.com";

// ABIs - replace with your actual ABIs
export const STORAGE_ABI = [
  {
    inputs: [{ name: "num", type: "uint256" }],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "retrieve",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const NFT_ABI = [
  {
    inputs: [{ name: "to", type: "address" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
