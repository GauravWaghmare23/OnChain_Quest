import { useEffect, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SHARDEUM_CHAIN_ID } from "@/config/chains";
import { AlertCircle } from "lucide-react";

export const NetworkSwitcher = () => {
  const { chainId, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (isConnected && chainId !== SHARDEUM_CHAIN_ID) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [chainId, isConnected]);

  if (!showAlert) return null;

  const handleSwitchNetwork = async () => {
    try {
      switchChain({ chainId: SHARDEUM_CHAIN_ID });
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  return (
    <Alert className="border-2 border-orange-400 bg-orange-50 rounded-none pixel-border">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="ml-2">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-bold text-orange-900">
            ⚠️ Wrong Network! Switch to Shardeum Mezame testnet
          </span>
          <Button
            onClick={handleSwitchNetwork}
            disabled={isPending}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-none pixel-button"
          >
            {isPending ? "Switching..." : "Switch Network"}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
