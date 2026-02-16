import { useGame } from "@/context/GameContext";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const XPBar = () => {
  const { xp, level } = useGame();
  const xpInLevel = xp % 150;
  const xpNeeded = 150;
  const percentage = (xpInLevel / xpNeeded) * 100;
  const nextLevelXp = (level + 1) * 150;

  return (
    <Card className="border-2 border-blue-400 rounded-none bg-blue-50">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white border-2 border-blue-400">
                ⭐ Level {level}
              </Badge>
              <span className="text-sm font-bold text-blue-900">{xp} XP</span>
            </div>
            <span className="text-xs text-gray-600">Next: {nextLevelXp}</span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-700 mb-1">
              <span>Progress to Level {level + 1}</span>
              <span className="font-bold">{Math.round(percentage)}%</span>
            </div>
            <Progress
              value={percentage}
              className="h-4 border-2 border-blue-400 rounded-none"
            />
            <p className="text-xs text-gray-600 mt-1 text-center">
              {xpInLevel} / {xpNeeded} XP
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
