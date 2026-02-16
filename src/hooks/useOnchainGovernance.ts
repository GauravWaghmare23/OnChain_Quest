import { useCallback, useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient, useWatchContractEvent } from "wagmi";
import { isAddress } from "viem";
import { shardeum, SHARDEUM_CHAIN_ID } from "@/config/chains";
import { getTxExplorerUrl } from "@/config/contracts";
import { ONCHAIN_GOVERNANCE_ABI } from "@/config/abis";
import { txQueue } from "@/lib/transactionQueue";
import { getBlockchainErrorMessage, isValidAddress } from "@/lib/networkValidation";
import { useToast } from "@/hooks/use-toast";

export interface Proposal {
  title: string;
  votes: bigint;
}

export interface GovernanceContractState {
  loading: boolean;
  success: boolean;
  error: string | null;
  txHash: string | null;
  txUrl: string | null;
  proposals: Proposal[];
  myReputation: bigint | null;
  hasVoted: boolean;
  isRetrying: boolean;
}

export const useOnchainGovernance = (contractAddress: string | null) => {
  const { address: userAddress, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();

  const [state, setState] = useState<GovernanceContractState>({
    loading: false,
    success: false,
    error: null,
    txHash: null,
    txUrl: null,
    proposals: [],
    myReputation: null,
    hasVoted: false,
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
      throw new Error("Invalid OnchainGovernance contract address");
    }
  }, [isConnected, userAddress, walletClient, publicClient, chainId, contractAddress]);

  const getProposals = useCallback(async () => {
    try {
      validateSetup();

      const proposals = (await publicClient!.readContract({
        address: contractAddress as `0x${string}`,
        abi: ONCHAIN_GOVERNANCE_ABI,
        functionName: "getProposals",
      })) as Proposal[];

      setState((prev) => ({ ...prev, proposals }));
      return proposals;
    } catch (error) {
      const errorMsg = getBlockchainErrorMessage(error);
      setState((prev) => ({ ...prev, error: errorMsg }));
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: errorMsg,
        duration: 5000,
      });
      console.error("[getProposals] Error:", error);
      return [];
    }
  }, [validateSetup, publicClient, contractAddress, toast]);

  const getMyReputation = useCallback(async () => {
    try {
      validateSetup();

      const reputation = (await publicClient!.readContract({
        address: contractAddress as `0x${string}`,
        abi: ONCHAIN_GOVERNANCE_ABI,
        functionName: "reputation",
        args: [userAddress!],
      })) as bigint;

      setState((prev) => ({ ...prev, myReputation: reputation }));
      return reputation;
    } catch (error) {
      console.error("[getMyReputation] Error:", error);
      return null;
    }
  }, [validateSetup, publicClient, contractAddress, userAddress]);

  const checkIfVoted = useCallback(async () => {
    try {
      validateSetup();

      const voted = (await publicClient!.readContract({
        address: contractAddress as `0x${string}`,
        abi: ONCHAIN_GOVERNANCE_ABI,
        functionName: "voted",
        args: [userAddress!],
      })) as boolean;

      setState((prev) => ({ ...prev, hasVoted: voted }));
      return voted;
    } catch (error) {
      console.error("[checkIfVoted] Error:", error);
      return false;
    }
  }, [validateSetup, publicClient, contractAddress, userAddress]);

  const createProposal = useCallback(
    async (title: string) => {
      resetState();
      setState((prev) => ({ ...prev, loading: true }));

      try {
        validateSetup();

        if (!title || title.trim().length === 0) {
          throw new Error("Proposal title cannot be empty");
        }
        if (title.length > 500) {
          throw new Error("Proposal title too long (max 500 characters)");
        }

        // Enqueue transaction
        const txHash = await txQueue.enqueue(async () => {
          setState((prev) => ({ ...prev, isRetrying: false }));

          const hash = await walletClient!.writeContract({
            account: userAddress!,
            address: contractAddress as `0x${string}`,
            abi: ONCHAIN_GOVERNANCE_ABI,
            functionName: "createProposal",
            args: [title],
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

        // Wait for confirmation
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

          // Refresh proposals
          await getProposals();

          toast({
            title: "✅ Proposal Created",
            description: `"${title}" has been added to the DAO!`,
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
          error: errorMsg,
          isRetrying: false,
        }));

        toast({
          variant: "destructive",
          title: "❌ Error",
          description: errorMsg,
          duration: 5000,
        });

        console.error("[createProposal] Error:", error);
      }
    },
    [resetState, validateSetup, walletClient, userAddress, publicClient, contractAddress, toast, getProposals]
  );

  const vote = useCallback(
    async (proposalId: number) => {
      resetState();
      setState((prev) => ({ ...prev, loading: true }));

      try {
        validateSetup();

        if (proposalId < 0) {
          throw new Error("Invalid proposal ID");
        }

        // Enqueue transaction
        const txHash = await txQueue.enqueue(async () => {
          setState((prev) => ({ ...prev, isRetrying: false }));

          const hash = await walletClient!.writeContract({
            account: userAddress!,
            address: contractAddress as `0x${string}`,
            abi: ONCHAIN_GOVERNANCE_ABI,
            functionName: "vote",
            args: [BigInt(proposalId)],
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

        // Wait for confirmation
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
            hasVoted: true,
          }));

          // Refresh data
          await Promise.all([getProposals(), getMyReputation(), checkIfVoted()]);

          toast({
            title: "✅ Vote Recorded",
            description: "Your vote has been recorded! +10 reputation earned.",
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
          error: errorMsg,
          isRetrying: false,
        }));

        toast({
          variant: "destructive",
          title: "❌ Error",
          description: errorMsg,
          duration: 5000,
        });

        console.error("[vote] Error:", error);
      }
    },
    [resetState, validateSetup, walletClient, userAddress, publicClient, contractAddress, toast, getProposals, getMyReputation, checkIfVoted]
  );

  /**
   * Listen for ProposalCreated events
   */
  useWatchContractEvent({
    address: (contractAddress as `0x${string}`) || undefined,
    abi: ONCHAIN_GOVERNANCE_ABI,
    eventName: "ProposalCreated",
    onLogs: () => {
      getProposals();
    },
    enabled: !!contractAddress && isConnected,
  });

  /**
   * Listen for Voted events
   */
  useWatchContractEvent({
    address: (contractAddress as `0x${string}`) || undefined,
    abi: ONCHAIN_GOVERNANCE_ABI,
    eventName: "Voted",
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (log.args?.voter?.toLowerCase() === userAddress?.toLowerCase()) {
          // Refresh data when we vote
          Promise.all([getProposals(), getMyReputation(), checkIfVoted()]);
        } else {
          // Refresh proposals to show new vote counts
          getProposals();
        }
      });
    },
    enabled: !!contractAddress && isConnected,
  });

  // Fetch initial data on mount
  useEffect(() => {
    if (contractAddress && isConnected && isValidAddress(contractAddress)) {
      Promise.all([getProposals(), getMyReputation(), checkIfVoted()]);
    }
  }, [contractAddress, isConnected, getProposals, getMyReputation, checkIfVoted]);

  return {
    ...state,
    createProposal,
    vote,
    getProposals,
    getMyReputation,
    checkIfVoted,
    resetState,
    isReady: isConnected && chainId === SHARDEUM_CHAIN_ID && !!contractAddress && isValidAddress(contractAddress),
  };
};
