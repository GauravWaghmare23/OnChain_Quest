import { useGame } from "@/context/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface Tip {
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "optimization";
  icon: string;
}

export const AIAdvisor = () => {
  const game = useGame();
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);
  const [tipsHistory, setTipsHistory] = useState<Tip[]>([]);

  useEffect(() => {
    const generateTip = () => {
      const tips: Tip[] = [];

      // Level up tip
      if (game.xp % 150 === 0 && game.xp > 0) {
        tips.push({
          title: "🎊 Level Up!",
          message: `You've reached Level ${game.level}! New skills are becoming available.`,
          type: "success",
          icon: "⭐",
        });
      }

      // Quest completion tip
      if (game.questsCompleted.length === 1) {
        tips.push({
          title: "🎓 You're a Learner!",
          message:
            "Great start! Complete more quests to unlock advanced topics and earn achievements.",
          type: "info",
          icon: "📚",
        });
      }

      // Gas optimization tip
      if (game.totalGasSpent > BigInt(1000000)) {
        const savePercentage = (
          ((Number(game.totalGasSaved - game.totalGasSpent)) / Number(game.totalGasSpent)) *
          100
        ).toFixed(1);
        tips.push({
          title: "⚙️ Gas Optimization",
          message: `Consider batching transactions to save gas. You could save ~${Math.abs(parseFloat(savePercentage))}% by bundling operations!`,
          type: "optimization",
          icon: "💰",
        });
      }

      // Skill suggestion
      const unlockedSkills = game.skillTree.filter((s) => s.unlocked).length;
      if (unlockedSkills < game.skillTree.length / 2) {
        tips.push({
          title: "🌳 Unlock More Skills",
          message: `You have room to learn! Check your Skill Tree to see what's available at your current level.`,
          type: "info",
          icon: "📈",
        });
      }

      // Layer 2 tip
      if (game.questsCompleted.length >= 2) {
        tips.push({
          title: "🚀 Scaling Solutions",
          message:
            "Did you know? Layer 2 solutions like rollups can reduce gas fees by 90%! Learn more in advanced quests.",
          type: "info",
          icon: "🌐",
        });
      }

      // Difficulty progression tip
      if (game.level >= 5) {
        tips.push({
          title: "📊 Ready for Advanced Topics?",
          message:
            "You're making progress! Consider exploring advanced quests about DeFi simulations and risk management.",
          type: "success",
          icon: "🎯",
        });
      }

      // No inventory items
      if (game.inventory.length === 1) {
        // Only default token
        tips.push({
          title: "🎁 Earn Rewards",
          message: "Complete quests to earn special items, NFTs, and badges!",
          type: "info",
          icon: "🏆",
        });
      }

      // Achievement tip
      const unlockedAchievements = game.achievements.filter((a) => a.unlocked).length;
      if (unlockedAchievements > 0 && unlockedAchievements % 2 === 0) {
        tips.push({
          title: "🏅 Achievement Unlocked!",
          message: `You've earned ${unlockedAchievements} achievements! Keep up the awesome work.`,
          type: "success",
          icon: "🎉",
        });
      }

      if (tips.length > 0) {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        setCurrentTip(randomTip);
        setTipsHistory((prev) => [randomTip, ...prev.slice(0, 4)]);
      }
    };

    // Generate tip every 10 seconds or when game state changes significantly
    generateTip();
    const interval = setInterval(generateTip, 30000);

    return () => clearInterval(interval);
  }, [game.xp, game.level, game.questsCompleted, game.totalGasSpent, game.totalGasSaved, game.achievements, game.skillTree, game.inventory]);

  const getTipColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-400 bg-green-50";
      case "warning":
        return "border-yellow-400 bg-yellow-50";
      case "optimization":
        return "border-blue-400 bg-blue-50";
      case "info":
      default:
        return "border-purple-400 bg-purple-50";
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card className={`border-2 rounded-none ${currentTip ? getTipColor(currentTip.type) : "border-purple-400 bg-purple-50"}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentTip?.icon || "🤖"}</span>
            <div>
              <CardTitle className="text-base">
                {currentTip?.title || "🤖 Onchain Advisor"}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentTip ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-800">{currentTip.message}</p>
              <Badge className="bg-white border border-gray-300">
                Tip {tipsHistory.indexOf(currentTip) + 1}
              </Badge>
            </div>
          ) : (
            <p className="text-sm text-gray-800">
              Keep learning! I'll provide personalized tips as you progress through
              quests and unlock achievements.
            </p>
          )}
        </CardContent>
      </Card>

      {tipsHistory.length > 1 && (
        <Card className="border-2 border-gray-300 rounded-none bg-gray-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">💡 Recent Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tipsHistory.slice(1, 4).map((tip, idx) => (
                <div
                  key={idx}
                  className="p-2 text-xs border-l-2 border-gray-400 pl-3 bg-white rounded-none"
                >
                  <p className="font-bold text-gray-900">{tip.title}</p>
                  <p className="text-gray-700">{tip.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
