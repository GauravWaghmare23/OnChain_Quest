import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { shardeum, SHARDEUM_RPC_URL } from "@/config/chains";

/**
 * Wagmi Configuration for Shardeum Mezame
 * Only supports Shardeum Mezame testnet (Chain ID: 8119)
 */
export const wagmiConfig = createConfig({
  chains: [shardeum],
  connectors: [injected()],
  transports: {
    [shardeum.id]: http(SHARDEUM_RPC_URL, {
      // Retry configuration for RPC resilience
      retryCount: 5,
      retryDelay: ({ count }) => (() => 2 ** count * 50)(), // Exponential backoff: 50ms, 100ms, 200ms, 400ms, 800ms
      timeout: 30_000, // 30 second timeout
    }),
  },
});
