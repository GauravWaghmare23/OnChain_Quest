import { useState } from "react";
import { AlertCircle, Send, RotateCw, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ModernLevel, ModernCodeBlock, ModernDeploymentGuide } from "@/components/modern";
import { useQuestStorage } from "@/hooks/useQuestStorage";

const LEVEL_1_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BNBQuestStorage {
    uint256 public storedNumber;
    address public lastPlayer;

    event NumberStored(address indexed player, uint256 number);

    function storeNumber(uint256 _number) external {
        storedNumber = _number;
        lastPlayer = msg.sender;
        emit NumberStored(msg.sender, _number);
    }

    function getNumber() external view returns (uint256) {
        return storedNumber;
    }
}`;

const DEPLOYMENT_STEPS = [
  { title: "Open Remix", description: "Go to https://remix.ethereum.org" },
  {
    title: "Create File",
    description: "Create a new file named BNBQuestStorage.sol",
  },
  { title: "Paste Code", description: "Copy and paste the contract code above" },
  {
    title: "Compile",
    description: "Click the Solidity Compiler tab and compile the contract",
  },
  {
    title: "Deploy",
    description: "Go to Deploy tab, select Injected Provider (MetaMask)",
  },
  {
    title: "Copy Address",
    description: "After deployment, copy the contract address",
  },
  {
    title: "Submit",
    description: "Paste the address below and click Submit",
  },
];

export default function Level1Modern() {
  const [contractAddress, setContractAddress] = useState("");
  const [numberToStore, setNumberToStore] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const storage = useQuestStorage(isConnected && contractAddress ? contractAddress : null);

  const handleConnect = () => {
    if (!contractAddress) {
      alert("Please enter a contract address first");
      return;
    }
    if (contractAddress.startsWith("0x") && contractAddress.length === 42) {
      setIsConnected(true);
    } else {
      alert("Invalid contract address format");
    }
  };

  const handleStoreNumber = async () => {
    if (!numberToStore) return;
    await storage.storeNumber(numberToStore);
    setNumberToStore("");
  };

  const progress = isConnected ? 50 : 0;

  return (
    <ModernLevel
      icon="📦"
      title="Level 1: Storage Learner"
      subtitle="Master Basic Smart Contracts"
      description="Learn how state variables and storage work on the blockchain. Deploy a simple contract that stores a number permanently on-chain."
      accentColor="cyan"
      progress={progress}
    >
      {/* Step 1: Contract Code */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Step 1: Understand the Contract</h2>
        <ModernCodeBlock code={LEVEL_1_CONTRACT} title="BNBQuestStorage.sol" />
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <p className="text-sm text-gray-300">
            <strong>What you'll learn:</strong> This contract demonstrates state variables (`storedNumber`), functions
            (`storeNumber`, `getNumber`), and events (`NumberStored`). These are the building blocks of blockchain
            applications.
          </p>
        </div>
      </div>

      {/* Step 2: Deployment Guide */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Step 2: Deploy to Remix</h2>
        <ModernDeploymentGuide steps={DEPLOYMENT_STEPS} />
      </div>

      {/* Step 3: Submit Contract Address */}
      {!isConnected && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Step 3: Submit Your Contract</h2>
          <div className="space-y-4 p-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
            <div>
              <label className="labelblock text-sm font-semibold mb-2">Contract Address</label>
              <div className="flex gap-2">
                <Input
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="bg-gray-900 border-gray-700 rounded-lg text-white placeholder:text-gray-500"
                />
                <Button
                  onClick={handleConnect}
                  disabled={!contractAddress || !contractAddress.startsWith("0x")}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-8 font-bold transition-all"
                >
                  Submit
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Paste the contract address from Remix Deployed Contracts section
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Interact with Contract */}
      {isConnected && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Step 4: Interact with Your Contract</h2>

          {/* Current Value Display */}
          <Card className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30 rounded-xl">
            <p className="text-gray-400 mb-2">Current Stored Number</p>
            <div className="text-6xl font-black text-cyan-400 mb-4">
              {storage.storedNumber || "0"}
            </div>
            {storage.lastPlayer && (
              <p className="text-sm text-gray-400">
                Stored by: {storage.lastPlayer.slice(0, 6)}...{storage.lastPlayer.slice(-4)}
              </p>
            )}

            <Button
              onClick={() => storage.getNumber()}
              disabled={storage.loading}
              className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg py-3 flex items-center justify-center gap-2 transition-all"
            >
              <RotateCw className={`w-4 h-4 ${storage.loading ? "animate-spin" : ""}`} />
              Refresh Value
            </Button>
          </Card>

          {/* Store Number */}
          <div className="p-6 rounded-xl border border-gray-700 bg-gray-900/50">
            <h3 className="text-xl font-bold mb-4">Store a New Number</h3>
            <div className="flex gap-2 mb-4">
              <Input
                type="number"
                placeholder="Enter a number (0-1000)"
                value={numberToStore}
                onChange={(e) => setNumberToStore(e.target.value)}
                className="bg-gray-800 border-gray-700 rounded-lg text-white flex-1"
              />
              <Button
                onClick={handleStoreNumber}
                disabled={!numberToStore || storage.loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg px-8 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Store
              </Button>
            </div>

            {/* Status Messages */}
            {storage.error && (
              <Alert className="border-red-500/50 bg-red-500/10 rounded-lg mb-4">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300 text-sm">{storage.error}</AlertDescription>
              </Alert>
            )}

            {storage.success && (
              <Alert className="border-emerald-500/50 bg-emerald-500/10 rounded-lg mb-4">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <AlertDescription className="text-emerald-300 text-sm">
                  ✓ Transaction confirmed! TX: {" "}
                  <a
                    href={storage.txUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-emerald-200"
                  >
                    {storage.txHash?.slice(0, 10)}...
                  </a>
                </AlertDescription>
              </Alert>
            )}

            {storage.isRetrying && (
              <Alert className="border-yellow-500/50 bg-yellow-500/10 rounded-lg">
                <AlertDescription className="text-yellow-300 text-sm">
                  🔄 Processing transaction... Please wait.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Completion Reward */}
          <Card className="p-6 border-emerald-500/30 bg-emerald-500/5 rounded-xl">
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Quest Complete!</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>+100 XP Earned</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>+0.1 SHM Testnet</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Unlock Level 2</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </ModernLevel>
  );
}
