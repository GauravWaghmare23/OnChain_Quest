import { useGame } from "@/context/GameContext";

const ProgressTracker = () => {
  const { getProgress, questsCompleted } = useGame();
  const progress = getProgress();

  const quests = [
    { id: 0, name: "Connect Wallet", icon: "🏠" },
    { id: 1, name: "Sign Message", icon: "📜" },
    { id: 2, name: "Send Transaction", icon: "💰" },
    { id: 3, name: "Smart Contract", icon: "🔮" },
    { id: 4, name: "Mint NFT", icon: "⚔️" },
  ];

  return (
    <div className="quest-panel space-y-3">
      <h3 className="text-[10px] text-accent pixel-text-shadow">📋 QUEST LOG</h3>
      <div className="h-3 bg-xp-bg pixel-border relative overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[8px] text-muted-foreground text-center">
        {questsCompleted.length}/5 QUESTS COMPLETE
      </p>
      <div className="space-y-1">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`flex items-center gap-2 p-2 text-[8px] ${
              questsCompleted.includes(quest.id)
                ? "text-level-complete"
                : "text-muted-foreground"
            }`}
          >
            <span>{questsCompleted.includes(quest.id) ? "✅" : "⬜"}</span>
            <span>{quest.icon}</span>
            <span>{quest.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
