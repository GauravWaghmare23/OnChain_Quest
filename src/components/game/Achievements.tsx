import { useGame } from "@/context/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Achievements = () => {
  const { achievements } = useGame();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalXpFromAchievements = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="w-full space-y-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-yellow-900">🏆 Achievements</h2>
          <Badge className="bg-yellow-600 text-white border-2 border-yellow-400">
            {unlockedCount} / {achievements.length}
          </Badge>
        </div>
        <Progress value={(unlockedCount / achievements.length) * 100} className="h-3 border-2 border-yellow-400 rounded-none" />
        <p className="text-xs text-gray-600 mt-2">Total XP from achievements: +{totalXpFromAchievements}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`border-2 rounded-none transition-all ${
              achievement.unlocked
                ? "border-yellow-400 bg-yellow-50 shadow-md"
                : "border-gray-300 bg-gray-50 opacity-70"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="text-4xl">{achievement.icon}</div>
                {achievement.unlocked && (
                  <Badge className="bg-green-600 text-white text-xs">✓ Unlocked</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-base mb-1">{achievement.title}</CardTitle>
              <CardDescription className="text-xs text-gray-700 mb-3">
                {achievement.description}
              </CardDescription>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-yellow-700">+{achievement.xpReward} XP</span>
                {achievement.unlocked && achievement.unlockedAt && (
                  <span className="text-gray-600">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
