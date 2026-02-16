import { useConnect, useAccount, useDisconnect } from "wagmi";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export const WalletConnect = () => {
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

  if (isConnected) {
    return (
      <Card className="border-2 border-green-400 rounded-none bg-green-50">
        <CardHeader className="bg-green-100 border-b-2 border-green-400">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-2xl">✅</span>
            Wallet Connected!
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="p-3 bg-white border-2 border-green-300 rounded-none">
            <p className="text-xs font-bold text-gray-600 mb-2">Your Address</p>
            <p className="text-sm font-mono text-gray-900 break-all">{address}</p>
          </div>
          <Button
            onClick={() => disconnect()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-none border-2 border-red-400"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-400 rounded-none bg-blue-50">
      <CardHeader className="bg-blue-100 border-b-2 border-blue-400">
        <CardTitle className="text-lg">⚡ Connect Your Wallet</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <p className="text-sm text-gray-700">
          To start your Web3 learning journey, connect your MetaMask wallet. This is how you'll
          interact with blockchain contracts and learn by doing!
        </p>
        <div className="space-y-2">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-none border-2 border-blue-400 disabled:opacity-50"
            >
              {isPending ? "Connecting..." : `🔗 Connect ${connector.name}`}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Default export for backwards compatibility
export default WalletConnect;
