import { useConnect, useAccount, useDisconnect } from "wagmi";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface WalletConnectProps {
  compact?: boolean;
}

export const WalletConnect = ({ compact = false }: WalletConnectProps) => {
  const { connectors, connect, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { unlockAchievement, addToInventory } = useGame();

  useEffect(() => {
    if (isConnected && address) {
      unlockAchievement("wallet_connect");
      addToInventory("wallet_key", "🔑 Wallet Key", "🔑", 1);
    }
  }, [isConnected, address, unlockAchievement, addToInventory]);

  // Compact navbar mode
  if (compact) {
    if (isConnected) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:inline">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <Button
            onClick={() => disconnect()}
            className="text-xs h-9 px-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 rounded-lg transition-all duration-200"
          >
            Disconnect
          </Button>
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="text-sm h-9 px-4 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isPending ? "Connecting..." : "Connect"}
          </Button>
        ))}
      </div>
    );
  }

  // Full card mode (for modal)
  if (isConnected) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-gray-900 border border-cyan-500/50 rounded-xl">
          <p className="text-xs font-mono text-gray-400 mb-2">Connected Address</p>
          <p className="text-sm font-mono text-cyan-400 break-all">{address}</p>
        </div>
        <Button
          onClick={() => disconnect()}
          className="w-full h-9 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg transition-all duration-200"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="w-full h-10 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {isPending ? "Connecting..." : `🔗 Connect ${connector.name}`}
        </Button>
      ))}
    </div>
  );
};

// Default export for backwards compatibility
export default WalletConnect;
