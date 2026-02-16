import { useState } from "react";
import { useAccount } from "wagmi";
import { useGame } from "@/context/GameContext";
import WalletConnect from "@/components/web3/WalletConnect";
import TransactionPanel from "@/components/web3/TransactionPanel";
import ContractInteraction from "@/components/web3/ContractInteraction";
import NFTMint from "@/components/web3/NFTMint";
import XPBar from "@/components/game/XPBar";
import ProgressTracker from "@/components/game/ProgressTracker";
import Inventory from "@/components/game/Inventory";
import Achievements from "@/components/game/Achievements";
import Leaderboard from "@/components/game/Leaderboard";

const questLevels = [
  { id: 0, title: "ENTER THE KINGDOM", subtitle: "Connect your wallet", icon: "🏠" },
  { id: 1, title: "THE ROYAL DECREE", subtitle: "Sign a message & send BNB", icon: "📜" },
  { id: 2, title: "THE ENCHANTMENT", subtitle: "Interact with a smart contract", icon: "🔮" },
  { id: 3, title: "LEGENDARY FORGE", subtitle: "Mint your achievement NFT", icon: "⚔️" },
];

type SidePanel = "quests" | "inventory" | "achievements" | "leaderboard";

const Quest = () => {
  const { isConnected } = useAccount();
  const { currentQuest, questsCompleted } = useGame();
  const [sidePanel, setSidePanel] = useState<SidePanel>("quests");

  const getActiveLevel = () => {
    if (!isConnected) return 0;
    if (!questsCompleted.includes(1) || !questsCompleted.includes(2)) return 1;
    if (!questsCompleted.includes(3)) return 2;
    return 3;
  };

  const activeLevel = getActiveLevel();

  const renderQuestContent = () => {
    switch (activeLevel) {
      case 0:
        return <WalletConnect />;
      case 1:
        return <TransactionPanel />;
      case 2:
        return <ContractInteraction />;
      case 3:
        return <NFTMint />;
      default:
        return <WalletConnect />;
    }
  };

  const sidePanelButtons: { key: SidePanel; icon: string; label: string }[] = [
    { key: "quests", icon: "📋", label: "QUESTS" },
    { key: "inventory", icon: "🎒", label: "ITEMS" },
    { key: "achievements", icon: "🏆", label: "BADGES" },
    { key: "leaderboard", icon: "🏅", label: "RANKS" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-sm md:text-lg text-accent pixel-text-shadow">⛏️ BNB QUEST</h1>
          <div className="flex items-center gap-3">
            {isConnected && (
              <span className="text-[8px] text-level-complete pixel-border px-2 py-1 bg-muted">
                🟢 ONLINE
              </span>
            )}
          </div>
        </div>
        <XPBar />
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quest Board - Main Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Level Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            {questLevels.map((level) => (
              <div
                key={level.id}
                className={`flex items-center gap-1 px-3 py-2 text-[8px] whitespace-nowrap pixel-border ${
                  level.id === activeLevel
                    ? "bg-primary text-primary-foreground"
                    : questsCompleted.includes(level.id) || (level.id <= 1 && questsCompleted.includes(level.id))
                    ? "bg-muted text-level-complete"
                    : "bg-background text-muted-foreground opacity-50"
                }`}
              >
                <span>{level.icon}</span>
                <span>{level.title}</span>
                {questsCompleted.includes(level.id) && <span>✅</span>}
              </div>
            ))}
          </div>

          {/* Active Quest */}
          <div className="quest-panel">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{questLevels[activeLevel]?.icon}</span>
              <div>
                <h2 className="text-[10px] text-accent">{questLevels[activeLevel]?.title}</h2>
                <p className="text-[8px] text-muted-foreground">{questLevels[activeLevel]?.subtitle}</p>
              </div>
            </div>
            {renderQuestContent()}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Sidebar Tabs */}
          <div className="grid grid-cols-4 gap-1">
            {sidePanelButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setSidePanel(btn.key)}
                className={`pixel-btn text-[6px] py-2 px-1 text-center ${
                  sidePanel === btn.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <div>{btn.icon}</div>
                <div>{btn.label}</div>
              </button>
            ))}
          </div>

          {/* Sidebar Content */}
          {sidePanel === "quests" && <ProgressTracker />}
          {sidePanel === "inventory" && <Inventory />}
          {sidePanel === "achievements" && <Achievements />}
          {sidePanel === "leaderboard" && <Leaderboard />}
        </div>
      </div>
    </div>
  );
};

export default Quest;
