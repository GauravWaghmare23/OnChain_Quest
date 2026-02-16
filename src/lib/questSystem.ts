/**
 * Quest System - Core learning module definitions
 * Each quest teaches a Web3 concept through interactive blockchain actions
 */

export enum QuestDifficulty {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export enum QuestType {
  WALLET_SETUP = "wallet_setup",
  TRANSACTION = "transaction",
  SMART_CONTRACT = "smart_contract",
  NFT_MINTING = "nft_minting",
  GAS_OPTIMIZATION = "gas_optimization",
  DEFI_SIMULATION = "defi_simulation",
  SECURITY = "security",
}

export interface QuestReward {
  xp: number;
  tokens?: number;
  badges?: string[];
  nft?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  story: string; // Minecraft-themed story
  difficulty: QuestDifficulty;
  type: QuestType;
  icon: string;
  reward: QuestReward;
  objective: string;
  steps: QuestStep[];
  isCompleted: boolean;
  isLocked: boolean;
  prerequisites?: string[]; // Quest IDs that must be completed first
  estimatedGas?: string;
  gasOptimizationTips?: string[];
  level?: "level1" | "level2" | "level3"; // Quest belongs to this level
}

export interface QuestStep {
  id: string;
  title: string;
  instruction: string;
  action: "read" | "sign" | "transaction" | "quiz";
  hint: string;
  explanation: string; // Learn why this step matters
}

export interface UserProgress {
  completedQuests: string[];
  currentQuest?: string;
  xp: number;
  level: number;
  badges: string[];
  nftsOwned: string[];
  skillPoints: number;
  gasSpent: bigint;
  gasSaved: bigint;
}

// Core Learning Quests
export const CORE_QUESTS: Quest[] = [
  {
    id: "quest_wallet_basics",
    title: "🔑 Wallet Wizard",
    description: "Learn the basics of blockchain wallets",
    story:
      "Welcome to Onchain Quest! Your journey begins by understanding your digital vault - your wallet. Only you hold the key.",
    difficulty: QuestDifficulty.BEGINNER,
    type: QuestType.WALLET_SETUP,
    icon: "🔑",
    reward: { xp: 100, tokens: 0.1 },
    objective: "Connect your wallet and understand private keys",
    level: "level1",
    steps: [
      {
        id: "step_1",
        title: "Connect MetaMask",
        instruction: "Click the wallet connect button and authorize MetaMask",
        action: "read",
        hint: "Your digital identity starts with connecting a wallet",
        explanation:
          "A wallet is your identity on the blockchain. It contains your private key (secret) and public key (address). Never share your private key!",
      },
      {
        id: "step_2",
        title: "Understand Your Address",
        instruction: "View and copy your wallet address",
        action: "read",
        hint: "Your address is like your email for blockchain",
        explanation:
          "Your public address (starting with 0x) is what you share with others to receive funds. It's safe to share!",
      },
      {
        id: "step_3",
        title: "Quiz: Wallet Security",
        instruction: "Answer: Should you ever share your private key?",
        action: "quiz",
        hint: "Think about the difference between public and private",
        explanation: "Never share your private key! It's like sharing your password to your bank account.",
      },
    ],
    isCompleted: false,
    isLocked: false,
  },
  {
    id: "quest_transaction_basics",
    title: "⛓️ Transaction Tracker",
    description: "Execute your first blockchain transaction",
    story:
      "Now that you have a wallet, it's time to send your first transaction. Watch it get recorded forever on the blockchain!",
    difficulty: QuestDifficulty.BEGINNER,
    type: QuestType.TRANSACTION,
    icon: "⛓️",
    reward: { xp: 150, tokens: 0.05 },
    objective: "Send a test transaction on Shardeum testnet",
    level: "level1",
    steps: [
      {
        id: "step_1",
        title: "Get Testnet SHM",
        instruction: "Visit the Shardeum faucet and claim test tokens",
        action: "read",
        hint: "Testnet tokens are FREE and only for learning",
        explanation:
          "Testnet tokens are play money. They have no real value but let you practice blockchain development safely.",
      },
      {
        id: "step_2",
        title: "Send Transaction",
        instruction: "Send 0.001 SHM to the contract treasury",
        action: "transaction",
        hint: "After 20 seconds, your transaction will be confirmed",
        explanation:
          "Transactions are the way to change blockchain state. Each transaction has a hash (ID) you can look up forever.",
      },
      {
        id: "step_3",
        title: "Find Your TX Hash",
        instruction: "Copy your transaction hash and view it on the explorer",
        action: "read",
        hint: "The hash is your proof that the transaction happened",
        explanation:
          "Block explorers are public records of all blockchain activity. Your transaction is there forever!",
      },
    ],
    isCompleted: false,
    isLocked: true,
    prerequisites: ["quest_wallet_basics"],
    estimatedGas: "0.000021",
  },
  {
    id: "quest_smart_contract_intro",
    title: "📝 Smart Contract Sage",
    description: "Interact with your first smart contract",
    story: "Contracts are programs that live on the blockchain. They run exactly as written, no matter what!",
    difficulty: QuestDifficulty.BEGINNER,
    type: QuestType.SMART_CONTRACT,
    icon: "📝",
    reward: { xp: 200, tokens: 0.1 },
    objective: "Store a number in a smart contract",
    level: "level1",
    steps: [
      {
        id: "step_1",
        title: "Learn Contract Basics",
        instruction: "Read about smart contracts and immutability",
        action: "read",
        hint: "Contracts are trustless - no middleman needed",
        explanation:
          "Smart contracts are code that runs on the blockchain. Once deployed, they can't be changed. This creates trust!",
      },
      {
        id: "step_2",
        title: "Store Your Number",
        instruction: "Call storeNumber(42) on the contract",
        action: "transaction",
        hint: "Pick a lucky number between 0-1000",
        explanation:
          "When you call a function that changes state, it costs gas. This payment prevents spam on the network.",
      },
      {
        id: "step_3",
        title: "Retrieve Your Number",
        instruction: "Call getNumber() and see your data",
        action: "read",
        hint: "Reading data is free! Only writes cost gas.",
        explanation:
          "Blockchain is transparent. Anyone can read public data, but only you can write as the transaction sender.",
      },
    ],
    isCompleted: false,
    isLocked: true,
    prerequisites: ["quest_transaction_basics"],
    estimatedGas: "0.000156",
    gasOptimizationTips: [
      "Batch multiple writes together",
      "Use uint256 instead of smaller types if repeatedly accessed",
      "Minimize storage writes",
    ],
  },
  {
    id: "quest_nft_explorer",
    title: "✨ NFT Navigator",
    description: "Mint your first NFT and learn about ownership",
    story: "NFTs are digital items that prove ownership. Mint your first hero and collect achievements!",
    difficulty: QuestDifficulty.INTERMEDIATE,
    type: QuestType.NFT_MINTING,
    icon: "✨",
    reward: { xp: 250, badges: ["nft_pioneer"], nft: "hero_v1" },
    objective: "Mint an NFT representing your learning hero",
    level: "level2",
    steps: [
      {
        id: "step_1",
        title: "Understand NFTs",
        instruction: "Learn why NFTs matter beyond images",
        action: "read",
        hint: "NFTs are just URLs stored on the blockchain!",
        explanation:
          "NFTs are non-fungible tokens - each one is unique. The metadata is stored off-chain (like IPFS), the proof is on-chain.",
      },
      {
        id: "step_2",
        title: "Mint Your Hero",
        instruction: "Call mintHero() to create your learning companion",
        action: "transaction",
        hint: "Your hero will get stronger as you complete quests",
        explanation:
          "Minting creates a new token with a unique ID. You now own this on the blockchain forever!",
      },
      {
        id: "step_3",
        title: "Track Your Hero",
        instruction: "View your NFT on the creator dashboard",
        action: "read",
        hint: "Your hero's metadata updates with each quest",
        explanation:
          "Dynamic NFTs change their metadata as you progress. This proves your learning journey on-chain!",
      },
    ],
    isCompleted: false,
    isLocked: true,
    prerequisites: ["quest_smart_contract_intro"],
    estimatedGas: "0.000432",
  },
  {
    id: "quest_gas_strategies",
    title: "⚙️ Gas Guru Challenge",
    description: "Optimize your blockchain spending",
    story:
      "Gas is the cost of blockchain operations. Smart builders optimize costs. You have 0.01 SHM. Can you complete all 5 missions?",
    difficulty: QuestDifficulty.INTERMEDIATE,
    type: QuestType.GAS_OPTIMIZATION,
    icon: "⚙️",
    reward: { xp: 300, badges: ["gas_optimizer"], tokens: 0.005 },
    objective: "Complete 5 missions while minimizing gas spent",
    level: "level3",
    steps: [
      {
        id: "step_1",
        title: "Mission: Store Data (0.2 SHM)",
        instruction: "Store a number using 100 gas worth",
        action: "transaction",
        hint: "Writing to storage always costs gas",
        explanation:
          "Storing data permanently is expensive because validators must maintain it forever. Writing costs ~20k gas.",
      },
      {
        id: "step_2",
        title: "Mission: Read Data (FREE!)",
        instruction: "Call getNumber() and save gas",
        action: "read",
        hint: "Reading is always free",
        explanation: "Calling view/read functions costs 0 gas because they don't change state.",
      },
      {
        id: "step_3",
        title: "Mission: Batch Operations",
        instruction: "Bundle multiple writes efficiently",
        action: "transaction",
        hint: "Batching reduces overhead",
        explanation:
          "Sending operations together is cheaper than individual transactions. This is why rollups work!",
      },
    ],
    isCompleted: false,
    isLocked: true,
    prerequisites: ["quest_smart_contract_intro"],
    estimatedGas: "0.0015",
  },
];

// Helper functions
export function getUnlockedQuests(progress: UserProgress): Quest[] {
  return CORE_QUESTS.filter((quest) => {
    if (!quest.isLocked) return true;
    return quest.prerequisites?.every((preq) => progress.completedQuests.includes(preq)) ?? false;
  });
}

export function getQuestsByLevel(level: "level1" | "level2" | "level3"): Quest[] {
  return CORE_QUESTS.filter((quest) => quest.level === level);
}

export function getLevelQuests(level: "level1" | "level2" | "level3", progress: { completedQuests: string[] }): Quest[] {
  return getQuestsByLevel(level).filter((quest) => {
    if (!quest.isLocked) return true;
    return quest.prerequisites?.every((preq) => progress.completedQuests.includes(preq)) ?? false;
  });
}

export function getQuestProgressPercentage(quest: Quest): number {
  return quest.isCompleted ? 100 : 0;
}
