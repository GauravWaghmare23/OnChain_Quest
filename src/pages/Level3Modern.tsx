import { useState } from "react";
import { AlertCircle, Send, RotateCw, CheckCircle2, Award, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ModernLevel, ModernCodeBlock, ModernDeploymentGuide } from "@/components/modern";
import { useOnchainGovernance } from "@/hooks/useOnchainGovernance";

const LEVEL_3_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OnchainGovernance {
    struct Proposal {
        string title;
        uint256 votes;
        bool active;
    }

    Proposal[] public proposals;
    mapping(address => uint256) public reputation;
    mapping(address => bool) public hasVoted;

    event ProposalCreated(string title);
    event ProposalVoted(address indexed voter, uint256 proposalId);

    function createProposal(string memory title) external {
        proposals.push(Proposal(title, 0, true));
        emit ProposalCreated(title);
    }

    function vote(uint256 proposalId) external {
        require(proposalId < proposals.length, "Proposal not found");
        require(!hasVoted[msg.sender], "Already voted");
        
        proposals[proposalId].votes++;
        reputation[msg.sender] += 10;
        hasVoted[msg.sender] = true;
        
        emit ProposalVoted(msg.sender, proposalId);
    }

    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }
}`;

const DEPLOYMENT_STEPS = [
  { title: "Open Remix", description: "Go to https://remix.ethereum.org" },
  {
    title: "Create File",
    description: "Create a new file named OnchainGovernance.sol",
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

export default function Level3Modern() {
  const [contractAddress, setContractAddress] = useState("");
  const [proposalTitle, setProposalTitle] = useState("");
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const governance = useOnchainGovernance(isConnected && contractAddress ? contractAddress : null);

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

  const handleCreateProposal = async () => {
    if (!proposalTitle) return;
    await governance.createProposal(proposalTitle);
    setProposalTitle("");
  };

  const handleVote = async (proposalId: number) => {
    await governance.vote(proposalId);
    setSelectedProposal(null);
  };

  const progress = isConnected ? 50 : 0;

  return (
    <ModernLevel
      icon="👑"
      title="Level 3: Governance Master"
      subtitle="Build DAOs & Voting Systems"
      description="Learn decentralized governance by building a proposal voting system with reputation tracking. Understand how DAOs make decisions."
      accentColor="purple"
      progress={progress}
    >
      {/* Step 1: Contract Code */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Step 1: Understanding DAO Contracts</h2>
        <ModernCodeBlock code={LEVEL_3_CONTRACT} title="OnchainGovernance.sol" />
        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
          <p className="text-sm text-gray-300">
            <strong>DAO Concepts:</strong> This contract demonstrates structs (custom data types), proposal voting, and reputation systems. These are the foundations
            of decentralized governance.
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
          <div className="space-y-4 p-6 rounded-xl border border-purple-500/30 bg-purple-500/5">
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
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-8 font-bold transition-all"
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
          <h2 className="text-2xl font-bold">Step 4: Participate in Governance</h2>

          {/* Reputation Card */}
          <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">Your Reputation</p>
                <div className="text-5xl font-black text-purple-400">{governance.reputation || "0"}</div>
              </div>
              <Award className="w-16 h-16 text-purple-400/50" />
            </div>
            <p className="text-xs text-gray-400 mt-4">+10 reputation points per vote</p>
          </Card>

          {/* Create Proposal */}
          <div className="p-6 rounded-xl border border-gray-700 bg-gray-900/50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              Create Proposal
            </h3>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Propose something for the DAO..."
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                className="bg-gray-800 border-gray-700 rounded-lg text-white flex-1 placeholder:text-gray-500"
              />
              <Button
                onClick={handleCreateProposal}
                disabled={!proposalTitle || governance.loading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg px-8 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Create
              </Button>
            </div>

            {/* Status Messages */}
            {governance.error && (
              <Alert className="border-red-500/50 bg-red-500/10 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300 text-sm">{governance.error}</AlertDescription>
              </Alert>
            )}

            {governance.success && (
              <Alert className="border-purple-500/50 bg-purple-500/10 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-purple-400" />
                <AlertDescription className="text-purple-300 text-sm">
                  ✓ Proposal created! TX: {" "}
                  <a
                    href={governance.txUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-purple-200"
                  >
                    {governance.txHash?.slice(0, 10)}...
                  </a>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Active Proposals */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Active Proposals</h3>

            {governance.proposals && governance.proposals.length > 0 ? (
              <div className="grid gap-4">
                {governance.proposals.map((proposal, idx) => (
                  <Card key={idx} className="p-6 border-gray-700 bg-gray-900/50 rounded-xl hover:border-purple-500/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">{proposal.title}</h4>
                        <div className="flex gap-4">
                          <div>
                            <p className="text-xs text-gray-400">Votes</p>
                            <p className="text-2xl font-black text-purple-400">{proposal.votes || "0"}</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleVote(idx)}
                        disabled={governance.hasVoted || governance.loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg px-6 transition-all"
                      >
                        {governance.loading ? "Voting..." : "Vote"}
                      </Button>
                    </div>

                    {governance.hasVoted && (
                      <p className="text-xs text-gray-400">✓ You have voted (1 vote per address)</p>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center border-gray-700 bg-gray-900/50 rounded-xl">
                <p className="text-gray-400">No proposals yet. Be the first to create one!</p>
              </Card>
            )}
          </div>

          {/* DAO Concepts */}
          <Card className="p-6 border-gray-700 bg-gray-900/50 rounded-xl">
            <h3 className="font-bold mb-4">DAO Concepts</h3>
            <div className="space-y-3">
              <div>
                <Badge className="mb-2 bg-purple-500/20 text-purple-300 border-purple-500/50">Structs</Badge>
                <p className="text-sm text-gray-400">
                  `struct Proposal` groups related data together - the building block for custom data types
                </p>
              </div>
              <div>
                <Badge className="mb-2 bg-purple-500/20 text-purple-300 border-purple-500/50">Voting</Badge>
                <p className="text-sm text-gray-400">
                  Decentralized decision-making where 1 address = 1 vote (in this simple example)
                </p>
              </div>
              <div>
                <Badge className="mb-2 bg-purple-500/20 text-purple-300 border-purple-500/50">Reputation</Badge>
                <p className="text-sm text-gray-400">
                  Members earn reputation through participation, creating aligned incentives
                </p>
              </div>
            </div>
          </Card>

          {/* Completion Reward */}
          <Card className="p-6 border-purple-500/30 bg-purple-500/5 rounded-xl">
            <h3 className="text-lg font-bold mb-4 text-purple-400">Master Achieved!</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>+300 XP Earned</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>DAO Ecosystem Badge</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Full Web3 Developer</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </ModernLevel>
  );
}
