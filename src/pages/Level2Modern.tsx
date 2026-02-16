import { useState } from "react";
import { AlertCircle, Send, RotateCw, CheckCircle2, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ModernLevel, ModernCodeBlock, ModernDeploymentGuide } from "@/components/modern";
import { useOnchainSkills } from "@/hooks/useOnchainSkills";

const LEVEL_2_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OnchainSkills {
    mapping(address => uint256) public skillPoints;
    address public owner;

    event SkillEarned(address indexed player, uint256 points);

    constructor() {
        owner = msg.sender;
    }

    function earnSkill(uint256 points) external {
        require(points > 0 && points <= 1000, "Invalid points");
        skillPoints[msg.sender] += points;
        emit SkillEarned(msg.sender, points);
    }

    function getMySkills() external view returns (uint256) {
        return skillPoints[msg.sender];
    }

    function resetSkills(address player) external {
        require(msg.sender == owner, "Only owner");
        skillPoints[player] = 0;
    }
}`;

const DEPLOYMENT_STEPS = [
  { title: "Open Remix", description: "Go to https://remix.ethereum.org" },
  {
    title: "Create File",
    description: "Create a new file named OnchainSkills.sol",
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

export default function Level2Modern() {
  const [contractAddress, setContractAddress] = useState("");
  const [skillPoints, setSkillPoints] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const skills = useOnchainSkills(isConnected && contractAddress ? contractAddress : null);

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

  const handleEarnSkill = async () => {
    if (!skillPoints) return;
    await skills.earnSkill(skillPoints);
    setSkillPoints("");
  };

  const progress = isConnected ? 50 : 0;

  return (
    <ModernLevel
      icon="⚡"
      title="Level 2: Contract Apprentice"
      subtitle="Master Mappings & Ownership"
      description="Learn how to use mappings to store data indexed by addresses. Build a skill tracking system with ownership controls."
      accentColor="emerald"
      progress={progress}
    >
      {/* Step 1: Contract Code */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Step 1: Understand Mappings</h2>
        <ModernCodeBlock code={LEVEL_2_CONTRACT} title="OnchainSkills.sol" />
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <p className="text-sm text-gray-300">
            <strong>Key Concepts:</strong> This contract introduces mappings (like dictionaries), ownership patterns, and modifiers. Mappings let you store data
            efficiently indexed by addresses.
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
          <div className="space-y-4 p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <div>
              <label className="block text-sm font-semibold mb-2">Contract Address</label>
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
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-8 font-bold transition-all"
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
          <h2 className="text-2xl font-bold">Step 4: Earn Skills</h2>

          {/* Skill Points Display */}
          <Card className="p-8 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/30 rounded-xl">
            <p className="text-gray-400 mb-2">Your Skill Points</p>
            <div className="text-6xl font-black text-emerald-400 mb-6">
              {skills.mySkills || "0"}
            </div>

            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700 mb-6">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-green-400 transition-all"
                style={{ width: `${Math.min((parseInt(skills.mySkills || "0") / 1000) * 100, 100)}%` }}
              />
            </div>

            <p className="text-xs text-gray-400 mb-6">
              {Math.max(1000 - (parseInt(skills.mySkills || "0") % 1000), 0)} points to next tier
            </p>

            <Button
              onClick={() => skills.getMySkills()}
              disabled={skills.loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg py-3 flex items-center justify-center gap-2 transition-all"
            >
              <RotateCw className={`w-4 h-4 ${skills.loading ? "animate-spin" : ""}`} />
              Refresh Skills
            </Button>
          </Card>

          {/* Earn Skills */}
          <div className="p-6 rounded-xl border border-gray-700 bg-gray-900/50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Earn Skill Points
            </h3>
            <div className="flex gap-2 mb-4">
              <Input
                type="number"
                placeholder="How many points? (1-1000)"
                value={skillPoints}
                onChange={(e) => setSkillPoints(e.target.value)}
                className="bg-gray-800 border-gray-700 rounded-lg text-white flex-1"
              />
              <Button
                onClick={handleEarnSkill}
                disabled={!skillPoints || skills.loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg px-8 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Earn
              </Button>
            </div>

            {/* Status Messages */}
            {skills.error && (
              <Alert className="border-red-500/50 bg-red-500/10 rounded-lg mb-4">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300 text-sm">{skills.error}</AlertDescription>
              </Alert>
            )}

            {skills.success && (
              <Alert className="border-emerald-500/50 bg-emerald-500/10 rounded-lg mb-4">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <AlertDescription className="text-emerald-300 text-sm">
                  ✓ Skill earned! TX: {" "}
                  <a
                    href={skills.txUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-emerald-200"
                  >
                    {skills.txHash?.slice(0, 10)}...
                  </a>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Concepts Explained */}
          <Card className="p-6 border-gray-700 bg-gray-900/50 rounded-xl">
            <h3 className="font-bold mb-4">What You're Learning</h3>
            <div className="space-y-3">
              <div>
                <Badge className="mb-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/50">Mappings</Badge>
                <p className="text-sm text-gray-400">
                  `mapping(address =&gt; uint256)` creates a key-value store indexed by addresses
                </p>
              </div>
              <div>
                <Badge className="mb-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/50">Ownership</Badge>
                <p className="text-sm text-gray-400">
                  The `owner` variable and ownership checks are common security patterns
                </p>
              </div>
              <div>
                <Badge className="mb-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/50">External Functions</Badge>
                <p className="text-sm text-gray-400">
                  `external` visibility means functions can only be called from outside the contract
                </p>
              </div>
            </div>
          </Card>

          {/* Completion Reward */}
          <Card className="p-6 border-emerald-500/30 bg-emerald-500/5 rounded-xl">
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Level Progress</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>+250 XP Available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>NFT Reward Unlocked</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Unlock Level 3</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </ModernLevel>
  );
}
