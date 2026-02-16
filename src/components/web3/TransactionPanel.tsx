import { useState } from "react";
import { useAccount, useSignMessage, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { BSCSCAN_TESTNET_URL } from "@/config/contracts";
import { useGame } from "@/context/GameContext";

const TransactionPanel = () => {
  const { address } = useAccount();
  const { unlockAchievement, addToInventory, completeQuest, addXP } = useGame();
  const [signedMessage, setSignedMessage] = useState<string | null>(null);
  const [txStep, setTxStep] = useState<"sign" | "send" | "done">("sign");

  const { signMessage, isPending: isSigning } = useSignMessage({
    mutation: {
      onSuccess: (sig) => {
        setSignedMessage(sig);
        unlockAchievement("sign_message");
        addToInventory("📜 Royal Seal");
        addXP(50);
        completeQuest(1);
        setTxStep("send");
      },
    },
  });

  const { sendTransaction, data: txHash, isPending: isSending } = useSendTransaction({
    mutation: {
      onSuccess: () => {
        unlockAchievement("send_tx");
        addToInventory("💰 Gold Pouch");
        addXP(75);
        completeQuest(2);
        setTxStep("done");
      },
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  return (
    <div className="quest-panel animate-slide-up space-y-4">
      {/* Step 1: Sign Message */}
      <div className={`space-y-3 ${txStep !== "sign" && signedMessage ? "opacity-60" : ""}`}>
        <h3 className="text-xs text-accent pixel-text-shadow">📜 SIGN A MESSAGE</h3>
        <p className="text-[8px] text-muted-foreground leading-relaxed">
          Sign a royal decree to prove your identity in BNB Kingdom.
        </p>
        {!signedMessage ? (
          <button
            onClick={() => signMessage({ account: address!, message: "I hereby enter BNB Kingdom! 🏰" })}
            disabled={isSigning}
            className="pixel-btn bg-primary text-primary-foreground text-[8px] w-full"
          >
            {isSigning ? "SIGNING..." : "SIGN DECREE"}
          </button>
        ) : (
          <div className="bg-muted p-3 pixel-border">
            <p className="text-[8px] text-level-complete mb-1">✅ MESSAGE SIGNED!</p>
            <p className="text-[8px] text-muted-foreground break-all">{signedMessage.slice(0, 40)}...</p>
          </div>
        )}
      </div>

      {/* Step 2: Send Transaction */}
      {txStep !== "sign" && (
        <div className="space-y-3 animate-slide-up">
          <h3 className="text-xs text-accent pixel-text-shadow">💰 SEND TEST BNB</h3>
          <p className="text-[8px] text-muted-foreground leading-relaxed">
            Send a tiny amount of test BNB to yourself as tribute.
          </p>
          {!txHash ? (
            <button
              onClick={() =>
                sendTransaction({
                  to: address!,
                  value: parseEther("0.0001"),
                })
              }
              disabled={isSending}
              className="pixel-btn bg-accent text-accent-foreground text-[8px] w-full"
            >
              {isSending ? "SENDING..." : "SEND 0.0001 tBNB"}
            </button>
          ) : (
            <div className="bg-muted p-3 pixel-border space-y-2">
              <p className="text-[8px] text-level-complete">
                {isConfirming ? "⏳ CONFIRMING..." : isConfirmed ? "✅ CONFIRMED!" : "📤 SENT!"}
              </p>
              <p className="text-[8px] text-muted-foreground break-all">TX: {txHash.slice(0, 20)}...</p>
              <a
                href={`${BSCSCAN_TESTNET_URL}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[8px] text-diamond underline block"
              >
                VIEW ON BSCSCAN →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionPanel;
