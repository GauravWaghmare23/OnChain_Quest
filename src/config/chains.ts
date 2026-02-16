import { defineChain } from "viem";

/**
 * Shardeum Mezame Testnet Configuration
 * Chain ID: 8119
 * RPC: https://api-mezame.shardeum.org
 * Explorer: https://explorer-mezame.shardeum.org
 */
export const shardeum = defineChain({
  id: 8119,
  name: "Shardeum Mezame",
  nativeCurrency: {
    decimals: 18,
    name: "Shardeum",
    symbol: "SHM",
  },
  rpcUrls: {
    default: {
      http: ["https://api-mezame.shardeum.org"],
      webSocket: ["wss://ws-mezame.shardeum.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Shardeum Explorer",
      url: "https://explorer-mezame.shardeum.org",
      apiUrl: "https://api-mezame.shardeum.org/api",
    },
  },
  testnet: true,
});

// Constants
export const SHARDEUM_CHAIN_ID = 8119;
export const SHARDEUM_RPC_URL = "https://api-mezame.shardeum.org";
export const SHARDEUM_EXPLORER_URL = "https://explorer-mezame.shardeum.org";
export const SHARDEUM_EXPLORER_TX_URL = `${SHARDEUM_EXPLORER_URL}/tx/`;
