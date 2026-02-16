import { useCallback, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { isAddress } from "viem";
import { shardeum, SHARDEUM_CHAIN_ID } from "@/config/chains";
import {
  NFT_CONTRACT_ADDRESS,
  NFT_ABI,
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

interface NFTContractState extends TransactionState {
  nftBalance: bigint | null;
}

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useNFTContract = () => {
  const { address: userAddress, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();

  const [state, setState] = useState<NFTContractState>({
    loading: false,
    success: false,
    error: null,
    txHash: null,
    txUrl: null,
    nftBalance: null,
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

  const validateInputs = (to: string, metadataURI: string) => {
    if (!isAddress(to)) {
      throw new Error("Invalid recipient address format");
    }
    if (!metadataURI || metadataURI.trim().length === 0) {
      throw new Error("Metadata URI cannot be empty");
    }
    if (metadataURI.length > 2000) {
      throw new Error("Metadata URI is too long (max 2000 characters)");
    }
  };

  const mintHero = useCallback(
    async (to: string, metadataURI: string) => {
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

        // Validate inputs
        validateInputs(to, metadataURI);

        // Estimate gas with retry and fallback
        let gasEstimate: bigint;
        try {
          gasEstimate = await retryWithFallback(
            () =>
              publicClient.estimateContractGas({
                address: NFT_CONTRACT_ADDRESS as `0x${string}`,
                abi: NFT_ABI,
                functionName: "mintHero",
                args: [to as `0x${string}`, metadataURI],
                account: userAddress,
              }),
            "Gas estimation"
          );
        } catch (gasError) {
          // If gas estimation fails, use a default estimate
          console.warn(
            "[mintHero] Gas estimation failed, using default estimate",
            gasError
          );
          gasEstimate = BigInt(300000); // Conservative default gas estimate for NFT mint
        }

        // Write contract with retry
        const txHash = await retryWithFallback(
          () =>
            walletClient.writeContract({
              account: userAddress,
              chain: shardeum,
              address: NFT_CONTRACT_ADDRESS as `0x${string}`,
              abi: NFT_ABI,
              functionName: "mintHero",
              args: [to as `0x${string}`, metadataURI],
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
          throw new Error("Transaction failed: NFT mint reverted");
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          success: true,
          error: null,
        }));

        toast({
          title: "✓ Hero Minted!",
          description: `NFT successfully minted to ${to.slice(0, 6)}...${to.slice(-4)}`,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        // Handle specific error types
        let userMessage = errorMessage;

        if (errorMessage.includes("User rejected")) {
          userMessage = "Mint rejected. Please try again.";
        } else if (errorMessage.includes("insufficient funds")) {
          userMessage = "Insufficient funds for gas. Please check your SHM balance.";
        } else if (errorMessage.includes("Wrong network")) {
          userMessage = errorMessage;
        } else if (errorMessage.includes("gas")) {
          userMessage = "Gas estimation failed. Please try again.";
        } else if (errorMessage.includes("Invalid recipient")) {
          userMessage = "Invalid recipient address format";
        } else if (errorMessage.includes("Metadata URI")) {
          userMessage = errorMessage;
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: userMessage,
        }));

        toast({
          variant: "destructive",
          title: "✗ Mint Failed",
          description: userMessage,
        });

        console.error("[mintHero] Error:", error);
      }
    },
    [publicClient, walletClient, userAddress, checkNetwork, retryWithFallback, resetState, toast]
  );

  const getBalance = useCallback(
    async (address?: string) => {
      try {
        if (!publicClient) {
          throw new Error("Public client not initialized");
        }

        const targetAddress = address || userAddress;
        if (!targetAddress) {
          throw new Error("No address provided");
        }

        const balance = await retryWithFallback(
          () =>
            publicClient.readContract({
              address: NFT_CONTRACT_ADDRESS as `0x${string}`,
              abi: NFT_ABI,
              functionName: "balanceOf",
              args: [targetAddress as `0x${string}`],
            } as unknown as Parameters<typeof publicClient.readContract>[0]),
          "Read balance"
        );

        const nftBalance = balance as bigint;
        setState((prev) => ({ ...prev, nftBalance }));
        return nftBalance;
      } catch (error) {
        console.error("[getBalance] Error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch balance";
        setState((prev) => ({ ...prev, error: errorMessage }));
        return null;
      }
    },
    [publicClient, userAddress, retryWithFallback]
  );

  return {
    ...state,
    mintHero,
    getBalance,
    resetState,
    isReady: isConnected && chainId === SHARDEUM_CHAIN_ID,
    currentChainId: chainId,
  };
};
