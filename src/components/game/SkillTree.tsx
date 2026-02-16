import { useGame } from "@/context/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock } from "lucide-react";

export const SkillTree = () => {
  const game = useGame();

  const categories = [
    { id: "basics", name: "🏠 Basics", color: "bg-blue-100 border-blue-400" },
    { id: "transactions", name: "⛓️ Transactions", color: "bg-green-100 border-green-400" },
    { id: "contracts", name: "📝 Contracts", color: "bg-purple-100 border-purple-400" },
    { id: "nfts", name: "✨ NFTs", color: "bg-pink-100 border-pink-400" },
    { id: "defi", name: "📊 DeFi", color: "bg-orange-100 border-orange-400" },
    { id: "optimization", name: "⚙️ Optimization", color: "bg-yellow-100 border-yellow-400" },
  ];

  const getCategorySkills = (category: string) => {
    return game.skillTree.filter((s) => s.category === category);
  };

  const getXpForLevel = (level: number) => {
    return level * 300;
  };

  return (
    <div className="w-full space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">🌳 Skill Tree</h2>
        <div className="bg-purple-100 border-2 border-purple-400 rounded-none p-4">
          <p className="text-sm font-bold text-purple-900 mb-2">
            Total XP: {game.xp} | Level: {game.level} | Skills Unlocked: {game.skillTree.filter((s) => s.unlocked).length}/{game.skillTree.length}
          </p>
          <Progress
            value={(game.skillTree.filter((s) => s.unlocked).length / game.skillTree.length) * 100}
            className="h-2 border border-purple-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const skills = getCategorySkills(category.id);
          const unlockedCount = skills.filter((s) => s.unlocked).length;

          return (
            <Card
              key={category.id}
              className={`border-2 rounded-none ${category.color}`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-bold">{category.name}</CardTitle>
                  <Badge className="bg-white border border-gray-300">
                    {unlockedCount} / {skills.length}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`p-3 border-2 rounded-none transition-all ${
                        skill.unlocked
                          ? "bg-white border-gray-300"
                          : "bg-gray-100 border-gray-300 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{skill.icon}</span>
                          <div>
                            <p className="font-bold text-sm">{skill.name}</p>
                            <p className="text-xs text-gray-600">Level {skill.level}</p>
                          </div>
                        </div>
                        {!skill.unlocked && <Lock className="h-4 w-4 text-gray-400" />}
                        {skill.unlocked && (
                          <Badge className="bg-green-600 text-white text-xs">✓ Unlocked</Badge>
                        )}
                      </div>

                      <p className="text-xs text-gray-700 mb-2">{skill.description}</p>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">
                          {skill.unlocked
                            ? "✓ Unlocked"
                            : `Requires ${skill.xpRequired} XP`}
                        </span>
                        {!skill.unlocked && (
                          <Progress
                            value={(game.xp / skill.xpRequired) * 100}
                            className="h-1 w-20 border border-gray-300"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-2 border-gray-400 rounded-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">📋 Progression Path</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="font-bold min-w-fit">Level 1:</span>
              <span>Unlock Basic Wallet & Transaction skills (0 XP)</span>
            </div>
            <div className="flex gap-3">
              <span className="font-bold min-w-fit">Level 3:</span>
              <span>Unlock Contract & Gas Optimization (600 XP)</span>
            </div>
            <div className="flex gap-3">
              <span className="font-bold min-w-fit">Level 5:</span>
              <span>Unlock NFT & DeFi basics (1200 XP)</span>
            </div>
            <div className="flex gap-3">
              <span className="font-bold min-w-fit">Level 10:</span>
              <span>Master all skill nodes and become a Web3 expert!</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
