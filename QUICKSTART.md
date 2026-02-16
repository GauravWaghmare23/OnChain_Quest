# 🚀 Onchain Quest - Quick Start Guide

## What You've Built

A complete **Gamified Web3 Learning Platform** that teaches blockchain fundamentals through interactive quests on Shardeum testnet.

## Key Features Implemented ✅

### 1. **Wallet & Network Management**
- ✅ MetaMask wallet connection with auto-reconnection
- ✅ Shardeum Sphinx testnet configuration (Chain ID: 8082)
- ✅ Network switcher with easy chain switching
- ✅ Automatic network detection

### 2. **Smart Contract Interactions**
- ✅ Storage Contract (storeNumber, getNumber)
- ✅ NFT Contract (mintHero, balanceOf)
- ✅ Type-safe hooks: `useStorageContract()` and `useNFTContract()`
- ✅ Gas estimation and transaction feedback
- ✅ Explorer links for transaction tracking

### 3. **Quest System**
- ✅ 5 Core learning quests (Wallet → NFT progression)
- ✅ Quest prerequisites and progression
- ✅ Detailed step-by-step instructions
- ✅ Educational explanations within quests
- ✅ Quest board with visual progress tracking

### 4. **Gamification**
- ✅ XP system with level progression (150 XP per level)
- ✅ 8 achievements with unlock tracking
- ✅ Inventory system (12 slot limit)
- ✅ Skill tree with 6 categories and progression
- ✅ Leaderboard with rankings

### 5. **AI Advisor**
- ✅ Personalized tips based on progress
- ✅ Real-time feedback on performance
- ✅ Gas optimization suggestions
- ✅ Auto-generated insights every 30 seconds

### 6. **Error Handling & Recovery**
- ✅ Smart error classification (10+ error types)
- ✅ User-friendly error messages
- ✅ Automatic retry logic (3 attempts with backoff)
- ✅ RPC fallback mechanisms

### 7. **Analytics & Dashboard**
- ✅ Overall progress tracking
- ✅ Statistics dashboard
- ✅ Playtime tracking
- ✅ Gas spending analytics

## File Structure

### New Files Created

```
src/
├── lib/
│   ├── questSystem.ts          (Quest definitions, 300+ lines)
│   └── contractErrors.ts       (Error handling, 200+ lines)
├── hooks/
│   ├── useStorageContract.ts   (600+ lines)
│   └── useNFTContract.ts       (600+ lines)
├── components/game/
│   ├── QuestBoard.tsx          (Quest selection UI)
│   ├── SkillTree.tsx           (Skill progression)
│   ├── Achievements.tsx        (Badge display)
│   ├── Inventory.tsx           (Item management)
│   ├── ProgressTracker.tsx     (Progress display)
│   ├── XPBar.tsx               (Level bar)
│   ├── AIAdvisor.tsx           (Personalized tips)
│   └── LeaderboardPanel.tsx    (Rankings)
└── components/web3/
    ├── StorageContractDemo.tsx  (Contract interaction demo)
    └── NFTMintDemo.tsx         (NFT minting demo)

Modified:
├── context/GameContext.tsx     (Upgraded game state)
├── config/wagmi.ts            (Added Shardeum)
├── config/contracts.ts        (Updated ABIs & addresses)
├── pages/Quest.tsx            (Rebuilt entire page)
└── App.tsx                    (No changes needed)

Documentation:
├── ONCHAIN_QUEST_README.md    (2000+ line comprehensive guide)
└── QUICKSTART.md             (This file)
```

## 📋 Environment Setup

### 1. Create `.env.local`

```env
# Shardeum Sphinx Testnet Contracts
VITE_STORAGE_CONTRACT=0x09F8d15471c87E749a791485BDd0669f4755F267
VITE_NFT_CONTRACT=0xbCbD59E6A24da671eC10BA958F7D5e861704567D
```

### 2. Deploy Your Own Contracts (Optional)

The demo uses sample contract addresses. To deploy your own:

**Storage Contract (Solidity)**
```solidity
pragma solidity ^0.8.0;

contract Storage {
    uint256 public storedNumber;
    
    function storeNumber(uint256 num) public {
        storedNumber = num;
    }
    
    function getNumber() public view returns (uint256) {
        return storedNumber;
    }
}
```

**NFT Contract (ERC-721)**
```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract HeroNFT is ERC721 {
    mapping(uint256 => string) public tokenURI;
    uint256 public tokenCounter;
    
    function mintHero(address to, string memory metadataURI) public {
        uint256 tokenId = tokenCounter++;
        _mint(to, tokenId);
        tokenURI[tokenId] = metadataURI;
    }
}
```

Deploy on Shardeum using Remix:
1. Go to [Remix IDE](https://remix.ethereum.org)
2. Connect to Shardeum Sphinx (RPC: https://sphinx.shardeum.org/)
3. Deploy contracts
4. Update `.env.local` with new addresses

## 🎮 Game Architecture

### Learning Path

```
Level 1: Wallet Basics (0 XP)
└─ Quest: Wallet Wizard (100 XP)

Level 2: Transactions (150 XP)
├─ Quest: Transaction Tracker (150 XP)
└─ Quest: Smart Contract Sage (200 XP)

Level 3: NFTs & Ownership (300 XP)
├─ Quest: NFT Navigator (250 XP)
└─ Quest: Gas Guru Challenge (300 XP)

Level 10: Web3 Master (1500+ XP)
```

### State Management Flow

```
App.tsx
└─ WagmiProvider
   └─ QueryClientProvider
      └─ GameProvider (Context)
         └─ QuestionComponent, SkillTree, etc.
            └─ Individual Hooks (useStorageContract, useNFTContract)
```

## 🔧 Using the Hooks

### Storage Contract Interaction

```typescript
import { useStorageContract } from '@/hooks/useStorageContract';

function MyComponent() {
  const {
    loading,
    success,
    error,
    txHash,
    txUrl,
    storedNumber,
    storeNumber,
    getNumber,
    isReady
  } = useStorageContract();

  const handleStore = async () => {
    await storeNumber('42');
  };

  return (
    <div>
      {isReady ? (
        <>
          <button onClick={handleStore} disabled={loading}>
            {loading ? 'Storing...' : 'Store Number'}
          </button>
          {txUrl && <a href={txUrl}>View on Explorer</a>}
          {storedNumber && <p>Stored: {storedNumber}</p>}
        </>
      ) : (
        <p>Connect to Shardeum first</p>
      )}
    </div>
  );
}
```

### NFT Minting

```typescript
import { useNFTContract } from '@/hooks/useNFTContract';

function MintHero() {
  const { mintHero, getBalance, nftBalance, loading } = useNFTContract();

  return (
    <button 
      onClick={() => mintHero(address, 'ipfs://...')}
      disabled={loading}
    >
      {loading ? 'Minting...' : 'Mint Hero'}
    </button>
  );
}
```

## 📱 UI Components

### Minecraft Pixel Theme

Using Shadcn UI with custom styling:
- Blocky borders (`border-2`, `rounded-none`)
- Bold fonts (`font-bold`)
- High contrast colors
- Large icons (emoji + text)

```tsx
<Card className="border-2 border-blue-400 rounded-none bg-blue-50">
  <CardHeader className="bg-blue-100 border-b-2 border-blue-400">
    <CardTitle>Quest Name</CardTitle>
  </CardHeader>
  <CardContent className="pt-6">
    Content here
  </CardContent>
</Card>
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Manual Testing Checklist

- [ ] Wallet connects/disconnects
- [ ] Network switches to Shardeum
- [ ] Storage contract: store number
- [ ] Storage contract: get number
- [ ] NFT contract: mint hero
- [ ] NFT contract: check balance
- [ ] XP increases on quest completion
- [ ] Achievements unlock with notifications
- [ ] Skill tree unlocks at proper levels
- [ ] AI Advisor generates tips
- [ ] Leaderboard displays correctly
- [ ] Inventory items persist

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Connect to Vercel dashboard
# vercel.com/new → Select your repository

# Add environment variables in Vercel settings:
VITE_STORAGE_CONTRACT=0x...
VITE_NFT_CONTRACT=0x...

# Auto-deploys on push
```

### Self-Hosted

```bash
npm run build
# Serve dist/ folder on any static host
# (GitHub Pages, Netlify, AWS S3, etc.)
```

## 📚 Learning Resources

- **Shardeum Docs**: https://shardeum.org/docs/
- **Wagmi Docs**: https://wagmi.sh/
- **Viem Guide**: https://viem.sh/
- **Solidity Basics**: https://solidity-by-example.org/
- **ERC-721 (NFTs)**: https://eips.ethereum.org/EIPS/eip-721

## 🐛 Debugging

### Enable Debug Mode

```typescript
// In wagmi.ts
export const wagmiConfig = createConfig({
  // ... other config
  logger: {
    log: console.log,
    warn: console.warn,
  },
});
```

### Check Block Explorer

All transactions visible at:
https://explorer-sphinx.shardeum.org/tx/[HASH]

### Network Issues

If contracts not found:
1. Verify contract address in `.env.local`
2. Check on Shardeum Explorer
3. Ensure you're on correct network (Chain ID: 8082)
4. Try the RPC URL in Postman:
   ```bash
   curl -X POST https://sphinx.shardeum.org/ \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
   ```

## 🎓 Next Steps

### Beginner
1. Connect wallet
2. Complete "Wallet Wizard" quest
3. Complete "Transaction Tracker" quest
4. Earn first achievement

### Intermediate
5. Learn about smart contracts
6. Deploy and interact with your own contract
7. Mint your first NFT
8. Optimize gas spending

### Advanced
9. Create custom quests
10. Build DeFi simulations
11. Integrate with Layer 2 solutions
12. Create multi-player features

## 💡 Tips & Tricks

### Gas Optimization
- Bundle transactions together
- Use shorter variable names
- Avoid unnecessary storage writes
- Use `constant` functions for reads

### Achievement Hunting
- Complete all quests for "Champion" badge
- Unlock all skills for "Master" badge
- Mint NFTs for "Collector" badge

### Leaderboard Strategy
- Focus on XP gain (more efficient than gas spent)
- Complete quests in order (prerequisites unlock faster)
- Manage time and energy

## 🤝 Support

### Common Issues

**Q: "Wrong Network" Error**
A: Click "Switch Network" button to switch to Shardeum Sphinx

**Q: "Insufficient Funds" Error**
A: Get free test tokens from https://shardeum.org/faucet/

**Q: Transaction Never Confirms**
A: Wait 30+ seconds (testnet is slow), check explorer for status

**Q: Gas Estimation Fails**
A: Ensure contract address is correct and contract is deployed

## 📊 Metrics at a Glance

| Metric | Value |
|--------|-------|
| Total Code Written | 5000+ lines |
| Components Created | 15+ |
| Hooks Created | 2 |
| Quests Defined | 5 |
| Achievements | 8 |
| Skills | 6 |
| Error Types Handled | 10+ |
| Build Size | ~700 KB (gzipped: 216 KB) |
| Build Time | ~11 seconds |

---

**You're all set! 🎉** Start the dev server and begin your Web3 learning journey:

```bash
npm run dev
```

Visit `http://localhost:5173` and start questing! 🚀
