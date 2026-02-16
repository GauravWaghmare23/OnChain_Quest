import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface LeaderboardEntry {
  address: string;
  xp: number;
  level: number;
  achievements: number;
}

interface GameState {
  xp: number;
  level: number;
  currentQuest: number;
  questsCompleted: number[];
  achievements: Achievement[];
  inventory: string[];
  leaderboard: LeaderboardEntry[];
}

interface GameContextType extends GameState {
  addXP: (amount: number) => void;
  completeQuest: (questId: number) => void;
  unlockAchievement: (achievementId: string) => void;
  addToInventory: (item: string) => void;
  setCurrentQuest: (quest: number) => void;
  getProgress: () => number;
}

const defaultAchievements: Achievement[] = [
  { id: "wallet_connect", title: "First Steps", description: "Connected your wallet to BNB Kingdom", icon: "🏠", xpReward: 50, unlocked: false },
  { id: "sign_message", title: "Royal Decree", description: "Signed your first message", icon: "📜", xpReward: 75, unlocked: false },
  { id: "send_tx", title: "Gold Sender", description: "Sent your first transaction", icon: "💰", xpReward: 100, unlocked: false },
  { id: "store_number", title: "Enchanter", description: "Stored a number in the blockchain", icon: "🔮", xpReward: 125, unlocked: false },
  { id: "retrieve_number", title: "Oracle", description: "Retrieved data from the blockchain", icon: "👁️", xpReward: 100, unlocked: false },
  { id: "mint_nft", title: "Legendary Crafter", description: "Minted your achievement NFT", icon: "⚔️", xpReward: 200, unlocked: false },
  { id: "all_quests", title: "Kingdom Champion", description: "Completed all quests", icon: "👑", xpReward: 500, unlocked: false },
];

const TOTAL_QUESTS = 5;

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>({
    xp: 0,
    level: 1,
    currentQuest: 0,
    questsCompleted: [],
    achievements: defaultAchievements,
    inventory: [],
    leaderboard: [
      { address: "0x1234...abcd", xp: 1200, level: 8, achievements: 7 },
      { address: "0x5678...efgh", xp: 950, level: 6, achievements: 5 },
      { address: "0x9abc...ijkl", xp: 700, level: 5, achievements: 4 },
      { address: "0xdef0...mnop", xp: 400, level: 3, achievements: 3 },
      { address: "0x1111...qrst", xp: 200, level: 2, achievements: 2 },
    ],
  });

  const addXP = useCallback((amount: number) => {
    setState((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 150) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, []);

  const completeQuest = useCallback((questId: number) => {
    setState((prev) => {
      if (prev.questsCompleted.includes(questId)) return prev;
      return {
        ...prev,
        questsCompleted: [...prev.questsCompleted, questId],
        currentQuest: Math.max(prev.currentQuest, questId + 1),
      };
    });
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setState((prev) => {
      const achievements = prev.achievements.map((a) =>
        a.id === achievementId && !a.unlocked
          ? { ...a, unlocked: true, unlockedAt: Date.now() }
          : a
      );
      const justUnlocked = achievements.find((a) => a.id === achievementId && a.unlocked);
      const xpBonus = justUnlocked && !prev.achievements.find((a) => a.id === achievementId)?.unlocked
        ? justUnlocked.xpReward
        : 0;
      return { ...prev, achievements, xp: prev.xp + xpBonus, level: Math.floor((prev.xp + xpBonus) / 150) + 1 };
    });
  }, []);

  const addToInventory = useCallback((item: string) => {
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.includes(item) ? prev.inventory : [...prev.inventory, item],
    }));
  }, []);

  const setCurrentQuest = useCallback((quest: number) => {
    setState((prev) => ({ ...prev, currentQuest: quest }));
  }, []);

  const getProgress = useCallback(() => {
    return (state.questsCompleted.length / TOTAL_QUESTS) * 100;
  }, [state.questsCompleted]);

  return (
    <GameContext.Provider
      value={{ ...state, addXP, completeQuest, unlockAchievement, addToInventory, setCurrentQuest, getProgress }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
};
