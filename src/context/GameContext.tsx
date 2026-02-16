import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

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
  nftsOwned: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  xpRequired: number;
  unlocked: boolean;
  category: "basics" | "transactions" | "contracts" | "nfts" | "defi" | "optimization";
}

interface GameState {
  xp: number;
  level: number;
  currentQuestId: string | null;
  questsCompleted: string[];
  achievements: Achievement[];
  inventory: InventoryItem[];
  leaderboard: LeaderboardEntry[];
  skillTree: SkillNode[];
  totalGasSpent: bigint;
  totalGasSaved: bigint;
  heroNFTId?: string;
  playtime: number; // in seconds
}

interface GameContextType extends GameState {
  addXP: (amount: number) => void;
  completeQuest: (questId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  addToInventory: (itemId: string, name: string, icon: string, count?: number) => void;
  removeFromInventory: (itemId: string, count?: number) => void;
  setCurrentQuest: (questId: string | null) => void;
  unlockSkill: (skillId: string) => void;
  addGasSpent: (amount: bigint) => void;
  addGasSaved: (amount: bigint) => void;
  setHeroNFTId: (nftId: string) => void;
  getProgress: () => number;
  getTotalStats: () => { quests: number; achievements: number; skills: number };
}

const defaultAchievements: Achievement[] = [
  { id: "wallet_connect", title: "🔑 First Steps", description: "Connected your wallet", icon: "🔑", xpReward: 50, unlocked: false },
  { id: "sign_message", title: "📜 Message Master", description: "Signed your first message", icon: "📜", xpReward: 75, unlocked: false },
  { id: "send_tx", title: "💎 Transactor", description: "Sent your first transaction", icon: "💎", xpReward: 100, unlocked: false },
  { id: "store_number", title: "🔮 Data Mage", description: "Stored data on-chain", icon: "🔮", xpReward: 125, unlocked: false },
  { id: "retrieve_number", title: "👁️ Oracle", description: "Retrieved data from blockchain", icon: "👁️", xpReward: 100, unlocked: false },
  { id: "mint_nft", title: "✨ Crafter", description: "Minted your first NFT", icon: "✨", xpReward: 200, unlocked: false },
  { id: "gas_optimizer", title: "⚙️ Gas Guru", description: "Saved 50% on gas costs", icon: "⚙️", xpReward: 150, unlocked: false },
  { id: "all_quests", title: "👑 Champion", description: "Completed all quests", icon: "👑", xpReward: 500, unlocked: false },
];

const getDefaultSkillTree = (): SkillNode[] => [
  { id: "skill_wallet_101", name: "Wallet Basics", description: "Understanding private keys", icon: "🔑", level: 1, xpRequired: 0, unlocked: true, category: "basics" },
  { id: "skill_transactions", name: "Transactions 101", description: "How transactions work", icon: "⛓️", level: 1, xpRequired: 200, unlocked: false, category: "transactions" },
  { id: "skill_gas", name: "Gas Mastery", description: "Understanding and optimizing gas", icon: "⚙️", level: 2, xpRequired: 400, unlocked: false, category: "optimization" },
  { id: "skill_contracts", name: "Smart Contracts", description: "Interacting with contracts", icon: "📝", level: 2, xpRequired: 600, unlocked: false, category: "contracts" },
  { id: "skill_nfts", name: "NFT Fundamentals", description: "Minting and trading NFTs", icon: "✨", level: 2, xpRequired: 500, unlocked: false, category: "nfts" },
  { id: "skill_defi_intro", name: "DeFi Basics", description: "Introduction to DeFi", icon: "📊", level: 3, xpRequired: 1000, unlocked: false, category: "defi" },
];

const TOTAL_QUESTS = 5;

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>({
    xp: 0,
    level: 1,
    currentQuestId: null,
    questsCompleted: [],
    achievements: defaultAchievements,
    inventory: [
      { id: "shm_tokens", name: "SHM Tokens", icon: "💰", count: 1, description: "Test tokens for learning" },
    ],
    leaderboard: [
      { address: "0x1234...abcd", xp: 1200, level: 8, achievements: 7, nftsOwned: 3 },
      { address: "0x5678...efgh", xp: 950, level: 6, achievements: 5, nftsOwned: 2 },
      { address: "0x9abc...ijkl", xp: 700, level: 5, achievements: 4, nftsOwned: 1 },
      { address: "0xdef0...mnop", xp: 400, level: 3, achievements: 3, nftsOwned: 1 },
      { address: "0x1111...qrst", xp: 200, level: 2, achievements: 2, nftsOwned: 0 },
    ],
    skillTree: getDefaultSkillTree(),
    totalGasSpent: BigInt(0),
    totalGasSaved: BigInt(0),
    playtime: 0,
  });

  // Track playtime
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => ({ ...prev, playtime: prev.playtime + 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addXP = useCallback((amount: number) => {
    setState((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 150) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, []);

  const completeQuest = useCallback((questId: string) => {
    setState((prev) => {
      if (prev.questsCompleted.includes(questId)) return prev;
      return {
        ...prev,
        questsCompleted: [...prev.questsCompleted, questId],
        currentQuestId: null,
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
      const xpBonus = justUnlocked
        ? justUnlocked.xpReward
        : 0;
      return {
        ...prev,
        achievements,
        xp: prev.xp + xpBonus,
        level: Math.floor((prev.xp + xpBonus) / 150) + 1,
      };
    });
  }, []);

  const addToInventory = useCallback((itemId: string, name: string, icon: string, count: number = 1) => {
    setState((prev) => {
      const existing = prev.inventory.find((i) => i.id === itemId);
      if (existing) {
        return {
          ...prev,
          inventory: prev.inventory.map((i) =>
            i.id === itemId ? { ...i, count: i.count + count } : i
          ),
        };
      }
      return {
        ...prev,
        inventory: [...prev.inventory, {
          id: itemId,
          name,
          icon,
          count,
          description: `Earned from quests`,
        }],
      };
    });
  }, []);

  const removeFromInventory = useCallback((itemId: string, count: number = 1) => {
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory
        .map((i) => (i.id === itemId ? { ...i, count: Math.max(0, i.count - count) } : i))
        .filter((i) => i.count > 0),
    }));
  }, []);

  const setCurrentQuest = useCallback((questId: string | null) => {
    setState((prev) => ({ ...prev, currentQuestId: questId }));
  }, []);

  const unlockSkill = useCallback((skillId: string) => {
    setState((prev) => ({
      ...prev,
      skillTree: prev.skillTree.map((s) =>
        s.id === skillId ? { ...s, unlocked: true } : s
      ),
    }));
  }, []);

  const addGasSpent = useCallback((amount: bigint) => {
    setState((prev) => ({
      ...prev,
      totalGasSpent: prev.totalGasSpent + amount,
    }));
  }, []);

  const addGasSaved = useCallback((amount: bigint) => {
    setState((prev) => ({
      ...prev,
      totalGasSaved: prev.totalGasSaved + amount,
    }));
  }, []);

  const setHeroNFTId = useCallback((nftId: string) => {
    setState((prev) => ({
      ...prev,
      heroNFTId: nftId,
    }));
  }, []);

  const getProgress = useCallback(() => {
    return (state.questsCompleted.length / TOTAL_QUESTS) * 100;
  }, [state.questsCompleted]);

  const getTotalStats = useCallback(() => {
    return {
      quests: state.questsCompleted.length,
      achievements: state.achievements.filter((a) => a.unlocked).length,
      skills: state.skillTree.filter((s) => s.unlocked).length,
    };
  }, [state.questsCompleted, state.achievements, state.skillTree]);

  return (
    <GameContext.Provider
      value={{
        ...state,
        addXP,
        completeQuest,
        unlockAchievement,
        addToInventory,
        removeFromInventory,
        setCurrentQuest,
        unlockSkill,
        addGasSpent,
        addGasSaved,
        setHeroNFTId,
        getProgress,
        getTotalStats,
      }}
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
