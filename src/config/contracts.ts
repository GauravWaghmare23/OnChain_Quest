import { SHARDEUM_CHAIN_ID, SHARDEUM_EXPLORER_TX_URL } from "@/config/chains";

/**
 * Contract Configuration for Shardeum Mezame
 * Contract addresses can be overridden via environment variables
 */

// Contract addresses from environment variables or defaults
export const STORAGE_CONTRACT_ADDRESS = (
  import.meta.env.VITE_STORAGE_CONTRACT as `0x${string}` | undefined
) || ("0x0000000000000000000000000000000000000000" as const); // Replace with actual address

export const NFT_CONTRACT_ADDRESS = (
  import.meta.env.VITE_NFT_CONTRACT as `0x${string}` | undefined
) || ("0x0000000000000000000000000000000000000000" as const); // Replace with actual address

// Validate environment variables
if (!import.meta.env.VITE_STORAGE_CONTRACT) {
  console.warn(
    "❌ VITE_STORAGE_CONTRACT not set. Storage contract will not work."
  );
}

if (!import.meta.env.VITE_NFT_CONTRACT) {
  console.warn("❌ VITE_NFT_CONTRACT not set. NFT contract will not work.");
}

// Storage Contract ABI - storeNumber(uint256) and getNumber()
export const STORAGE_ABI = [
  {
    inputs: [{ name: "num", type: "uint256" }],
    name: "storeNumber",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getNumber",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// NFT Contract ABI - mintHero(address, string) and balanceOf(address)
export const NFT_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "metadataURI", type: "string" },
    ],
    name: "mintHero",
    outputs: [{ name: "", type: "uint256" }],
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
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Explorer URLs
export const getTxExplorerUrl = (txHash: string): string => {
  return `${SHARDEUM_EXPLORER_TX_URL}${txHash}`;
};

export const getAddressExplorerUrl = (address: string): string => {
  return `https://explorer-mezame.shardeum.org/address/${address}`;
};
