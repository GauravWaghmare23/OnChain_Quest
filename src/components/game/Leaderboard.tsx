import { useGame } from "@/context/GameContext";

const Leaderboard = () => {
  const { leaderboard } = useGame();

  return (
    <div className="quest-panel space-y-3">
      <h3 className="text-[10px] text-accent pixel-text-shadow">🏅 LEADERBOARD</h3>
      <div className="space-y-1">
        {leaderboard.map((entry, i) => (
          <div
            key={entry.address}
            className={`flex items-center gap-2 p-2 text-[8px] pixel-border ${
              i === 0 ? "border-gold bg-muted" : "bg-background"
            }`}
          >
            <span className={`text-sm ${i === 0 ? "text-gold" : i === 1 ? "text-foreground" : "text-muted-foreground"}`}>
              #{i + 1}
            </span>
            <span className="flex-1 text-foreground truncate">{entry.address}</span>
            <span className="text-gold">{entry.xp}XP</span>
            <span className="text-muted-foreground">LV{entry.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
