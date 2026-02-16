import { useGame } from "@/context/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CORE_QUESTS } from "@/lib/questSystem";

export const ProgressTracker = () => {
  const { getProgress, questsCompleted, getTotalStats } = useGame();
  const progress = getProgress();
  const stats = getTotalStats();

  return (
    <Card className="border-2 border-purple-400 rounded-none bg-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">📋 Overall Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm font-bold text-purple-900 mb-2">
            <span>Quest Progress</span>
            <span>{questsCompleted.length} / {CORE_QUESTS.length}</span>
          </div>
          <Progress value={progress} className="h-3 border-2 border-purple-400 rounded-none" />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-white border-2 border-purple-300 rounded-none">
            <p className="text-2xl font-bold text-purple-900">{stats.quests}</p>
            <p className="text-xs text-gray-600">Quests</p>
          </div>
          <div className="p-3 bg-white border-2 border-purple-300 rounded-none">
            <p className="text-2xl font-bold text-yellow-600">{stats.achievements}</p>
            <p className="text-xs text-gray-600">Achievements</p>
          </div>
          <div className="p-3 bg-white border-2 border-purple-300 rounded-none">
            <p className="text-2xl font-bold text-blue-600">{stats.skills}</p>
            <p className="text-xs text-gray-600">Skills</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-purple-900">Quest Completion:</p>
          {CORE_QUESTS.map((quest) => {
            const isCompleted = questsCompleted.includes(quest.id);
            return (
              <div
                key={quest.id}
                className={`flex items-center gap-2 p-2 border-2 rounded-none ${
                  isCompleted
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <span className="text-lg">{isCompleted ? "✅" : "⬜"}</span>
                <span className="text-lg">{quest.icon}</span>
                <span className="text-xs flex-1 font-bold">{quest.title}</span>
                {isCompleted && (
                  <span className="text-xs text-green-600 font-bold">Done!</span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
