import { useState } from "react";
import { useAccount } from "wagmi";
import { useGame } from "@/context/GameContext";
import { ArrowRight, User, TrendingUp, Award, Code2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletConnect } from "@/components/web3/WalletConnect";

interface DashboardTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const DASHBOARD_TABS: DashboardTab[] = [
  { id: "levels", label: "Levels", icon: <Code2 className="w-4 h-4" /> },
  { id: "progress", label: "Progress", icon: <TrendingUp className="w-4 h-4" /> },
  { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
];

export default function DashboardModern() {
  const { isConnected, address } = useAccount();
  const game = useGame();
  const [activeTab, setActiveTab] = useState("levels");

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md mx-4">
          <div>
            <h1 className="text-4xl font-black mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Connect Wallet
              </span>
            </h1>
            <p className="text-gray-400">You need to connect your wallet to access the dashboard.</p>
          </div>
          <WalletConnect />
        </div>
      </div>
    );
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* User Card */}
      <div className="p-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-black backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Profile</h2>
            <p className="text-gray-400 font-mono text-sm">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-2xl">
            ⚡
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-black/50 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total XP</p>
            <p className="text-3xl font-black text-emerald-400">{game.xp}</p>
          </div>
          <div className="p-4 bg-black/50 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Level</p>
            <p className="text-3xl font-black text-cyan-400">{game.level}</p>
          </div>
          <div className="p-4 bg-black/50 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Quests Done</p>
            <p className="text-3xl font-black text-purple-400">{game.questsCompleted.length}</p>
          </div>
          <div className="p-4 bg-black/50 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Playtime</p>
            <p className="text-3xl font-black text-blue-400">
              {Math.floor(game.playtime / 3600)}h
            </p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="p-8 rounded-2xl border border-gray-700/50 bg-black backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-6">Achievements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {game.achievements.slice(0, 6).map((achievement) => (
            <div key={achievement.id} className="p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-emerald-500/50 transition-colors text-center">
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <p className="text-xs text-gray-400">{achievement.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProgressTab = () => (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-black backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Overall Progress</span>
            <span className="text-2xl font-black text-cyan-400">
              {Math.round((game.questsCompleted.length / 5) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-500"
              style={{ width: `${(game.questsCompleted.length / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-black backdrop-blur-sm">
          <p className="text-gray-400 mb-4">XP to Next Level</p>
          <p className="text-3xl font-black text-emerald-400">{1000 - (game.xp % 1000)}</p>
        </div>

        <div className="p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-black backdrop-blur-sm">
          <p className="text-gray-400 mb-4">Contracts Deployed</p>
          <p className="text-3xl font-black text-purple-400">{game.questsCompleted.length}</p>
        </div>
      </div>

      {/* Level Progress Chart */}
      <div className="p-8 rounded-2xl border border-gray-700/50 bg-black backdrop-blur-sm space-y-6">
        <h3 className="text-xl font-bold">Level Completion</h3>

        <div className="space-y-4">
          {/* Level 1 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-cyan-400">Level 1: Storage</span>
              <span className="text-sm text-gray-400">2/3</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 w-2/3 transition-all" />
            </div>
          </div>

          {/* Level 2 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-emerald-400">Level 2: Skills</span>
              <span className="text-sm text-gray-400">0/1</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-green-400 w-0 transition-all" />
            </div>
          </div>

          {/* Level 3 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-purple-400">Level 3: Governance</span>
              <span className="text-sm text-gray-400">0/1</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
              <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 w-0 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLevelsTab = () => (
    <div className="space-y-6">
      {/* Level Cards */}
      {[
        {
          id: "level1",
          title: "Level 1: Storage Learner",
          icon: "📦",
          description: "Master smart contract state variables and storage.",
          color: "from-cyan-500/10 to-blue-500/10",
          border: "border-cyan-500/30",
          accent: "text-cyan-400",
          url: "/quest?tab=level1",
        },
        {
          id: "level2",
          title: "Level 2: Contract Apprentice",
          icon: "⚡",
          description: "Learn mappings, ownership, and advanced patterns.",
          color: "from-emerald-500/10 to-green-500/10",
          border: "border-emerald-500/30",
          accent: "text-emerald-400",
          url: "/quest?tab=level2",
        },
        {
          id: "level3",
          title: "Level 3: Governance Master",
          icon: "👑",
          description: "Build DAOs, voting systems, and governance contracts.",
          color: "from-purple-500/10 to-pink-500/10",
          border: "border-purple-500/30",
          accent: "text-purple-400",
          url: "/quest?tab=level3",
        },
      ].map((level) => (
        <div
          key={level.id}
          className={`p-8 rounded-2xl border ${level.border} bg-gradient-to-br ${level.color} backdrop-blur-sm hover:${level.border}-50 transition-all group cursor-pointer`}
          onClick={() => (window.location.href = level.url)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{level.icon}</div>
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${level.accent}`}>{level.title}</h3>
                <p className="text-gray-400">{level.description}</p>
              </div>
            </div>
            <ArrowRight className={`w-6 h-6 ${level.accent} group-hover:translate-x-1 transition-transform`} />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-white/10 text-white border border-white/20">
              Deploy Contract
            </Badge>
            <Badge className="bg-white/10 text-white border border-white/20">
              Interact
            </Badge>
            <Badge className="bg-white/10 text-white border border-white/20">
              Earn XP
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Grid Background */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded flex items-center justify-center text-sm font-bold text-black">
              OQ
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Onchain Quest
            </span>
          </div>
          <WalletConnect />
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Continue your Web3 learning journey. Level: <span className="text-emerald-400 font-bold">{game.level}</span>
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-800">
            {DASHBOARD_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 font-semibold flex items-center gap-2 transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-emerald-400 text-emerald-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === "levels" && renderLevelsTab()}
            {activeTab === "progress" && renderProgressTab()}
            {activeTab === "profile" && renderProfileTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
