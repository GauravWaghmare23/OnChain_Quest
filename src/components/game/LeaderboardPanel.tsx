import { useGame } from "@/context/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Leaderboard = () => {
  const { leaderboard } = useGame();

  return (
    <Card className="border-2 border-red-400 rounded-none bg-red-50">
      <CardHeader className="pb-3 bg-red-100 border-b-2 border-red-400">
        <CardTitle className="text-lg">🏅 Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {leaderboard.map((entry, index) => {
            const medalEmoji =
              index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;

            return (
              <div
                key={entry.address}
                className="flex items-center gap-3 p-3 border-2 border-red-300 rounded-none bg-white"
              >
                <span className="text-2xl font-bold text-red-600 w-8 text-center">
                  {medalEmoji}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">{entry.address}</p>
                  <p className="text-xs text-gray-600">
                    Level {entry.level} • {entry.achievements} Achievements • {entry.nftsOwned} NFTs
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{entry.xp} XP</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-yellow-100 border-2 border-yellow-400 rounded-none">
          <p className="text-xs text-yellow-900 font-bold text-center">
            💡 Tip: Complete quests, earn XP, and climb the leaderboard!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
