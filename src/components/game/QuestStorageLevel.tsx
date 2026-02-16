import { useState } from "react";
import { AlertCircle, Send, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuestStorage } from "@/hooks/useQuestStorage";
import { useGame } from "@/context/GameContext";
import { getTxExplorerUrl } from "@/config/contracts";
import { ContractCodeDisplay } from "./ContractCodeDisplay";
import { QuestCheckpoint } from "./QuestCheckpoint";

const LEVEL_1_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BNBQuestStorage {
    uint256 public storedNumber;
    address public lastPlayer;

    event NumberStored(address player, uint256 number);

    function storeNumber(uint256 _num) public {
        storedNumber = _num;
        lastPlayer = msg.sender;
        emit NumberStored(msg.sender, _num);
    }

    function getNumber() public view returns (uint256) {
        return storedNumber;
    }
}`;

const DEPLOYMENT_STEPS = [
  {
    number: 1,
    title: "Open Remix IDE",
    description: "Visit https://remix.ethereum.org in your browser",
  },
  {
    number: 2,
    title: "Create New File",
    description: "Click the 'Create New File' button and name it 'BNBQuestStorage.sol'",
  },
  {
    number: 3,
    title: "Paste Contract",
    description: "Copy the contract above and paste it into the file",
  },
  {
    number: 4,
    title: "Compile Contract",
    description: "Click the Solidity Compiler tab (left sidebar) and click 'Compile BNBQuestStorage.sol'",
  },
  {
    number: 5,
    title: "Deploy Contract",
    description: "Go to Deploy tab, select 'Injected Provider' (MetaMask), and click 'Deploy'",
  },
  {
    number: 6,
    title: "Copy Address",
    description: "After deployment, copy the contract address from the Deployed Contracts section",
  },
  {
    number: 7,
    title: "Paste in Game",
    description: "Return here and paste the contract address in the input field",
  },
];

export const QuestStorageLevel = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [numberToStore, setNumberToStore] = useState("");
  const [isAddressValidated, setIsAddressValidated] = useState(false);

  const storage = useQuestStorage(isAddressValidated ? contractAddress : null);
  const game = useGame();

  const handleValidateAddress = () => {
    if (contractAddress && contractAddress.startsWith("0x") && contractAddress.length === 42) {
      setIsAddressValidated(true);
    }
  };

  const handleStoreNumber = async () => {
    if (!numberToStore || parseInt(numberToStore) < 0) {
      return;
    }
    await storage.storeNumber(numberToStore);
    setNumberToStore("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-cyan-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2 pixel-text">
            📚 QUEST STORAGE LEARNER
          </h1>
          <p className="text-cyan-200 text-lg">Learn basic smart contracts, state storage, and events</p>
        </div>

        {/* Quest Objectives */}
        <QuestCheckpoint
          level="level1"
          completedQuests={game.questsCompleted}
          className="mb-8"
        />

        {/* Contract Code Display */}
        {!isAddressValidated && (
          <ContractCodeDisplay
            title="Simple Storage Contract"
            contract={LEVEL_1_CONTRACT}
            steps={DEPLOYMENT_STEPS}
            color="blue"
          />
        )}

        {/* Contract Address Input */}
        {!isAddressValidated && (
          <Card className="bg-gray-900 border-2 border-cyan-600 rounded-none mb-8 p-6 mt-6">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4 pixel-text">🔗 Connect Your Contract</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="bg-gray-800 border-cyan-500 text-white rounded-none"
                />
                <Button
                  onClick={handleValidateAddress}
                  disabled={!contractAddress || contractAddress.length !== 42}
                  className="bg-cyan-600 hover:bg-cyan-700 rounded-none pixel-button"
                >
                  Connect
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Main Content Area */}
        {isAddressValidated && (
          <div className="space-y-6">
            {/* Current Storage Display */}
            <Card className="bg-gradient-to-r from-blue-900 to-cyan-900 border-4 border-green-400 rounded-none p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-cyan-200 text-sm uppercase tracking-wider">Current Stored Number</p>
                  <h2 className="text-6xl font-black text-green-400 pixel-text">
                    {storage.storedNumber ? storage.storedNumber.toString() : "0"}
                  </h2>
                  {storage.lastPlayer && (
                    <p className="text-cyan-300 text-xs mt-2">
                      Last stored by: {storage.lastPlayer.slice(0, 6)}...{storage.lastPlayer.slice(-4)}
                    </p>
                  )}
                </div>
                <div className="text-6xl">📦</div>
              </div>

              {/* Refresh Button */}
              <Button
                onClick={() => storage.getNumber()}
                disabled={storage.loading}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-none pixel-button flex items-center justify-center gap-2"
              >
                <RotateCw className={`w-4 h-4 ${storage.loading ? "animate-spin" : ""}`} />
                Refresh Storage
              </Button>
            </Card>

            {/* Store Number Card */}
            <Card className="bg-gray-900 border-2 border-cyan-500 rounded-none p-6">
              <h3 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center gap-2 pixel-text">
                💾 Store Number
              </h3>

              <div className="space-y-4">
                {/* Input and Button */}
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter a number to store"
                    value={numberToStore}
                    onChange={(e) => setNumberToStore(e.target.value)}
                    className="bg-gray-800 border-cyan-500 text-white rounded-none flex-1"
                  />
                  <Button
                    onClick={handleStoreNumber}
                    disabled={storage.loading || !numberToStore}
                    className="bg-green-600 hover:bg-green-700 rounded-none pixel-button flex items-center gap-2"
                  >
                    {storage.loading ? "Storing..." : <>
                      <Send className="w-4 h-4" />
                      Store
                    </>}
                  </Button>
                </div>

                {/* Status Messages */}
                {storage.error && (
                  <Alert className="border-2 border-red-500 bg-red-900 rounded-none">
                    <AlertCircle className="h-4 w-4 text-red-300" />
                    <AlertDescription className="text-red-200">{storage.error}</AlertDescription>
                  </Alert>
                )}

                {storage.success && (
                  <Alert className="border-2 border-green-500 bg-green-900 rounded-none">
                    <AlertDescription className="text-green-200">
                      ✅ Number stored! TX: <a href={storage.txUrl || "#"} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-300">{storage.txHash?.slice(0, 10)}...</a>
                    </AlertDescription>
                  </Alert>
                )}

                {storage.isRetrying && (
                  <Alert className="border-2 border-yellow-500 bg-yellow-900 rounded-none">
                    <AlertDescription className="text-yellow-200">
                      🔄 Transaction processing... Please wait.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Info Box */}
                <div className="bg-black border-2 border-cyan-400 p-4 text-sm text-cyan-200 space-y-2">
                  <p>📖 <strong>Smart Contract Concepts:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><code className="bg-gray-800 px-2 py-1 rounded">uint256 storedNumber</code> - Public state variable</li>
                    <li><code className="bg-gray-800 px-2 py-1 rounded">storeNumber()</code> - Write data on-chain</li>
                    <li><code className="bg-gray-800 px-2 py-1 rounded">getNumber()</code> - Read data from blockchain</li>
                    <li><code className="bg-gray-800 px-2 py-1 rounded">event</code> - Log actions for off-chain apps</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* AI Advisor Explanation */}
            <Card className="bg-indigo-900 border-2 border-indigo-500 rounded-none p-6">
              <h3 className="text-xl font-bold text-indigo-200 mb-3 flex items-center gap-2 pixel-text">
                🤖 AI Advisor
              </h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Smart contracts are programs that run on the blockchain. State variables like `storedNumber` are permanently stored, making them immutable and transparent. When you call `storeNumber()`, you're creating a transaction that updates this state forever!
              </p>
            </Card>

            {/* Contract Info */}
            <Card className="bg-gray-900 border-2 border-gray-700 rounded-none p-4">
              <p className="text-gray-400 text-xs">
                Contract Address: <code className="bg-black px-2 py-1 rounded text-cyan-400">{contractAddress}</code>
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
