// ABI for OnchainSkills contract
export const ONCHAIN_SKILLS_ABI = [
  {
    type: "event",
    name: "SkillEarned",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "points", type: "uint256", indexed: false },
    ],
  },
  {
    type: "function",
    name: "earnSkill",
    inputs: [{ name: "points", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getMySkills",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "resetSkills",
    inputs: [{ name: "player", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "skillPoints",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
];

// ABI for OnchainGovernance contract
export const ONCHAIN_GOVERNANCE_ABI = [
  {
    type: "event",
    name: "ProposalCreated",
    inputs: [{ name: "title", type: "string", indexed: false }],
  },
  {
    type: "event",
    name: "Voted",
    inputs: [
      { name: "voter", type: "address", indexed: true },
      { name: "proposalId", type: "uint256", indexed: false },
    ],
  },
  {
    type: "function",
    name: "createProposal",
    inputs: [{ name: "title", type: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "vote",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getProposals",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "title", type: "string" },
          { name: "votes", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "reputation",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "voted",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proposals",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "title", type: "string" },
      { name: "votes", type: "uint256" },
    ],
    stateMutability: "view",
  },
];
