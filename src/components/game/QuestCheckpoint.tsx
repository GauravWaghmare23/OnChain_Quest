import { useState } from "react";
import { ChevronDown, Lock, CheckCircle, Clock } from "lucide-react";
import { Quest, getLevelQuests } from "@/lib/questSystem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface QuestCheckpointProps {
  level: "level1" | "level2" | "level3";
  completedQuests: string[];
  onSelectQuest?: (questId: string) => void;
  className?: string;
}

export const QuestCheckpoint = ({
  level,
  completedQuests,
  onSelectQuest,
  className = "",
}: QuestCheckpointProps) => {
  const [expanded, setExpanded] = useState(true);
  
  const levelQuests = getLevelQuests(level, { completedQuests });
  const completedCount = levelQuests.filter((q) => q.isCompleted).length;
  const totalCount = levelQuests.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getLevelTitle = () => {
    switch (level) {
      case "level1":
        return "📦 Level 1: Storage Learner";
      case "level2":
        return "⚡ Level 2: Contract Apprentice";
      case "level3":
        return "👑 Level 3: Governance Master";
      default:
        return "Quests";
    }
  };

  const getLevelColor = () => {
    switch (level) {
      case "level1":
        return "from-cyan-900 to-blue-900";
      case "level2":
        return "from-purple-900 to-blue-900";
      case "level3":
        return "from-pink-900 to-red-900";
      default:
        return "from-gray-900 to-black";
    }
  };

  const getQuestStatus = (quest: Quest): "locked" | "completed" | "active" | "available" => {
    if (quest.isLocked) return "locked";
    if (quest.isCompleted) return "completed";
    if (processedQuests.some((q) => q.id === quest.id && q.isCompleted))
      return "completed";
    return "available";
  };

  const processedQuests = levelQuests.map((q) => ({
    ...q,
    isCompleted: completedQuests.includes(q.id),
  }));

  if (totalCount === 0) return null;

  return (
    <Card
      className={`border-0 bg-gradient-to-br ${getLevelColor()} text-white overflow-hidden ${className}`}
    >
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getLevelTitle()}
            <Badge
              variant="secondary"
              className="ml-auto text-xs bg-white/20"
            >
              {completedCount}/{totalCount}
            </Badge>
          </CardTitle>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
        <Progress value={progressPercent} className="mt-2 h-2 bg-white/20" />
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-2">
          {processedQuests.map((quest) => {
            const status = getQuestStatus(quest);
            const isLocked = status === "locked";

            return (
              <div
                key={quest.id}
                className={`p-3 rounded-lg border transition-all ${
                  status === "completed"
                    ? "bg-green-500/20 border-green-400/50"
                    : status === "locked"
                      ? "bg-black/30 border-gray-600/50 opacity-60"
                      : "bg-white/10 border-white/20 hover:bg-white/15"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-1">
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : status === "completed" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{quest.icon} {quest.title}</div>
                    <div className="text-xs text-gray-200 mt-1">{quest.description}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs bg-white/10">
                        +{quest.reward.xp} XP
                      </Badge>
                      {quest.reward.tokens && (
                        <Badge variant="outline" className="text-xs bg-white/10">
                          +{quest.reward.tokens} SHM
                        </Badge>
                      )}
                    </div>
                  </div>
                  {onSelectQuest && !isLocked && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSelectQuest(quest.id)}
                      className="text-xs bg-white/20 border-white/30 hover:bg-white/30"
                    >
                      View
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
};
