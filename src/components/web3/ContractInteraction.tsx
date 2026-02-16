import { useState } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_STORAGE_ADDRESS, STORAGE_ABI } from "@/config/contracts";
import { useGame } from "@/context/GameContext";

const ContractInteraction = () => {
  const { unlockAchievement, addToInventory, completeQuest, addXP } = useGame();
  const [numberToStore, setNumberToStore] = useState("");
  const [stored, setStored] = useState(false);

  const { data: retrievedNumber, refetch } = useReadContract({
    address: CONTRACT_STORAGE_ADDRESS as `0x${string}`,
    abi: STORAGE_ABI,
    functionName: "retrieve",
  });

  const { writeContract, data: writeTxHash, isPending: isWriting } = useWriteContract({
    mutation: {
      onSuccess: () => {
        unlockAchievement("store_number");
        addToInventory("🔮 Enchantment Orb");
        addXP(100);
        setStored(true);
      },
    },
  });

  const { isSuccess: writeConfirmed } = useWaitForTransactionReceipt({ hash: writeTxHash });

  const handleStore = () => {
    if (!numberToStore) return;
    writeContract({
      address: CONTRACT_STORAGE_ADDRESS as `0x${string}`,
      abi: STORAGE_ABI,
      functionName: "store",
      args: [BigInt(numberToStore)],
      account: undefined as any,
      chain: undefined as any,
    });
  };

  const handleRetrieve = () => {
    refetch().then(() => {
      unlockAchievement("retrieve_number");
      addToInventory("👁️ Oracle Eye");
      addXP(75);
      completeQuest(3);
    });
  };

  return (
    <div className="quest-panel animate-slide-up space-y-4">
      <h3 className="text-xs text-accent pixel-text-shadow">🔮 SMART CONTRACT</h3>
      <p className="text-[8px] text-muted-foreground leading-relaxed">
        Interact with the enchanted storage crystal on the blockchain.
      </p>

      {/* Store */}
      <div className="space-y-2">
        <p className="text-[8px] text-foreground">STORE A NUMBER:</p>
        <div className="flex gap-2">
          <input
            type="number"
            value={numberToStore}
            onChange={(e) => setNumberToStore(e.target.value)}
            placeholder="0"
            className="bg-input text-foreground pixel-border px-3 py-2 text-[10px] flex-1 outline-none"
          />
          <button
            onClick={handleStore}
            disabled={isWriting || !numberToStore}
            className="pixel-btn bg-primary text-primary-foreground text-[8px] disabled:opacity-50"
          >
            {isWriting ? "..." : "STORE"}
          </button>
        </div>
        {stored && (
          <p className="text-[8px] text-level-complete animate-slide-up">
            {writeConfirmed ? "✅ STORED ON-CHAIN!" : "⏳ CONFIRMING..."}
          </p>
        )}
      </div>

      {/* Retrieve */}
      <div className="space-y-2">
        <p className="text-[8px] text-foreground">RETRIEVE VALUE:</p>
        <button
          onClick={handleRetrieve}
          className="pixel-btn bg-secondary text-secondary-foreground text-[8px] w-full"
        >
          RETRIEVE
        </button>
        {retrievedNumber !== undefined && (
          <div className="bg-muted p-3 pixel-border animate-slide-up">
            <p className="text-[8px] text-muted-foreground">STORED VALUE:</p>
            <p className="text-lg text-accent pixel-glow">{retrievedNumber.toString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractInteraction;
