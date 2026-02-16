# Level 2 & 3 - Smart Contract Apprentice & Web3 Master Guide

## Overview

You can now access two new advanced levels in your game by navigating to the **⚡ Level 2** and **👑 Level 3** tabs in the main game interface.

---

## **Level 2: Smart Contract Apprentice** (⚡)

### Learning Objectives
- Master **mappings** - on-chain data storage structures
- Understand **ownership patterns** - access control
- Learn **state management** - reading/writing on-chain data
- Gas optimization awareness

### How to Play

#### 1. **Deploy the Contract in Remix**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OnchainSkills {
    mapping(address => uint256) public skillPoints;
    address public owner;

    event SkillEarned(address player, uint256 points);

    constructor() {
        owner = msg.sender;
    }

    function earnSkill(uint256 points) public {
        require(points > 0, "Invalid points");
        skillPoints[msg.sender] += points;
        emit SkillEarned(msg.sender, points);
    }

    function resetSkills(address player) public {
        require(msg.sender == owner, "Only owner");
        skillPoints[player] = 0;
    }

    function getMySkills() public view returns (uint256) {
        return skillPoints[msg.sender];
    }
}
```

**Steps to Deploy:**
1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new file `OnchainSkills.sol`
3. Copy the contract code above
4. Compile (Solidity 0.8.20+)
5. Deploy on **Shardeum Mezame testnet** (Chain ID: 8119)
6. Copy the contract address

#### 2. **Connect in Game**
1. Click **⚡ Level 2** tab
2. Paste the contract address
3. Click "Connect Contract"

#### 3. **Earn Skills**
- Enter number of skill points (1-1000)
- Click "Earn" button
- Wait for transaction confirmation
- Watch your XP bar fill up!

### Smart Concepts Taught
- `mapping(address => uint256)` - Stores data by address
- `public` functions - Anyone can call
- `event` logs - Track activity on-chain
- `require()` - Validate conditions
- State changes - Permanent on-chain records

### Real-Time Features
✅ Live skill point updates  
✅ Event listener for instant UI refresh  
✅ Transaction explorer links  
✅ Retry on network congestion  
✅ Gas estimation help  

---

## **Level 3: Web3 Master - DAO Governance** (👑)

### Learning Objectives
- Master **DAOs** - Decentralized Autonomous Organizations
- Understand **governance** - Voting & proposals
- Learn **reputation systems** - Earn voting power
- See real decentralization in action

### How to Play

#### 1. **Deploy the Governance Contract**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OnchainGovernance {
    struct Proposal {
        string title;
        uint256 votes;
    }

    Proposal[] public proposals;
    mapping(address => uint256) public reputation;
    mapping(address => bool) public voted;

    event ProposalCreated(string title);
    event Voted(address voter, uint256 proposalId);

    function createProposal(string memory title) public {
        proposals.push(Proposal(title, 0));
        emit ProposalCreated(title);
    }

    function vote(uint256 proposalId) public {
        require(!voted[msg.sender], "Already voted");
        require(proposalId < proposals.length, "Invalid proposal");

        proposals[proposalId].votes++;
        voted[msg.sender] = true;
        reputation[msg.sender] += 10;

        emit Voted(msg.sender, proposalId);
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
}
```

**Deploy Steps:**
1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new file `OnchainGovernance.sol`
3. Copy the contract code above
4. Compile (Solidity 0.8.20+)
5. Deploy on **Shardeum Mezame testnet** (Chain ID: 8119)
6. Copy the contract address

#### 2. **Connect in Game**
1. Click **👑 Level 3** tab
2. Paste the contract address
3. Click "Connect Contract"

#### 3. **Participate in DAO**
**View Status:**
- See your reputation score (increases +10 per vote)
- Count active proposals
- Check if you've already voted

**Create Proposals:**
1. Enter proposal title (max 500 chars)
2. Click "Propose"
3. Transaction confirms
4. Proposal appears on the board

**Vote on Proposals:**
1. Find proposal you want to support
2. Click "Vote" button
3. Transaction confirms
4. Get +10 reputation
5. Vote count increases on proposal
6. 🎉 Celebration animation plays!

### DAO Concepts Taught
- `struct Proposal` - Custom data types
- Voting mechanics - Majority rules
- Reputation system - Earn voting power
- `event` logs - Track votes
- `require()` validation - Prevent double voting
- `arrays` - Store multiple proposals
- `mapping` - Track voter status

### Real-Time Features
✅ Live proposal list updates  
✅ Vote count updates instantly  
✅ Reputation earned in real-time  
✅ Event listeners for multi-user sync  
✅ Transaction explorer links  
✅ Celebration animation on success  
✅ Network error handling  

---

## Technical Architecture

### Smart Contract Interaction Flow

```
User Input → Validation → txQueue Serialization 
  ↓
Network Check → Wallet Check → Gas Estimation (MetaMask) 
  ↓
writeContract() - No Manual Gas → Exponential Backoff Retry 
  ↓
Wait for Receipt → Event Listeners → UI Update 
  ↓
Toast Notifications + Explorer Links
```

### Error Handling (8 Categories)
- **User Rejection** - User declined transaction
- **Insufficient Funds** - Not enough SHM for gas
- **Wrong Network** - Not on Shardeum Mezame (8119)
- **RPC Timeout** - Network slow, auto-retry
- **Congestion** - Too many transactions, auto-retry
- **Nonce Conflict** - Transaction ordering issue
- **Invalid Address** - Bad contract/wallet address
- **Generic Errors** - Fallback message

### Key Features
✅ **Shardeum Mezame Support**  
✅ **Transaction Queue** - Prevents race conditions  
✅ **Auto-Retry Logic** - Up to 3 retries with exponential backoff  
✅ **Real-Time Event Listeners** - Live UI updates  
✅ **Network Validation** - Wallet + chain checks  
✅ **Explorer Integration** - View txs on explorer-mezame.shardeum.org  
✅ **Toast Notifications** - Loading, success, error states  
✅ **Gas Estimation** - MetaMask handles all estimations  

---

## Files Created

### Configuration
- `src/config/abis.ts` - Contract ABIs for both levels
- `src/config/chains.ts` - Shardeum Mezame chain definition
- `src/config/wagmi.ts` - Wagmi config with retry logic
- `src/config/contracts.ts` - Contract helpers and explorer URLs

### Hooks
- `src/hooks/useOnchainSkills.ts` - Level 2 contract interaction
- `src/hooks/useOnchainGovernance.ts` - Level 3 contract interaction

### Components
- `src/components/game/SmartContractLevel.tsx` - Level 2 UI
- `src/components/game/GovernanceLevel.tsx` - Level 3 UI

### Utilities
- `src/lib/transactionQueue.ts` - Transaction serialization
- `src/lib/networkValidation.ts` - Network & wallet validation

---

## Testing Checklist

- [ ] Deploy OnchainSkills contract to Shardeum Mezame
- [ ] Deploy OnchainGovernance contract to Shardeum Mezame
- [ ] Connect both contracts in game
- [ ] Earn skill points in Level 2
- [ ] Create a proposal in Level 3
- [ ] Vote on a proposal
- [ ] Verify reputation increases
- [ ] Check explorer links work
- [ ] Test with wrong network (should prompt switch)
- [ ] Test with disconnected wallet (should prompt connection)
- [ ] Verify event listeners update UI in real-time
- [ ] Test retry logic (disable RPC, try transaction)

---

## Troubleshooting

### "Invalid Contract Address"
- Make sure address starts with `0x` and is 42 characters
- Verify contract was deployed on Shardeum Mezame (8119)
- Check address in block explorer

### "Wrong Network"
- Your wallet is on a different chain
- Click "Switch Network" button to auto-switch to Mezame
- Or manually switch in MetaMask to Shardeum Mezame (8119)

### "Transaction Timeout"
- Shardeum RPC might be temporarily congested
- App automatically retries up to 3 times
- Check [Shardeum Status](https://www.shardeum.org/) page

### "Already Voted"
- You can only vote once per address in Level 3
- Multiple wallets can vote (switch accounts in MetaMask)

### No Contract Functions
- Ensure contract address was pasted correctly
- Refresh page if needed
- Check Shardeum explorer to verify contract exists

---

## Next Steps

🎓 **After completing Levels 2 & 3:**
- Try deploying your own contract variants
- Combine both contracts into a "DAO Skill Factory"
- Create multi-sig governance with reputation weighting
- Deploy to mainnet (if you're feeling adventurous!)

Happy learning! 🚀
