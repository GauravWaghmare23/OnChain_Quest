import { useCallback, useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient, useWatchContractEvent } from "wagmi";
import { isAddress } from "viem";
import { shardeum, SHARDEUM_CHAIN_ID } from "@/config/chains";
import { getTxExplorerUrl } from "@/config/contracts";
import { txQueue } from "@/lib/transactionQueue";
import { getBlockchainErrorMessage, isValidAddress } from "@/lib/networkValidation";
import { useToast } from "@/hooks/use-toast";

const QUEST_STORAGE_ABI = [
  {
    type: "event",
    name: "NumberStored",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "number", type: "uint256", indexed: false },
    ],
  },
  {
    type: "function",
    name: "storeNumber",
    inputs: [{ name: "_num", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getNumber",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "storedNumber",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lastPlayer",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
];

export interface QuestStorageState {
  loading: boolean;
  success: boolean;
  error: string | null;
  txHash: string | null;
  txUrl: string | null;
  storedNumber: bigint | null;
  lastPlayer: string | null;
  isRetrying: boolean;
}

export const useQuestStorage = (contractAddress: string | null) => {
  const { address: userAddress, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();

  const [state, setState] = useState<QuestStorageState>({
    loading: false,
    success: false,
    error: null,
    txHash: null,
    txUrl: null,
    storedNumber: null,
    lastPlayer: null,
    isRetrying: false,
  });

  const resetState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      success: false,
      error: null,
      txHash: null,
      txUrl: null,
      isRetrying: false,
    }));
  }, []);

  const validateSetup = useCallback(() => {
    if (!isConnected) {
      throw new Error("Wallet not connected");
    }
    if (!userAddress) {
      throw new Error("User address not available");
    }
    if (!walletClient) {
      throw new Error("Wallet client not initialized");
    }
    if (!publicClient) {
      throw new Error("Public client not initialized");
    }
    if (chainId !== SHARDEUM_CHAIN_ID) {
      throw new Error(`Wrong network. Please switch to Shardeum Mezame (Chain: 8119)`);
    }
    if (!contractAddress || !isValidAddress(contractAddress)) {
      throw new Error("Invalid contract address");
    }
  }, [isConnected, userAddress, walletClient, publicClient, chainId, contractAddress]);

  const getNumber = useCallback(async () => {
    try {
      validateSetup();

      const number = (await publicClient!.readContract({
        address: contractAddress as `0x${string}`,
        abi: QUEST_STORAGE_ABI,
        functionName: "getNumber",
      })) as bigint;

      const lastPlayer = (await publicClient!.readContract({
        address: contractAddress as `0x${string}`,
        abi: QUEST_STORAGE_ABI,
        functionName: "lastPlayer",
      })) as string;

      setState((prev) => ({ ...prev, storedNumber: number, lastPlayer }));
      return number;
    } catch (error) {
      const errorMsg = getBlockchainErrorMessage(error);
      setState((prev) => ({ ...prev, error: errorMsg }));
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: errorMsg,
        duration: 5000,
      });
      console.error("[getNumber] Error:", error);
      return null;
    }
  }, [validateSetup, publicClient, contractAddress, toast]);

  const storeNumber = useCallback(
    async (number: string) => {
      resetState();
      setState((prev) => ({ ...prev, loading: true }));

      try {
        validateSetup();

        const parsedNumber = BigInt(number);

        // Enqueue transaction through transaction queue
        const txHash = await txQueue.enqueue(async () => {
          setState((prev) => ({ ...prev, isRetrying: false }));

          const hash = await walletClient!.writeContract({
            account: userAddress!,
            address: contractAddress as `0x${string}`,
            abi: QUEST_STORAGE_ABI,
            functionName: "storeNumber",
            args: [parsedNumber],
            chain: shardeum,
          });

          return hash;
        });

        const txUrl = getTxExplorerUrl(txHash);

        setState((prev) => ({
          ...prev,
          txHash,
          txUrl,
          loading: true,
        }));

        // Wait for transaction confirmation
        const receipt = await publicClient!.waitForTransactionReceipt({
          hash: txHash as `0x${string}`,
          timeout: 60_000,
        });

        if (receipt.status === "success") {
          setState((prev) => ({
            ...prev,
            loading: false,
            success: true,
            error: null,
          }));

          // Fetch updated number
          await getNumber();

          toast({
            title: "✅ Quest Complete",
            description: `Number ${number} stored successfully!`,
            duration: 5000,
          });
        } else {
          throw new Error("Transaction failed");
        }
      } catch (error) {
        const errorMsg = getBlockchainErrorMessage(error);

        setState((prev) => ({
          ...prev,
          loading: false,
          success: false,
          error: errorMsg,
          isRetrying: false,
        }));

        toast({
          variant: "destructive",
          title: "❌ Error",
          description: errorMsg,
          duration: 5000,
        });

        console.error("[storeNumber] Error:", error);
      }
    },
    [resetState, validateSetup, walletClient, userAddress, publicClient, contractAddress, toast, getNumber]
  );

  /**
   * Listen for NumberStored events
   */
  useWatchContractEvent({
    address: (contractAddress as `0x${string}`) || undefined,
    abi: QUEST_STORAGE_ABI,
    eventName: "NumberStored",
    onLogs: () => {
      getNumber();
    },
    enabled: !!contractAddress && isConnected,
  });

  // Fetch on mount and when address/contract changes
  useEffect(() => {
    if (contractAddress && isConnected && isValidAddress(contractAddress)) {
      getNumber();
    }
  }, [contractAddress, isConnected, getNumber]);

  return {
    ...state,
    storeNumber,
    getNumber,
    resetState,
    isReady: isConnected && chainId === SHARDEUM_CHAIN_ID && !!contractAddress && isValidAddress(contractAddress),
  };
};
