# 🎮 Onchain Quest: Web3 Learning Platform

> **The Duolingo + Minecraft for Web3** - Learn blockchain development through interactive gamified quests on Shardeum testnet.

## 📖 Overview

Onchain Quest is a revolutionary Web3 education platform that teaches blockchain fundamentals through real on-chain interactions and strategic gameplay mechanics. Players:

- 🎯 Complete blockchain-focused quests earning XP and achievements
- ⛓️ Interact with deployed smart contracts on Shardeum
- ✨ Mint NFTs and learn about digital ownership
- 💰 Understand gas optimization and transaction costs
- 🎓 Master Web3 concepts through gamified learning

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **Blockchain**: wagmi + viem
- **Network**: Shardeum Sphinx Testnet (EVM-compatible)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Context API

### Project Structure

```
src/
├── components/
│   ├── game/                    # Game mechanics components
│   │   ├── QuestBoard.tsx       # Quest selection and progress
│   │   ├── SkillTree.tsx        # Progressive skill unlock system
│   │   ├── Achievements.tsx     # Badge and achievement tracking
│   │   ├── Inventory.tsx        # Item collection system
│   │   ├── AIAdvisor.tsx        # Personalized learning tips
│   │   ├── XPBar.tsx            # Level and XP tracking
│   │   ├── ProgressTracker.tsx  # Overall progress display
│   │   └── LeaderboardPanel.tsx # Ranking system
│   ├── web3/                    # Web3 interaction components
│   │   ├── WalletConnect.tsx    # Wallet connection UI
│   │   ├── NetworkSwitcher.tsx  # Network selection
│   │   ├── TransactionStatus.tsx# TX state display
│   │   ├── StorageContractDemo.tsx   # Contract interaction demo
│   │   └── NFTMintDemo.tsx      # NFT minting demo
│   └── ui/                      # Shadcn UI components
├── context/
│   └── GameContext.tsx          # Game state management
├── hooks/
│   ├── useStorageContract.ts    # Storage contract hook
│   ├── useNFTContract.ts        # NFT contract hook
│   └── use-*.ts                 # Other utilities
├── lib/
│   ├── questSystem.ts           # Quest definitions
│   └── contractErrors.ts        # Error handling utilities
├── config/
│   ├── wagmi.ts                 # Wagmi configuration with Shardeum
│   └── contracts.ts             # Contract addresses and ABIs
└── pages/
    └── Quest.tsx                # Main learning hub
```

## 🎮 Core Features

### 1. Quest System
Progressive learning missions that teach Web3 fundamentals:

- **🔑 Wallet Wizard** - Connect wallet, understand private/public keys
- **⛓️ Transaction Tracker** - Send first transaction, understand gas
- **📝 Smart Contract Sage** - Store and retrieve on-chain data
- **✨ NFT Navigator** - Mint NFT, learn about digital ownership
- **⚙️ Gas Guru Challenge** - Optimize gas spending with limited budget

### 2. Gamification System

#### XP & Leveling
- Earn XP by completing quests and achievements
- Level up every 150 XP gained
- Unlock new skills based on level
- Visual progress bar shows journey to next level

#### Achievements
- 8 unlockable achievements (badges)
- Bonus XP rewards when unlocked
- Track personal milestones
- Share achievements on social platforms

#### Inventory System
- Collect items from completed quests
- NFTs and tokens displayed in inventory
- Limited slots (12 max) create strategic choices
- Items grant special rewards

#### Skill Tree
- 6 learning categories with progressive difficulty
- Skills unlock based on XP requirements
- Visual tree shows learning progression
- Categories: Basics, Transactions, Contracts, NFTs, DeFi, Optimization

### 3. Web3 Integration

#### Wallet Management
```typescript
// Seamless MetaMask connection
const WalletConnect = useWalletClient();
const account = useAccount();

// Automatic network detection and switching
const chainId = useAccount().chainId; // 8082 for Shardeum
```

#### Smart Contract Interaction

**Storage Contract** - Learn state management
```solidity
function storeNumber(uint256 num) external
function getNumber() external view returns (uint256)
```

**NFT Contract** - Learn digital ownership
```solidity
function mintHero(address to, string metadata) external
function balanceOf(address owner) external view returns (uint256)
```

#### Error Handling
Smart error classification and recovery:
- Wallet not connected
- Wrong network
- User rejection
- Insufficient funds
- Gas estimation failures
- RPC timeouts
- Transaction reversions

#### Retry Logic
Automatic retry mechanism for failed RPC calls:
- 3 retry attempts with exponential backoff
- Fallback to alternative RPC endpoints
- Clear error messages to users

### 4. Analytics Dashboard

Track learning progress with metrics:
- Quests completed / total
- Achievements unlocked
- Skills mastered
- Gas spent (vs. optimal)
- Playtime tracker
- Personalized recommendations

### 5. AI Advisor

Personalized learning companion that:
- Monitors player progress
- Suggests next quests based on level
- Provides gas optimization tips
- Celebrates milestones
- Explains Web3 concepts
- Auto-generates tips every 30 seconds

### 6. Leaderboard

Competitive ranking system:
- Users ranked by total XP
- Shows level and achievements
- NFTs owned per player
- Can be tied to Shardeum mainnet for persistence

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- MetaMask wallet (or any EIP-6963 compatible wallet)
- Shardeum Sphinx testnet tokens (claim from faucet)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/onchain-quest
cd onchain-quest

# Install dependencies
npm install
# or
bun install

# Setup environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Shardeum Sphinx Contract Addresses
VITE_STORAGE_CONTRACT=0x09F8d15471c87E749a791485BDd0669f4755F267
VITE_NFT_CONTRACT=0xbCbD59E6A24da671eC10BA958F7D5e861704567D

# Optional: RPC endpoint (defaults to Shardeum public RPC)
# VITE_RPC_URL=https://sphinx.shardeum.org/
```

### Development

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📚 Learning Path

### Beginner Path (0-500 XP)
1. **Wallet Wizard** (100 XP)
   - Connect MetaMask
   - Learn about public/private keys
   - Quiz on wallet security

2. **Transaction Tracker** (150 XP)
   - Get testnet tokens
   - Send first transaction
   - Understand block explorers

3. **Smart Contract Sage** (200 XP)
   - Store data on-chain
   - Retrieve from contracts
   - Learn immutability

### Intermediate Path (500-1500 XP)
4. **NFT Navigator** (250 XP)
   - Mint first NFT
   - Learn IPFS metadata
   - Dynamic NFT evolution

5. **Gas Guru Challenge** (300 XP)
   - Limited token budget
   - Multiple missions to compete
   - Optimize for best score

### Advanced Path (1500+ XP)
6. **DeFi Strategist** (simulation)
7. **Layer 2 Master** (rollup explanation)
8. **Security Auditor** (smart contract security)

## 🔧 Configuration

### Wagmi Setup

```typescript
// src/config/wagmi.ts
import { defineChain } from 'viem';

export const shardeum = defineChain({
  id: 8082,
  name: 'Shardeum Sphinx',
  nativeCurrency: {
    name: 'Shardeum',
    symbol: 'SHM',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sphinx.shardeum.org/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Shardeum Explorer',
      url: 'https://explorer-sphinx.shardeum.org/',
    },
  },
});
```

### Contract Configuration

```typescript
// src/config/contracts.ts
export const SHARDEUM_STORAGE_ADDRESS = '0x...';
export const SHARDEUM_NFT_ADDRESS = '0x...';

export const STORAGE_ABI = [
  // Contract ABI in TypeScript for full type safety
];
```

## 🎯 Hooks API

### useStorageContract

```typescript
const {
  loading,      // Transaction pending
  success,      // Transaction succeeded
  error,        // Error message
  txHash,       // Transaction hash
  txUrl,        // Explorer link
  storedNumber, // Retrieved number
  storeNumber,  // Function to store
  getNumber,    // Function to retrieve
  isReady,      // Wallet & network ready
} = useStorageContract();

// Usage
await storageContract.storeNumber('42');
```

### useNFTContract

```typescript
const {
  loading,
  success,
  error,
  txHash,
  txUrl,
  nftBalance,
  mintHero,     // Mint function
  getBalance,   // Get NFT count
  isReady,
} = useNFTContract();

// Usage
await nftContract.mintHero('0x...', 'ipfs://...');
```

### useGame

```typescript
const {
  xp,
  level,
  questsCompleted,
  achievements,
  inventory,
  skillTree,
  addXP,
  completeQuest,
  unlockAchievement,
  getProgress,
} = useGame();
```

## 🔐 Security Considerations

### Private Key Safety
- ✅ Private keys never leave MetaMask
- ✅ All signatures happen in-wallet
- ✅ No sensitive data stored locally
- ⚠️ Always verify transaction details before signing

### Transaction Safety
- Gas estimation before execution
- User-friendly error messages
- Transaction confirmation links to explorer
- Retry logic with exponential backoff

### Contract Safety
- ABIs are strongly typed
- Function inputs are validated
- Read-only calls never cost gas
- Emergency pause mechanisms available

## 📊 Data Models

### Quest

```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  story: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'wallet_setup' | 'transaction' | 'smart_contract' | ...;
  reward: { xp: number; tokens?: number; badges?: string[]; };
  steps: QuestStep[];
  isCompleted: boolean;
  isLocked: boolean;
  prerequisites?: string[];
}
```

### Achievement

```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: number;
}
```

## 🎨 UI/UX Philosophy

- **Minecraft Pixel Theme**: Blocky, retro 2D aesthetic
- **Minimal Colors**: Clear, high-contrast palette for accessibility
- **Large Fonts**: Readable on all screen sizes
- **Feedback**: Animations, toasts, and status indicators
- **Mobile-First**: Responsive grid layouts

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub and connect to Vercel
# Automatic builds and deployments

# Environment variables in Vercel dashboard
VITE_STORAGE_CONTRACT=0x...
VITE_NFT_CONTRACT=0x...
```

### Self-Hosted

```bash
npm run build
# Serve dist/ folder on any static host
```

## 🤝 Contributing

Contributions welcome! Areas to improve:

- More quest content
- DeFi simulation engine
- Backend analytics
- Layer 2 integrations
- Multi-language support

## 📝 License

MIT

## 🙋 Support

- **Discord**: [Join our community](https://discord.gg/...)
- **GitHub Issues**: Report bugs and request features
- **Email**: support@onchainquest.dev

## 🎓 Educational Resources

Learn more about Web3 concepts in the platform:

- [Ethereum Docs](https://ethereum.org/en/developers/)
- [Solidity by Example](https://solidity-by-example.org/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Guide](https://viem.sh/)
- [Shardeum Docs](https://shardeum.org/docs/)

## 📈 Roadmap

- [ ] Advanced DeFi simulations (yield farming, swaps)
- [ ] Multi-language support (10+ languages)
- [ ] Mainnet leaderboards with on-chain verification
- [ ] Teacher dashboard for classrooms
- [ ] Mobile app (React Native)
- [ ] Layer 2 interaction tutorials (Arbitrum, Optimism)
- [ ] Certification NFTs with verifiable skills
- [ ] API for third-party integrations

---

**Happy Learning! 🚀** Start your Web3 journey with Onchain Quest today!
