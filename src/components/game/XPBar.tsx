import { useGame } from "@/context/GameContext";

const XPBar = () => {
  const { xp, level } = useGame();
  const xpInLevel = xp % 150;
  const xpNeeded = 150;
  const percentage = (xpInLevel / xpNeeded) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[8px] text-accent">LVL {level}</span>
        <span className="text-[8px] text-muted-foreground">{xp} XP</span>
      </div>
      <div className="h-4 bg-xp-bg pixel-border relative overflow-hidden">
        <div
          className="h-full bg-xp transition-all duration-700 animate-xp-fill"
          style={{ width: `${percentage}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[6px] text-foreground">
          {xpInLevel}/{xpNeeded}
        </span>
      </div>
    </div>
  );
};

export default XPBar;
