import { useState, useEffect } from "react";
import { AlertCircle, MessageSquarePlus, Vote, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOnchainGovernance } from "@/hooks/useOnchainGovernance";
import { useGame } from "@/context/GameContext";
import { getTxExplorerUrl } from "@/config/contracts";
import { ContractCodeDisplay } from "./ContractCodeDisplay";
import { QuestCheckpoint } from "./QuestCheckpoint";

const LEVEL_3_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OnchainGovernance {
    struct Proposal {
        string title;
        uint256 votes;
    }

    Proposal[] public proposals;
    mapping(address => uint256) public reputation;
    mapping(address => bool) public voted;

    event ProposalCreated(string title);
    event Voted(address voter, uint256 proposalId);

    function createProposal(string memory title) public {
        proposals.push(Proposal(title, 0));
        emit ProposalCreated(title);
    }

    function vote(uint256 proposalId) public {
        require(!voted[msg.sender], "Already voted");
        require(proposalId < proposals.length, "Invalid proposal");

        proposals[proposalId].votes++;
        voted[msg.sender] = true;
        reputation[msg.sender] += 10;

        emit Voted(msg.sender, proposalId);
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
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
    description: "Click the 'Create New File' button and name it 'OnchainGovernance.sol'",
  },
  {
    number: 3,
    title: "Paste Contract",
    description: "Copy the contract above and paste it into the file",
  },
  {
    number: 4,
    title: "Compile Contract",
    description: "Click the Solidity Compiler tab and click 'Compile OnchainGovernance.sol'",
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

export const GovernanceLevel = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [proposalTitle, setProposalTitle] = useState("");
  const [isAddressValidated, setIsAddressValidated] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const governance = useOnchainGovernance(isAddressValidated ? contractAddress : null);
  const game = useGame();

  const handleValidateAddress = () => {
    if (contractAddress && contractAddress.startsWith("0x") && contractAddress.length === 42) {
      setIsAddressValidated(true);
    }
  };

  const handleCreateProposal = async () => {
    if (!proposalTitle || proposalTitle.trim().length === 0) {
      return;
    }
    await governance.createProposal(proposalTitle);
    setProposalTitle("");
  };

  const handleVote = async (proposalId: number) => {
    if (governance.hasVoted) {
      return;
    }
    await governance.vote(proposalId);
    // Show celebration when vote succeeds
    if (governance.success) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-black p-6">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-8xl animate-bounce">🎉</div>
          <div className="text-6xl animate-spin">👑</div>
          <div className="text-8xl animate-bounce" style={{ animationDelay: "0.2s" }}>🎊</div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-2 pixel-text">
            👑 WEB3 MASTER - DAO GOVERNANCE
          </h1>
          <p className="text-purple-300 text-lg">Learn DAO, governance, and decentralization</p>
        </div>

        {/* Quest Objectives */}
        <QuestCheckpoint
          level="level3"
          completedQuests={game.questsCompleted}
          className="mb-8"
        />

        {/* Contract Code Display */}
        {!isAddressValidated && (
          <ContractCodeDisplay
            title="DAO Governance Contract"
            contract={LEVEL_3_CONTRACT}
            steps={DEPLOYMENT_STEPS}
            color="pink"
          />
        )}

        {/* Contract Address Input */}
        {!isAddressValidated && (
          <Card className="bg-gray-900 border-2 border-yellow-500 rounded-none mb-8 p-6 mt-6">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4 pixel-text">🔗 Connect Your Contract</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="bg-gray-800 border-yellow-500 text-white rounded-none"
                />
                <Button
                  onClick={handleValidateAddress}
                  disabled={!contractAddress || contractAddress.length !== 42}
                  className="bg-yellow-600 hover:bg-yellow-700 rounded-none pixel-button"
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
            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Reputation Card */}
              <Card className="bg-gradient-to-br from-yellow-900 to-orange-900 border-4 border-yellow-400 rounded-none p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-200 text-sm uppercase tracking-wider">Your Reputation</p>
                    <h2 className="text-5xl font-black text-yellow-300 pixel-text">
                      {governance.myReputation ? governance.myReputation.toString() : "0"}
                    </h2>
                  </div>
                  <Award className="w-12 h-12 text-yellow-300 animate-bounce" />
                </div>
              </Card>

              {/* Total Proposals Card */}
              <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 border-4 border-purple-400 rounded-none p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm uppercase tracking-wider">Active Proposals</p>
                    <h2 className="text-5xl font-black text-purple-300 pixel-text">
                      {governance.proposals.length}
                    </h2>
                  </div>
                  <MessageSquarePlus className="w-12 h-12 text-purple-300 animate-pulse" />
                </div>
              </Card>

              {/* Voting Status */}
              <Card className={`border-4 rounded-none p-6 ${governance.hasVoted ? "bg-gradient-to-br from-green-900 to-emerald-900 border-green-400" : "bg-gradient-to-br from-red-900 to-pink-900 border-red-400"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 text-sm uppercase tracking-wider">Voting Status</p>
                    <h2 className="text-3xl font-black pixel-text mt-2">
                      {governance.hasVoted ? "✅ VOTED" : "❌ NOT VOTED"}
                    </h2>
                  </div>
                  <Vote className={`w-12 h-12 ${governance.hasVoted ? "text-green-300" : "text-red-300"}`} />
                </div>
              </Card>
            </div>

            {/* Create Proposal Section */}
            <Card className="bg-gray-900 border-2 border-yellow-500 rounded-none p-6">
              <h3 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2 pixel-text">
                <MessageSquarePlus className="w-6 h-6" /> Create Proposal
              </h3>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Proposal title (e.g., 'Increase reward pool')"
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    className="bg-gray-800 border-yellow-500 text-white rounded-none flex-1"
                    maxLength={500}
                  />
                  <Button
                    onClick={handleCreateProposal}
                    disabled={governance.loading || !proposalTitle || proposalTitle.trim().length === 0}
                    className="bg-yellow-600 hover:bg-yellow-700 rounded-none pixel-button"
                  >
                    {governance.loading ? "Creating..." : "Propose"}
                  </Button>
                </div>

                {governance.error && (
                  <Alert className="border-2 border-red-500 bg-red-900 rounded-none">
                    <AlertCircle className="h-4 w-4 text-red-300" />
                    <AlertDescription className="text-red-200">{governance.error}</AlertDescription>
                  </Alert>
                )}

                {governance.success && (
                  <Alert className="border-2 border-green-500 bg-green-900 rounded-none">
                    <AlertDescription className="text-green-200">
                      ✅ Proposal created! TX: <a href={governance.txUrl || "#"} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-300">{governance.txHash?.slice(0, 10)}...</a>
                    </AlertDescription>
                  </Alert>
                )}

                {governance.isRetrying && (
                  <Alert className="border-2 border-yellow-500 bg-yellow-900 rounded-none">
                    <AlertDescription className="text-yellow-200">
                      🔄 Transaction processing... Please wait.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </Card>

            {/* Proposals List */}
            <Card className="bg-gray-900 border-2 border-purple-500 rounded-none p-6">
              <h3 className="text-2xl font-bold text-purple-300 mb-4 pixel-text">
                📋 Active Proposals ({governance.proposals.length})
              </h3>

              {governance.proposals.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-lg">No proposals yet. Be the first to create one! 🚀</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {governance.proposals.map((proposal, idx) => (
                    <div
                      key={idx}
                      className="bg-black border-2 border-purple-400 p-4 rounded-none hover:border-purple-300 transition"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-purple-300">
                            #{idx + 1} - {proposal.title}
                          </h4>
                          <div className="mt-2 bg-gray-800 border-2 border-purple-500 p-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 transition-all duration-300"
                              style={{
                                width: `${Math.min((Number(proposal.votes) / 100) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            Votes: {proposal.votes.toString()} / 100
                          </p>
                        </div>
                        <Button
                          onClick={() => handleVote(idx)}
                          disabled={governance.loading || governance.hasVoted}
                          className={`rounded-none pixel-button flex items-center gap-2 whitespace-nowrap ${
                            governance.hasVoted
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-pink-600 hover:bg-pink-700"
                          }`}
                        >
                          {governance.loading ? "Voting..." : <>
                            <Vote className="w-4 h-4" />
                            {governance.hasVoted ? "Voted" : "Vote"}
                          </>}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* AI Advisor Explanation */}
            <Card className="bg-indigo-900 border-2 border-indigo-500 rounded-none p-6">
              <h3 className="text-xl font-bold text-indigo-200 mb-3 flex items-center gap-2 pixel-text">
                🤖 AI Advisor
              </h3>
              <div className="text-indigo-100 text-sm space-y-3 leading-relaxed">
                <p>
                  <strong>DAOs (Decentralized Autonomous Organizations)</strong> are governed by smart contracts instead of central authorities. Governance contracts allow communities to:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Create Proposals</strong> - Any member can suggest changes</li>
                  <li><strong>Vote Transparently</strong> - Immutable voting records on-chain</li>
                  <li><strong>Earn Reputation</strong> - Active participants gain voting power</li>
                  <li><strong>Decentralize Decisions</strong> - No single entity controls the DAO</li>
                </ul>
                <p>
                  This is how major crypto projects like Uniswap and Arbitrum make decisions - through on-chain governance!
                </p>
              </div>
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
