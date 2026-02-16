/**
 * Network Validation Utilities
 */

import { useAccount, useSwitchChain } from "wagmi";
import { shardeum, SHARDEUM_CHAIN_ID } from "@/config/chains";
import { useCallback } from "react";

export interface NetworkStatus {
  isConnected: boolean;
  isCorrectNetwork: boolean;
  chainId: number | undefined;
  address: string | undefined;
}

/**
 * Hook to validate wallet connection and network
 */
export const useNetworkValidation = () => {
  const { isConnected, chainId, address } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const status: NetworkStatus = {
    isConnected,
    isCorrectNetwork: chainId === SHARDEUM_CHAIN_ID,
    chainId,
    address,
  };

  const switchToShardeum = useCallback(() => {
    switchChain({ chainId: SHARDEUM_CHAIN_ID });
  }, [switchChain]);

  const getErrorMessage = useCallback((): string | null => {
    if (!isConnected) {
      return "Please connect your wallet to continue.";
    }
    if (!status.isCorrectNetwork) {
      return `Please switch to Shardeum Mezame (Chain ID: ${SHARDEUM_CHAIN_ID}). Currently on chain ${chainId}.`;
    }
    return null;
  }, [isConnected, status.isCorrectNetwork, chainId]);

  return {
    ...status,
    switchToShardeum,
    isSwitching,
    getErrorMessage,
    canProceed: isConnected && status.isCorrectNetwork,
  };
};

/**
 * Hook to ensure user is on correct network before executing logic
 */
export const useRequireNetwork = () => {
  const validation = useNetworkValidation();

  const requireNetwork = useCallback(async () => {
    if (!validation.isConnected) {
      throw new Error("Wallet not connected. Please connect your wallet.");
    }
    if (!validation.isCorrectNetwork) {
      throw new Error(
        `Please switch to Shardeum Mezame. Currently on chain ${validation.chainId}.`
      );
    }
  }, [validation.isConnected, validation.isCorrectNetwork, validation.chainId]);

  return {
    ...validation,
    requireNetwork,
  };
};

/**
 * Validate address format
 */
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Get user-friendly error message for blockchain errors
 */
export const getBlockchainErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    if (msg.includes("user rejected")) {
      return "❌ Transaction rejected by user.";
    }
    if (msg.includes("insufficient funds")) {
      return "❌ Insufficient SHM balance.";
    }
    if (msg.includes("wrong network")) {
      return `❌ Wrong network. Please switch to Shardeum Mezame (Chain: ${SHARDEUM_CHAIN_ID}).`;
    }
    if (msg.includes("failed to fetch") || msg.includes("timeout")) {
      return "⏳ Network timeout. Retrying...";
    }
    if (msg.includes("congested")) {
      return "🔄 Shardeum network is congested. Retrying...";
    }
    if (msg.includes("nonce")) {
      return "❌ Transaction nonce conflict. Please try again.";
    }

    return `❌ ${error.message}`;
  }

  return "❌ Unknown error occurred.";
};
