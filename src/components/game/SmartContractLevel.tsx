import { useState } from "react";
import { AlertCircle, Send, Zap, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOnchainSkills } from "@/hooks/useOnchainSkills";
import { useGame } from "@/context/GameContext";
import { getTxExplorerUrl } from "@/config/contracts";
import { ContractCodeDisplay } from "./ContractCodeDisplay";
import { QuestCheckpoint } from "./QuestCheckpoint";

const LEVEL_2_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OnchainSkills {
    mapping(address => uint256) public skillPoints;
    address public owner;

    event SkillEarned(address player, uint256 points);

    constructor() {
        owner = msg.sender;
    }

    function earnSkill(uint256 points) public {
        require(points > 0, "Invalid points");
        skillPoints[msg.sender] += points;
        emit SkillEarned(msg.sender, points);
    }

    function resetSkills(address player) public {
        require(msg.sender == owner, "Only owner");
        skillPoints[player] = 0;
    }

    function getMySkills() public view returns (uint256) {
        return skillPoints[msg.sender];
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
    description: "Click the 'Create New File' button and name it 'OnchainSkills.sol'",
  },
  {
    number: 3,
    title: "Paste Contract",
    description: "Copy the contract above and paste it into the file",
  },
  {
    number: 4,
    title: "Compile Contract",
    description: "Click the Solidity Compiler tab (left sidebar) and click 'Compile OnchainSkills.sol'",
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

export const SmartContractLevel = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [skillPoints, setSkillPoints] = useState("");
  const [isAddressValidated, setIsAddressValidated] = useState(false);

  const skills = useOnchainSkills(isAddressValidated ? contractAddress : null);
  const game = useGame();

  const handleValidateAddress = () => {
    if (contractAddress && contractAddress.startsWith("0x") && contractAddress.length === 42) {
      setIsAddressValidated(true);
    }
  };

  const handleEarnSkill = async () => {
    if (!skillPoints || parseInt(skillPoints) <= 0) {
      return;
    }
    await skills.earnSkill(skillPoints);
    setSkillPoints("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2 pixel-text">
            ⚡ SMART CONTRACT APPRENTICE
          </h1>
          <p className="text-purple-200 text-lg">Learn mappings, ownership, and on-chain state</p>
        </div>

        {/* Quest Objectives */}
        <QuestCheckpoint
          level="level2"
          completedQuests={game.questsCompleted}
          className="mb-8"
        />

        {/* Contract Code Display */}
        {!isAddressValidated && (
          <ContractCodeDisplay
            title="Simple Skills Contract"
            contract={LEVEL_2_CONTRACT}
            steps={DEPLOYMENT_STEPS}
            color="purple"
          />
        )}

        {/* Contract Address Input */}
        {!isAddressValidated && (
          <Card className="bg-gray-900 border-2 border-purple-600 rounded-none mb-8 p-6 mt-6">
            <h2 className="text-2xl font-bold text-purple-300 mb-4 pixel-text">🔗 Connect Your Contract</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="bg-gray-800 border-purple-500 text-white rounded-none"
                />
                <Button
                  onClick={handleValidateAddress}
                  disabled={!contractAddress || contractAddress.length !== 42}
                  className="bg-purple-600 hover:bg-purple-700 rounded-none pixel-button"
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
            {/* Current Skills Display */}
            <Card className="bg-gradient-to-r from-purple-900 to-pink-900 border-4 border-yellow-400 rounded-none p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm uppercase tracking-wider">Current Skills</p>
                  <h2 className="text-6xl font-black text-yellow-300 pixel-text">
                    {skills.mySkills ? skills.mySkills.toString() : "0"}
                  </h2>
                  <p className="text-purple-300 text-sm mt-2">XP Points</p>
                </div>
                <div className="text-6xl animate-bounce">⚡</div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 bg-black border-2 border-purple-400 p-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-6 transition-all duration-500"
                  style={{
                    width: `${Math.min((Number(skills.mySkills || 0) / 1000) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-purple-200 text-xs mt-2">
                {skills.mySkills ? Math.min((Number(skills.mySkills) / 1000) * 100, 100).toFixed(1) : 0}% to Master (1000 XP)
              </p>

              {/* Refresh Button */}
              <Button
                onClick={() => skills.getMySkills()}
                disabled={skills.loading}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-none pixel-button flex items-center gap-2"
              >
                <RotateCw className={`w-4 h-4 ${skills.loading ? "animate-spin" : ""}`} />
                Refresh Skills
              </Button>
            </Card>

            {/* Earn Skills Card */}
            <Card className="bg-gray-900 border-2 border-purple-500 rounded-none p-6">
              <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2 pixel-text">
                <Zap className="w-6 h-6" /> Earn Skill Points
              </h3>

              <div className="space-y-4">
                {/* Input and Button */}
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter skill points (1-1000)"
                    value={skillPoints}
                    onChange={(e) => setSkillPoints(e.target.value)}
                    className="bg-gray-800 border-purple-500 text-white rounded-none flex-1"
                    max="1000"
                    min="1"
                  />
                  <Button
                    onClick={handleEarnSkill}
                    disabled={skills.loading || !skillPoints || parseInt(skillPoints) <= 0}
                    className="bg-green-600 hover:bg-green-700 rounded-none pixel-button flex items-center gap-2"
                  >
                    {skills.loading ? "Processing..." : <>
                      <Send className="w-4 h-4" />
                      Earn
                    </>}
                  </Button>
                </div>

                {/* Status Messages */}
                {skills.error && (
                  <Alert className="border-2 border-red-500 bg-red-900 rounded-none">
                    <AlertCircle className="h-4 w-4 text-red-300" />
                    <AlertDescription className="text-red-200">{skills.error}</AlertDescription>
                  </Alert>
                )}

                {skills.success && (
                  <Alert className="border-2 border-green-500 bg-green-900 rounded-none">
                    <AlertDescription className="text-green-200">
                      ✅ Skills earned! Transaction: <a href={skills.txUrl || "#"} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-300">{skills.txHash?.slice(0, 10)}...</a>
                    </AlertDescription>
                  </Alert>
                )}

                {skills.isRetrying && (
                  <Alert className="border-2 border-yellow-500 bg-yellow-900 rounded-none">
                    <AlertDescription className="text-yellow-200">
                      🔄 Retrying transaction... Please wait.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Info Box */}
                <div className="bg-black border-2 border-purple-400 p-4 text-sm text-purple-200 space-y-2">
                  <p>📖 <strong>Smart Contract Concepts:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><code className="bg-gray-800 px-2 py-1 rounded">mapping(address =&gt; uint256)</code> - Store skill points by wallet address</li>
                    <li><code className="bg-gray-800 px-2 py-1 rounded">earnSkill()</code> - Increment your skill points on-chain</li>
                    <li><code className="bg-gray-800 px-2 py-1 rounded">getMySkills()</code> - Read your current skill level</li>
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
                Mappings are like on-chain dictionaries that permanently store data tied to wallet addresses. When you earn skills, the contract updates its internal mapping, creating an immutable record on the blockchain. This is how games track player progress!
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
