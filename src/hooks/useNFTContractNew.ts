import { useCallback, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { isAddress } from "viem";
import {
  NFT_CONTRACT_ADDRESS,
  NFT_ABI,
  getTxExplorerUrl,
} from "@/config/contracts";
import { shardeum } from "@/config/chains";
import { txQueue } from "@/lib/transactionQueue";
import { getBlockchainErrorMessage, isValidAddress } from "@/lib/networkValidation";
import { useToast } from "@/hooks/use-toast";

export interface NFTContractState {
  loading: boolean;
  success: boolean;
  error: string | null;
  txHash: string | null;
  txUrl: string | null;
  nftBalance: bigint | null;
  isRetrying: boolean;
}

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
    isRetrying: false,
  });

  const resetState = useCallback(() => {
    setState({
      loading: false,
      success: false,
      error: null,
      txHash: null,
      txUrl: null,
      nftBalance: null,
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
    if (!isAddress(NFT_CONTRACT_ADDRESS)) {
      throw new Error("Invalid NFT contract address");
    }
    if (chainId !== 8119) {
      throw new Error(`Wrong network. Please switch to Shardeum Mezame (Chain: 8119)`);
    }
  }, [isConnected, userAddress, walletClient, publicClient, chainId]);

  const validateInputs = useCallback(
    (to: string, metadataURI: string) => {
      if (!isValidAddress(to)) {
        throw new Error("Invalid recipient address. Must be a valid Ethereum address.");
      }
      if (!metadataURI || metadataURI.trim().length === 0) {
        throw new Error("Metadata URI cannot be empty");
      }
      if (metadataURI.length > 2000) {
        throw new Error("Metadata URI is too long (max 2000 characters)");
      }
      if (
        !metadataURI.startsWith("ipfs://") &&
        !metadataURI.startsWith("http://") &&
        !metadataURI.startsWith("https://")
      ) {
        throw new Error("Metadata URI must start with ipfs://, http://, or https://");
      }
    },
    []
  );

  const mintHero = useCallback(
    async (to: string, metadataURI: string) => {
      resetState();
      setState((prev) => ({ ...prev, loading: true }));

      try {
        validateSetup();
        validateInputs(to, metadataURI);

        // Enqueue the transaction through the transaction queue
        const txHash = await txQueue.enqueue(async () => {
          setState((prev) => ({ ...prev, isRetrying: false }));

          // Let MetaMask handle gas estimation - use writeContract without gas param
          const hash = await walletClient!.writeContract({
            account: userAddress!,
            address: NFT_CONTRACT_ADDRESS,
            abi: NFT_ABI,
            functionName: "mintHero",
            args: [to as `0x${string}`, metadataURI],
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

          toast({
            title: "✅ NFT Minted",
            description: `Hero NFT minted successfully to ${to.slice(0, 10)}...`,
            duration: 5000,
          });

          // Fetch the NFT balance
          await getBalance(to);
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

        console.error("[mintHero] Error:", error);
      }
    },
    [resetState, validateSetup, validateInputs, walletClient, publicClient, userAddress, toast]
  );

  const getBalance = useCallback(
    async (address?: string) => {
      try {
        if (!publicClient) {
          throw new Error("Public client not initialized");
        }

        const targetAddress = address || userAddress;
        if (!targetAddress || !isValidAddress(targetAddress)) {
          throw new Error("Invalid address format");
        }

        const balance = (await publicClient.readContract({
          address: NFT_CONTRACT_ADDRESS,
          abi: NFT_ABI,
          functionName: "balanceOf",
          args: [targetAddress as `0x${string}`],
        })) as bigint;

        setState((prev) => ({ ...prev, nftBalance: balance }));

        return balance;
      } catch (error) {
        const errorMsg = getBlockchainErrorMessage(error);

        setState((prev) => ({
          ...prev,
          error: errorMsg,
        }));

        toast({
          variant: "destructive",
          title: "❌ Error",
          description: errorMsg,
          duration: 5000,
        });

        console.error("[getBalance] Error:", error);
        return null;
      }
    },
    [publicClient, userAddress, toast]
  );

  return {
    ...state,
    mintHero,
    getBalance,
    resetState,
    isReady: isConnected && chainId === 8119,
  };
};
