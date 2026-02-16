import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_NFT_ADDRESS, NFT_ABI } from "@/config/contracts";
import { useGame } from "@/context/GameContext";

const NFTMint = () => {
  const { address } = useAccount();
  const { unlockAchievement, addToInventory, completeQuest, addXP } = useGame();

  const { writeContract, data: mintTxHash, isPending: isMinting } = useWriteContract({
    mutation: {
      onSuccess: () => {
        unlockAchievement("mint_nft");
        unlockAchievement("all_quests");
        addToInventory("⚔️ BNB Quest Badge");
        addToInventory("👑 Kingdom Crown");
        addXP(200);
        completeQuest(4);
      },
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  const handleMint = () => {
    if (!address) return;
    writeContract({
      address: CONTRACT_NFT_ADDRESS as `0x${string}`,
      abi: NFT_ABI,
      functionName: "mint",
      args: [address],
      account: undefined as any,
      chain: undefined as any,
    });
  };

  return (
    <div className="quest-panel animate-slide-up space-y-4">
      <h3 className="text-xs text-accent pixel-text-shadow">⚔️ MINT NFT ACHIEVEMENT</h3>
      <p className="text-[8px] text-muted-foreground leading-relaxed">
        Forge your legendary achievement NFT to prove your mastery of BNB Kingdom!
      </p>

      <div className="bg-muted p-4 pixel-border-accent text-center space-y-2">
        <div className="text-4xl animate-pixel-float">🏆</div>
        <p className="text-[10px] text-accent">BNB QUEST CHAMPION</p>
        <p className="text-[8px] text-muted-foreground">LEGENDARY NFT</p>
      </div>

      {!mintTxHash ? (
        <button
          onClick={handleMint}
          disabled={isMinting}
          className="pixel-btn bg-accent text-accent-foreground text-[8px] w-full"
        >
          {isMinting ? "FORGING..." : "⚔️ MINT ACHIEVEMENT NFT"}
        </button>
      ) : (
        <div className="bg-muted p-3 pixel-border space-y-2 animate-slide-up">
          <p className="text-[8px] text-level-complete">
            {isConfirming ? "⏳ FORGING YOUR NFT..." : isConfirmed ? "✅ NFT MINTED!" : "📤 TRANSACTION SENT!"}
          </p>
          {isConfirmed && (
            <div className="text-center animate-level-up">
              <p className="text-lg pixel-glow">🎉 CONGRATULATIONS! 🎉</p>
              <p className="text-[8px] text-muted-foreground mt-2">
                You have completed BNB Quest!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NFTMint;
