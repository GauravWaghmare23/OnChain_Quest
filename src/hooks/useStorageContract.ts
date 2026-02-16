import { useCallback, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { parseUnits, toHex } from "viem";
import { shardeum, SHARDEUM_CHAIN_ID } from "@/config/chains";
import {
  STORAGE_CONTRACT_ADDRESS,
  STORAGE_ABI,
  getTxExplorerUrl,
} from "@/config/contracts";
import { useToast } from "@/hooks/use-toast";

export interface TransactionState {
  loading: boolean;
  success: boolean;
  error: string | null;
  txHash: string | null;
  txUrl: string | null;
}

interface StorageContractState extends TransactionState {
  storedNumber: bigint | null;
}

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useStorageContract = () => {
  const { address: userAddress, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();

  const [state, setState] = useState<StorageContractState>({
    loading: false,
    success: false,
    error: null,
    txHash: null,
    txUrl: null,
    storedNumber: null,
  });

  const resetState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      success: false,
      error: null,
      txHash: null,
      txUrl: null,
    }));
  }, []);

  const checkNetwork = useCallback(() => {
    if (!isConnected) {
      throw new Error("Wallet not connected. Please connect your wallet first.");
    }
    if (chainId !== SHARDEUM_CHAIN_ID) {
      throw new Error(
        `Wrong network. Please switch to Shardeum Mezame testnet (Chain ID: ${SHARDEUM_CHAIN_ID})`
      );
    }
  }, [isConnected, chainId]);

  const retryWithFallback = useCallback(
    async <T,>(
      fn: () => Promise<T>,
      operationName: string
    ): Promise<T> => {
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
        try {
          return await fn();
        } catch (error) {
          lastError =
            error instanceof Error
              ? error
              : new Error(String(error));

          if (attempt < RETRY_ATTEMPTS) {
            const delay = RETRY_DELAY * attempt;
            console.warn(
              `[${operationName}] Attempt ${attempt} failed. Retrying in ${delay}ms...`,
              lastError.message
            );
            await sleep(delay);
          }
        }
      }

      throw lastError;
    },
    []
  );

  const storeNumber = useCallback(
    async (number: string) => {
      resetState();
      setState((prev) => ({ ...prev, loading: true }));

      try {
        checkNetwork();

        if (!publicClient || !walletClient) {
          throw new Error("Public or wallet client not initialized");
        }

        if (!userAddress) {
          throw new Error("User address not available");
        }

        // Validate input
        const parsedNumber = parseUnits(number, 0);

        // Estimate gas with retry and fallback
        let gasEstimate: bigint;
        try {
          gasEstimate = await retryWithFallback(
            () =>
              publicClient.estimateContractGas({
                address: STORAGE_CONTRACT_ADDRESS as `0x${string}`,
                abi: STORAGE_ABI,
                functionName: "storeNumber",
                args: [parsedNumber],
                account: userAddress,
              }),
            "Gas estimation"
          );
        } catch (gasError) {
          // If gas estimation fails, use a default estimate
          console.warn(
            "[storeNumber] Gas estimation failed, using default estimate",
            gasError
          );
          gasEstimate = BigInt(100000); // Conservative default gas estimate
        }

        // Write contract with retry
        const txHash = await retryWithFallback(
          () =>
            walletClient.writeContract({
              account: userAddress,
              chain: shardeum,
              address: STORAGE_CONTRACT_ADDRESS as `0x${string}`,
              abi: STORAGE_ABI,
              functionName: "storeNumber",
              args: [parsedNumber],
              gas: (gasEstimate * BigInt(120)) / BigInt(100), // 20% buffer
            }),
          "Write contract"
        );

        const txUrl = getTxExplorerUrl(txHash);

        setState((prev) => ({
          ...prev,
          txHash,
          txUrl,
          loading: true,
        }));

        // Wait for transaction with retry
        const receipt = await retryWithFallback(
          () =>
            publicClient.waitForTransactionReceipt({
              hash: txHash,
              timeout: 60_000,
            }),
          "Transaction confirmation"
        );

        if (receipt.status === "reverted") {
          throw new Error("Transaction failed: Contract execution reverted");
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          success: true,
          error: null,
        }));

        toast({
          title: "✓ Success",
          description: `Number stored successfully!`,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        // Handle specific error types
        let userMessage = errorMessage;

        if (errorMessage.includes("User rejected")) {
          userMessage = "Transaction rejected. Please try again.";
        } else if (errorMessage.includes("insufficient funds")) {
          userMessage = "Insufficient funds for transaction. Please check your balance.";
        } else if (errorMessage.includes("Wrong network")) {
          userMessage = errorMessage;
        } else if (errorMessage.includes("gas")) {
          userMessage = "Gas estimation failed. Please try again.";
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: userMessage,
        }));

        toast({
          variant: "destructive",
          title: "✗ Error",
          description: userMessage,
        });

        console.error("[storeNumber] Error:", error);
      }
    },
    [publicClient, walletClient, userAddress, checkNetwork, retryWithFallback, resetState, toast]
  );

  const getNumber = useCallback(async () => {
    try {
      if (!publicClient) {
        throw new Error("Public client not initialized");
      }

      const result = await retryWithFallback(
        () =>
          publicClient.readContract({
            address: STORAGE_CONTRACT_ADDRESS as `0x${string}`,
            abi: STORAGE_ABI,
            functionName: "getNumber",
          } as unknown as Parameters<typeof publicClient.readContract>[0]),
        "Read contract"
      );

      const number = result as bigint;
      setState((prev) => ({ ...prev, storedNumber: number }));
      return number;
    } catch (error) {
      console.error("[getNumber] Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch number";
      setState((prev) => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, [publicClient, retryWithFallback]);

  return {
    ...state,
    storeNumber,
    getNumber,
    resetState,
    isReady: isConnected && chainId === SHARDEUM_CHAIN_ID,
    currentChainId: chainId,
  };
};
