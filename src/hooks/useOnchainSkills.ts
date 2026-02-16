import { useCallback, useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient, useWatchContractEvent } from "wagmi";
import { isAddress } from "viem";
import { shardeum, SHARDEUM_CHAIN_ID } from "@/config/chains";
import { getTxExplorerUrl } from "@/config/contracts";
import { ONCHAIN_SKILLS_ABI } from "@/config/abis";
import { txQueue } from "@/lib/transactionQueue";
import { getBlockchainErrorMessage, isValidAddress } from "@/lib/networkValidation";
import { useToast } from "@/hooks/use-toast";

export interface SkillsContractState {
  loading: boolean;
  success: boolean;
  error: string | null;
  txHash: string | null;
  txUrl: string | null;
  mySkills: bigint | null;
  isRetrying: boolean;
}

export const useOnchainSkills = (contractAddress: string | null) => {
  const { address: userAddress, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();

  const [state, setState] = useState<SkillsContractState>({
    loading: false,
    success: false,
    error: null,
    txHash: null,
    txUrl: null,
    mySkills: null,
    isRetrying: false,
  });

  const resetState = useCallback(() => {
    setState({
      loading: false,
      success: false,
      error: null,
      txHash: null,
      txUrl: null,
      mySkills: null,
      isRetrying: false,
    });
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
      throw new Error("Invalid OnchainSkills contract address");
    }
  }, [isConnected, userAddress, walletClient, publicClient, chainId, contractAddress]);

  const getMySkills = useCallback(async () => {
    try {
      validateSetup();

      const skills = (await publicClient!.readContract({
        address: contractAddress as `0x${string}`,
        abi: ONCHAIN_SKILLS_ABI,
        functionName: "getMySkills",
      })) as bigint;

      setState((prev) => ({ ...prev, mySkills: skills }));
      return skills;
    } catch (error) {
      const errorMsg = getBlockchainErrorMessage(error);
      setState((prev) => ({ ...prev, error: errorMsg }));
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: errorMsg,
        duration: 5000,
      });
      console.error("[getMySkills] Error:", error);
      return null;
    }
  }, [validateSetup, publicClient, contractAddress, toast]);

  const earnSkill = useCallback(
    async (points: string) => {
      resetState();
      setState((prev) => ({ ...prev, loading: true }));

      try {
        validateSetup();

        const parsedPoints = BigInt(points);
        if (parsedPoints <= 0n) {
          throw new Error("Skill points must be greater than 0");
        }

        // Enqueue transaction through transaction queue
        const txHash = await txQueue.enqueue(async () => {
          setState((prev) => ({ ...prev, isRetrying: false }));

          const hash = await walletClient!.writeContract({
            account: userAddress!,
            address: contractAddress as `0x${string}`,
            abi: ONCHAIN_SKILLS_ABI,
            functionName: "earnSkill",
            args: [parsedPoints],
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

          // Fetch updated skills
          await getMySkills();

          toast({
            title: "✅ Skills Earned",
            description: `+${points} skill points earned!`,
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

        console.error("[earnSkill] Error:", error);
      }
    },
    [resetState, validateSetup, walletClient, userAddress, publicClient, contractAddress, toast, getMySkills]
  );

  /**
   * Listen for SkillEarned events and update UI in real-time
   */
  useWatchContractEvent({
    address: (contractAddress as `0x${string}`) || undefined,
    abi: ONCHAIN_SKILLS_ABI,
    eventName: "SkillEarned",
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (log.args?.player?.toLowerCase() === userAddress?.toLowerCase()) {
          // Refresh skills when we earn them
          getMySkills();
        }
      });
    },
    enabled: !!contractAddress && isConnected,
  });

  // Fetch skills on mount and when address/contract changes
  useEffect(() => {
    if (contractAddress && isConnected && isValidAddress(contractAddress)) {
      getMySkills();
    }
  }, [contractAddress, isConnected, getMySkills]);

  return {
    ...state,
    earnSkill,
    getMySkills,
    resetState,
    isReady: isConnected && chainId === SHARDEUM_CHAIN_ID && !!contractAddress && isValidAddress(contractAddress),
  };
};
