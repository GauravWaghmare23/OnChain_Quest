import { useConnect, useAccount, useDisconnect } from "wagmi";
import { useGame } from "@/context/GameContext";
import { useEffect } from "react";

const WalletConnect = () => {
  const { connectors, connect, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { unlockAchievement, addToInventory, completeQuest } = useGame();

  useEffect(() => {
    if (isConnected && address) {
      unlockAchievement("wallet_connect");
      addToInventory("🏠 Wallet Key");
      completeQuest(0);
    }
  }, [isConnected, address, unlockAchievement, addToInventory, completeQuest]);

  if (isConnected) {
    return (
      <div className="quest-panel animate-slide-up space-y-4">
        <div className="flex items-center gap-2 text-level-complete">
          <span className="text-2xl animate-pixel-bounce">✅</span>
          <span className="text-xs">WALLET CONNECTED!</span>
        </div>
        <div className="bg-muted p-3 pixel-border">
          <p className="text-[8px] text-muted-foreground mb-1">YOUR ADDRESS</p>
          <p className="text-[10px] text-accent break-all">{address}</p>
        </div>
        <button
          onClick={() => disconnect()}
          className="pixel-btn bg-destructive text-destructive-foreground text-[8px] w-full"
        >
          DISCONNECT
        </button>
      </div>
    );
  }

  return (
    <div className="quest-panel animate-slide-up space-y-4">
      <h3 className="text-xs text-accent pixel-text-shadow">⚡ CONNECT WALLET</h3>
      <p className="text-[8px] text-muted-foreground leading-relaxed">
        To enter BNB Kingdom, you must connect your MetaMask wallet.
      </p>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="pixel-btn bg-primary text-primary-foreground text-[8px] w-full disabled:opacity-50"
        >
          {isPending ? "CONNECTING..." : `CONNECT ${connector.name.toUpperCase()}`}
        </button>
      ))}
    </div>
  );
};

export default WalletConnect;
