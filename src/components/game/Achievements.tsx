import { useGame } from "@/context/GameContext";

const Achievements = () => {
  const { achievements } = useGame();

  return (
    <div className="quest-panel space-y-3">
      <h3 className="text-[10px] text-accent pixel-text-shadow">🏆 ACHIEVEMENTS</h3>
      <div className="space-y-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`flex items-center gap-2 p-2 pixel-border text-[8px] transition-all ${
              achievement.unlocked
                ? "bg-muted border-level-complete"
                : "bg-background opacity-50"
            }`}
          >
            <span className={`text-xl ${achievement.unlocked ? "animate-pixel-bounce" : "grayscale"}`}>
              {achievement.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className={achievement.unlocked ? "text-level-complete" : "text-muted-foreground"}>
                {achievement.title}
              </p>
              <p className="text-[6px] text-muted-foreground">{achievement.description}</p>
            </div>
            <span className="text-[8px] text-gold">+{achievement.xpReward}XP</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
