import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CORE_QUESTS, getUnlockedQuests, getQuestsByLevel } from "@/lib/questSystem";
import { Lock, ChevronRight } from "lucide-react";

interface QuestBoardProps {
  onSelectQuest?: (questId: string) => void;
}

export const QuestBoard = ({ onSelectQuest }: QuestBoardProps) => {
  const game = useGame();

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-900 border-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-900 border-yellow-300";
      case "advanced":
        return "bg-red-100 text-red-900 border-red-300";
      default:
        return "bg-gray-100 text-gray-900 border-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      wallet_setup: "🔑",
      transaction: "⛓️",
      smart_contract: "📝",
      nft_minting: "✨",
      gas_optimization: "⚙️",
      defi_simulation: "📊",
      security: "🛡️",
    };
    return icons[type] || "🎮";
  };

  const renderLevelSection = (
    level: "level1" | "level2" | "level3",
    levelTitle: string,
    icon: string,
    bgColor: string,
    borderColor: string,
  ) => {
    const levelQuests = getQuestsByLevel(level);
    const completedCount = levelQuests.filter((q) => game.questsCompleted.includes(q.id)).length;

    return (
      <div key={level} className="mb-8">
        {/* Level Header */}
        <div className={`p-4 ${bgColor} ${borderColor} border-4 rounded-none mb-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{icon}</span>
              <div>
                <h3 className="text-xl font-black pixel-text text-white">{levelTitle}</h3>
                <p className="text-xs text-white/80">Learn through interactive quests</p>
              </div>
            </div>
            <Badge className="bg-white/20 border-white/50 text-white text-xs">
              {completedCount}/{levelQuests.length}
            </Badge>
          </div>
          <Progress value={(completedCount / levelQuests.length) * 100} className="mt-3 h-2 bg-white/20" />
        </div>

        {/* Level Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {levelQuests.map((quest) => {
            const isCompleted = game.questsCompleted.includes(quest.id);
            const isUnlocked = unlockedQuests.some((q) => q.id === quest.id);
            const isCurrent = game.currentQuestId === quest.id;

            return (
              <Card
                key={quest.id}
                className={`border-2 rounded-none transition-all cursor-pointer hover:shadow-lg ${
                  isCompleted
                    ? "border-green-400 bg-green-50 hover:border-green-500"
                    : isUnlocked
                      ? "border-blue-400 bg-blue-50 hover:border-blue-500 hover:bg-blue-100"
                      : "border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed"
                } ${isCurrent ? "ring-4 ring-yellow-400 shadow-lg" : ""}`}
                onClick={() => isUnlocked && onSelectQuest?.(quest.id)}
              >
                <CardHeader className={`pb-3 ${
                  isCompleted ? "bg-green-100 border-b-2 border-green-400" : "bg-blue-100 border-b-2 border-blue-400"
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{quest.icon}</span>
                      <div>
                        <CardTitle className="text-lg font-bold">{quest.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {getTypeIcon(quest.type)} {quest.type.replace(/_/g, " ")}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isCompleted && (
                        <Badge className="bg-green-600 text-white">✓ Done</Badge>
                      )}
                      {!isUnlocked && (
                        <Badge className="bg-gray-400 text-white flex gap-1">
                          <Lock className="h-3 w-3" /> Locked
                        </Badge>
                      )}
                      {isCurrent && !isCompleted && (
                        <Badge className="bg-yellow-500 text-white animate-pulse">⚡ Active</Badge>
                      )}
                      <Badge className={`border-2 ${getDifficultyColor(quest.difficulty)}`}>
                        {quest.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <p className="text-sm text-gray-700 mb-3">{quest.description}</p>
                  <p className="text-xs italic text-gray-600 mb-4 leading-relaxed">
                    "{quest.story}"
                  </p>

                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <p>
                      <span className="font-bold">Objective:</span> {quest.objective}
                    </p>
                    <p>
                      <span className="font-bold">Reward:</span> +{quest.reward.xp} XP
                      {quest.reward.tokens && ` | +${quest.reward.tokens} SHM`}
                      {quest.reward.badges && ` | ${quest.reward.badges.join(", ")}`}
                    </p>
                    {quest.estimatedGas && (
                      <p>
                        <span className="font-bold">Est. Gas:</span> {quest.estimatedGas} SHM
                      </p>
                    )}
                  </div>

                  {quest.steps.length > 0 && (
                    <div className="mb-4 p-2 bg-gray-100 border border-gray-300 rounded-none">
                      <p className="text-xs font-bold mb-2">Steps: {quest.steps.length}</p>
                      <div className="space-y-1">
                        {quest.steps.map((step, idx) => (
                          <p key={step.id} className="text-xs text-gray-700">
                            {idx + 1}. {step.title}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {isUnlocked && !isCompleted && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectQuest?.(quest.id);
                        }}
                        className={`flex-1 ${isCurrent ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white font-bold rounded-none border-2 border-gray-400 flex items-center justify-center gap-2`}
                      >
                        {isCurrent ? "→ Continue" : "▶ Start"}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                    {isCompleted && (
                      <Button
                        disabled
                        className="flex-1 bg-green-600 text-white font-bold rounded-none border-2 border-green-400"
                      >
                        ✓ Quest Completed
                      </Button>
                    )}
                    {!isUnlocked && (
                      <Button
                        disabled
                        className="flex-1 bg-gray-400 text-white font-bold rounded-none border-2 border-gray-400 cursor-not-allowed"
                      >
                        🔒 Locked
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-blue-900">⚔️ Quest Board</h2>
          <Badge className="bg-blue-600 text-white border-2 border-blue-400">
            {game.questsCompleted.length} / {CORE_QUESTS.length} Complete
          </Badge>
        </div>
        <Progress value={game.getProgress()} className="h-3 border-2 border-blue-400 rounded-none" />
      </div>

      <div className="space-y-8">
        {/* Quest Sections by Level */}
        {renderLevelSection("level1", "📦 LEVEL 1: STORAGE LEARNER", "📦", "bg-gradient-to-r from-cyan-900 to-blue-900", "border-cyan-400")}
        {renderLevelSection("level2", "⚡ LEVEL 2: CONTRACT APPRENTICE", "⚡", "bg-gradient-to-r from-purple-900 to-blue-900", "border-purple-400")}
        {renderLevelSection("level3", "👑 LEVEL 3: GOVERNANCE MASTER", "👑", "bg-gradient-to-r from-pink-900 to-red-900", "border-pink-400")}
      </div>
    </div>
  );
};
