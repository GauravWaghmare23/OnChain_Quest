import { useState } from "react";
import { useAccount } from "wagmi";
import { useGame } from "@/context/GameContext";
import { WalletConnect } from "@/components/web3/WalletConnect";
import { NetworkSwitcher } from "@/components/web3/NetworkSwitcher";
import { XPBar } from "@/components/game/XPBar";
import { ProgressTracker } from "@/components/game/ProgressTracker";
import { Inventory } from "@/components/game/Inventory";
import { Achievements } from "@/components/game/Achievements";
import { Leaderboard } from "@/components/game/LeaderboardPanel";
import { QuestBoard } from "@/components/game/QuestBoard";
import { SkillTree } from "@/components/game/SkillTree";
import { AIAdvisor } from "@/components/game/AIAdvisor";
import { StorageContractDemo } from "@/components/web3/StorageContractDemo";
import { NFTMintDemo } from "@/components/web3/NFTMintDemo";
import { QuestStorageLevel } from "@/components/game/QuestStorageLevel";
import { SmartContractLevel } from "@/components/game/SmartContractLevel";
import { GovernanceLevel } from "@/components/game/GovernanceLevel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CORE_QUESTS, getUnlockedQuests } from "@/lib/questSystem";

type MainTab = "learn" | "skills" | "level1" | "level2" | "level3" | "stats" | "analytics";
type SidePanel = "quests" | "inventory" | "achievements" | "leaderboard" | "advisor";

export default function Quest() {
  const { isConnected } = useAccount();
  const game = useGame();
  const [mainTab, setMainTab] = useState<MainTab>("learn");
  const [sidePanel, setSidePanel] = useState<SidePanel>("quests");
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(game.currentQuestId || null);
  const [questDetailView, setQuestDetailView] = useState<boolean>(!!game.currentQuestId);

  const playtimeHours = Math.floor(game.playtime / 3600);
  const playtimeMins = Math.floor((game.playtime % 3600) / 60);

  const unlockedQuests = getUnlockedQuests({
    completedQuests: game.questsCompleted,
    xp: game.xp,
    level: game.level,
    badges: game.achievements.filter((a) => a.unlocked).map((a) => a.id),
    nftsOwned: [],
    skillPoints: 0,
    gasSpent: game.totalGasSpent,
    gasSaved: game.totalGasSaved,
  });

  const currentQuest = selectedQuestId ? CORE_QUESTS.find((q) => q.id === selectedQuestId) : null;
  const isQuestCompleted = selectedQuestId ? game.questsCompleted.includes(selectedQuestId) : false;

  const handleSelectQuest = (questId: string) => {
    setSelectedQuestId(questId);
    setQuestDetailView(true);
    game.setCurrentQuest(questId);
  };

  const handleCompleteQuest = () => {
    if (selectedQuestId && !isQuestCompleted) {
      game.completeQuest(selectedQuestId);
    }
  };

  const renderMainContent = () => {
    switch (mainTab) {
      case "learn":
        return questDetailView && currentQuest ? (
          <div className="space-y-6">
            {/* Back button */}
            <Button
              onClick={() => setQuestDetailView(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-none border-2 border-gray-400"
            >
              ← Back to Quests
            </Button>

            {/* Quest Header */}
            <Card className={`border-2 rounded-none ${isQuestCompleted ? "border-green-400 bg-green-50" : "border-blue-400 bg-blue-50"}`}>
              <CardHeader className={`${isQuestCompleted ? "bg-green-100 border-b-2 border-green-400" : "bg-blue-100 border-b-2 border-blue-400"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{currentQuest.icon}</span>
                      <div>
                        <CardTitle className="text-2xl">{currentQuest.title}</CardTitle>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 italic">"{currentQuest.story}"</p>
                  </div>
                  {isQuestCompleted && <Badge className="bg-green-600 text-white text-lg py-2 px-3">✓ COMPLETED</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-gray-800">{currentQuest.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="p-3 bg-white border-2 border-gray-300 rounded-none">
                    <p className="font-bold text-blue-600">+{currentQuest.reward.xp}</p>
                    <p className="text-xs text-gray-600">XP Reward</p>
                  </div>
                  <div className="p-3 bg-white border-2 border-gray-300 rounded-none">
                    <p className="font-bold text-purple-600">{currentQuest.difficulty}</p>
                    <p className="text-xs text-gray-600">Difficulty</p>
                  </div>
                  <div className="p-3 bg-white border-2 border-gray-300 rounded-none">
                    <p className="font-bold text-green-600">{currentQuest.steps.length}</p>
                    <p className="text-xs text-gray-600">Steps</p>
                  </div>
                  {currentQuest.estimatedGas && (
                    <div className="p-3 bg-white border-2 border-gray-300 rounded-none">
                      <p className="font-bold text-orange-600">{currentQuest.estimatedGas} SHM</p>
                      <p className="text-xs text-gray-600">Est. Gas</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quest Steps */}
            <Card className="border-2 border-purple-400 rounded-none bg-purple-50">
              <CardHeader className="bg-purple-100 border-b-2 border-purple-400">
                <CardTitle className="text-lg">📋 Quest Steps</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {currentQuest.steps.map((step, idx) => (
                  <div key={step.id} className="p-4 bg-white border-2 border-purple-300 rounded-none space-y-2">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-purple-600 text-white font-bold">{idx + 1}</Badge>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{step.title}</p>
                        <p className="text-sm text-gray-700 mt-1">{step.instruction}</p>
                        {step.hint && (
                          <p className="text-xs text-gray-600 italic mt-2">💡 Hint: {step.hint}</p>
                        )}
                        <p className="text-xs text-blue-600 mt-2 font-semibold">→ {step.actionType}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Interactive Learning */}
            <Card className="border-2 border-green-400 rounded-none bg-green-50">
              <CardHeader className="bg-green-100 border-b-2 border-green-400">
                <CardTitle className="text-lg">🎮 Interactive Learning</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <Tabs defaultValue="storage" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-none border-2 border-green-400">
                    <TabsTrigger value="storage" className="rounded-none border border-green-300">💾 Storage Contract</TabsTrigger>
                    <TabsTrigger value="nft" className="rounded-none border border-green-300">✨ NFT Minting</TabsTrigger>
                  </TabsList>
                  <TabsContent value="storage" className="space-y-4 mt-4">
                    <StorageContractDemo />
                  </TabsContent>
                  <TabsContent value="nft" className="space-y-4 mt-4">
                    <NFTMintDemo />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Complete Quest Button */}
            {!isQuestCompleted && (
              <Button
                onClick={handleCompleteQuest}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-6 rounded-none border-2 border-green-400"
              >
                ✓ Complete Quest & Earn {currentQuest.reward.xp} XP
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <QuestBoard onSelectQuest={handleSelectQuest} />
          </div>
        );

      case "skills":
        return <SkillTree />;

      case "stats":
        return (
          <div className="space-y-6">
            <ProgressTracker />

            <Card className="border-2 border-cyan-400 rounded-none bg-cyan-50">
              <CardHeader className="bg-cyan-100 border-b-2 border-cyan-400">
                <CardTitle className="text-lg">📊 Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white border-2 border-cyan-300 rounded-none text-center">
                    <p className="text-2xl font-bold text-cyan-600">{game.level}</p>
                    <p className="text-xs text-gray-600">Current Level</p>
                  </div>
                  <div className="p-4 bg-white border-2 border-cyan-300 rounded-none text-center">
                    <p className="text-2xl font-bold text-purple-600">{game.xp}</p>
                    <p className="text-xs text-gray-600">Total XP</p>
                  </div>
                  <div className="p-4 bg-white border-2 border-cyan-300 rounded-none text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {(game.totalGasSpent / BigInt(1000000)).toString()}
                    </p>
                    <p className="text-xs text-gray-600">Gas Used</p>
                  </div>
                  <div className="p-4 bg-white border-2 border-cyan-300 rounded-none text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {`${playtimeHours}h ${playtimeMins}m`}
                    </p>
                    <p className="text-xs text-gray-600">Playtime</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white border-2 border-cyan-300 rounded-none">
                    <p className="text-sm font-bold text-gray-900 mb-2">🎮 Gamification Stats</p>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li>Achievements: {game.achievements.filter((a) => a.unlocked).length}/{game.achievements.length}</li>
                      <li>Skills Unlocked: {game.skillTree.filter((s) => s.unlocked).length}/{game.skillTree.length}</li>
                      <li>Quests Done: {game.questsCompleted.length}/5</li>
                      <li>Inventory Items: {game.inventory.length}/12</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white border-2 border-cyan-300 rounded-none">
                    <p className="text-sm font-bold text-gray-900 mb-2">⛓️ Blockchain Stats</p>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li>Network: Shardeum Mezame</li>
                      <li>Chain ID: 8119</li>
                      <li>Currency: SHM</li>
                      <li>Connected: {isConnected ? "✅ Yes" : "❌ No"}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "analytics":
        return (
          <Card className="border-2 border-orange-400 rounded-none bg-orange-50">
            <CardHeader className="bg-orange-100 border-b-2 border-orange-400">
              <CardTitle className="text-lg">📈 Platform Analytics</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="bg-white border-2 border-orange-300 rounded-none p-4">
                <p className="text-sm font-bold text-gray-900 mb-3">Your Learning Journey</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-700 mb-1">
                      <span>Course Completion</span>
                      <span>{game.getProgress().toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 border-2 border-gray-300 rounded-none">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                        style={{ width: `${game.getProgress()}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-orange-300 rounded-none p-4">
                <p className="text-sm font-bold text-gray-900 mb-3">🎓 Learning Insights</p>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li>
                    • You're learning at a <Badge className="bg-green-600 text-white">steady pace</Badge>
                  </li>
                  <li>• Next unlock: Advanced DeFi simulation (in {1500 - game.xp} XP)</li>
                  <li>• You've earned {game.achievements.filter((a) => a.unlocked).length} badges</li>
                  <li>• Keep questing! 🚀</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-orange-300 rounded-none p-4">
                <p className="text-sm font-bold text-gray-900 mb-3">💡 Recommendations</p>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li>🎯 Focus on: Complete "Gas Guru Challenge" to master optimization</li>
                  <li>🏆 Unlock: "DeFi Strategist" achievement by learning risk/reward</li>
                  <li>📚 Read: Layer 2 scaling solutions guide</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case "level1":
        return <QuestStorageLevel />;

      case "level2":
        return <SmartContractLevel />;

      case "level3":
        return <GovernanceLevel />;

      default:
        return null;
    }
  };

  const renderSidePanel = () => {
    switch (sidePanel) {
      case "quests":
        return <ProgressTracker />;
      case "inventory":
        return <Inventory />;
      case "achievements":
        return <Achievements />;
      case "leaderboard":
        return <Leaderboard />;
      case "advisor":
        return <AIAdvisor />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                ⚔️ ONCHAIN QUEST
              </h1>
              <p className="text-blue-200 mt-2 font-semibold">Master Web3 through Gamified Learning</p>
            </div>
            {isConnected && (
              <Badge className="bg-green-500 text-white border-2 border-green-400 text-lg py-2 px-4 font-bold">
                ✅ Connected
              </Badge>
            )}
          </div>

          {!isConnected ? (
            <Card className="border-2 border-yellow-400 rounded-none bg-yellow-50">
              <CardContent className="pt-6">
                <WalletConnect />
              </CardContent>
            </Card>
          ) : (
            <>
              <NetworkSwitcher />
              <XPBar />
            </>
          )}
        </div>

        {isConnected ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as MainTab)}>
                  <TabsList className="grid w-full grid-cols-7 h-auto mb-6 border-2 border-gray-400 rounded-none bg-gray-900 p-2 gap-2">
                    <TabsTrigger
                      value="learn"
                      className={`data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-none border-2 font-bold text-xs ${mainTab === 'learn' ? 'border-blue-400 text-white' : 'border-gray-600 text-gray-300 hover:text-white'}`}
                    >
                      📚 Learn
                    </TabsTrigger>
                    <TabsTrigger
                      value="skills"
                      className={`data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-none border-2 font-bold text-xs ${mainTab === 'skills' ? 'border-purple-400 text-white' : 'border-gray-600 text-gray-300 hover:text-white'}`}
                    >
                      🌳 Skills
                    </TabsTrigger>
                    <TabsTrigger
                      value="level1"
                      className={`data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-none border-2 font-bold text-xs ${mainTab === 'level1' ? 'border-cyan-400 text-white' : 'border-gray-600 text-gray-300 hover:text-white'}`}
                    >
                      📦 L1
                    </TabsTrigger>
                    <TabsTrigger
                      value="level2"
                      className={`data-[state=active]:bg-yellow-600 data-[state=active]:text-white rounded-none border-2 font-bold text-xs ${mainTab === 'level2' ? 'border-yellow-400 text-white' : 'border-gray-600 text-gray-300 hover:text-white'}`}
                    >
                      ⚡ L2
                    </TabsTrigger>
                    <TabsTrigger
                      value="level3"
                      className={`data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-none border-2 font-bold text-xs ${mainTab === 'level3' ? 'border-pink-400 text-white' : 'border-gray-600 text-gray-300 hover:text-white'}`}
                    >
                      👑 L3
                    </TabsTrigger>
                    <TabsTrigger
                      value="stats"
                      className={`data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-none border-2 font-bold text-xs ${mainTab === 'stats' ? 'border-cyan-400 text-white' : 'border-gray-600 text-gray-300 hover:text-white'}`}
                    >
                      📊 Stats
                    </TabsTrigger>
                    <TabsTrigger
                      value="analytics"
                      className={`data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-none border-2 font-bold text-xs ${mainTab === 'analytics' ? 'border-orange-400 text-white' : 'border-gray-600 text-gray-300 hover:text-white'}`}
                    >
                      📈 Analyze
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={mainTab} className="space-y-4">{renderMainContent()}</TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-4">
              {/* Quick Access Buttons */}
              <div className="bg-blue-900 border-2 border-blue-600 rounded-none p-4">
                <p className="text-white font-bold mb-3">🎮 Quick Menu</p>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-3 gap-2">
                  {([
                    { key: "quests" as const, icon: "📋", label: "Quests" },
                    { key: "inventory" as const, icon: "🎒", label: "Inv" },
                    { key: "achievements" as const, icon: "🏆", label: "Achieve" },
                    { key: "leaderboard" as const, icon: "🏅", label: "Rank" },
                    { key: "advisor" as const, icon: "🤖", label: "AI" },
                  ] as const).map((btn) => (
                    <button
                      key={btn.key}
                      onClick={() => setSidePanel(btn.key)}
                      className={`p-3 border-2 rounded-none font-bold text-xs transition-all ${
                        sidePanel === btn.key
                          ? "border-green-400 bg-green-500 text-white"
                          : "border-blue-400 bg-blue-700 text-blue-100 hover:bg-blue-600"
                      }`}
                    >
                      <div className="text-xl mb-1">{btn.icon}</div>
                      <div className="text-[10px]">{btn.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="bg-blue-950 border-2 border-blue-600 rounded-none p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {renderSidePanel()}
              </div>
            </div>
          </div>
        ) : (
          <Card className="border-2 border-gray-400 rounded-none bg-gray-50">
            <CardContent className="pt-6 text-center">
              <p className="text-lg text-gray-700 font-bold mb-4">🔓 Connect your wallet to start learning!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
