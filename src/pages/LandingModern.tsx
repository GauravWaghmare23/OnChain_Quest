import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { ArrowRight, Code2, Shield, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/web3/WalletConnect";

export default function LandingModern() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleStartLearning = () => {
    if (isConnected) {
      navigate("/dashboard");
    } else {
      setShowWalletModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-emerald-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-cyan-500 rounded flex items-center justify-center">
              <Code2 className="w-4 h-4 text-black font-bold" />
            </div>
            <span className="text-lg font-bold text-cyan-400 hidden sm:inline">
              Onchain Quest
            </span>
          </div>
          <WalletConnect compact={true} />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-block">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 backdrop-blur-sm">
              <span className="text-xs font-mono text-emerald-400">
                ▸ Web3 Learning Platform
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            <span className="text-white">Learn Web3 by</span>
            <br />
            <span className="text-cyan-400">
              Deploying Real Smart Contracts
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Complete hands-on Web3 challenges. Deploy contracts. Earn reputation. Master blockchain development. All on Shardeum testnet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              onClick={handleStartLearning}
              className="px-8 py-6 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg text-lg flex items-center justify-center gap-2 transition-all duration-300 group"
            >
              {isConnected ? "Go to Dashboard" : "Start Learning"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 border-2 border-cyan-500/50 hover:border-cyan-500 hover:bg-cyan-500/10 text-white rounded-lg text-lg font-bold transition-all duration-300"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            >
              Learn More
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-12 flex justify-center animate-bounce">
            <ChevronDown className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Learn Contracts</h3>
              <p className="text-gray-400 leading-relaxed">
                Study Solidity smart contracts through interactive lessons. Understand state, mappings, and events from first principles.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Deploy Live</h3>
              <p className="text-gray-400 leading-relaxed">
                Deploy your own contracts using Remix IDE. See your code run on Shardeum testnet in real time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Earn Reputation</h3>
              <p className="text-gray-400 leading-relaxed">
                Complete levels, earn XP, build your Web3 portfolio, and unlock advanced challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Levels Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16">
            3 Progressive Levels
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Level 1 */}
            <div className="p-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold mb-3">Level 1: Storage</h3>
              <p className="text-gray-400 mb-6">
                Learn state variables, storage, and basic contract interactions. Deploy and test a simple storage contract.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✓ State variables</p>
                <p>✓ Events</p>
                <p>✓ Basic storage</p>
              </div>
            </div>

            {/* Level 2 */}
            <div className="p-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3">Level 2: Mappings</h3>
              <p className="text-gray-400 mb-6">
                Master mappings and ownership patterns. Build an on-chain skills tracking system with access control.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✓ Mappings</p>
                <p>✓ Ownership</p>
                <p>✓ Modifiers</p>
              </div>
            </div>

            {/* Level 3 */}
            <div className="p-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm">
              <div className="text-6xl mb-4">👑</div>
              <h3 className="text-2xl font-bold mb-3">Level 3: Governance</h3>
              <p className="text-gray-400 mb-6">
                Learn DAO patterns, voting mechanisms, and reputation systems. Build a decentralized governance contract.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✓ Structs & Arrays</p>
                <p>✓ Voting logic</p>
                <p>✓ Reputation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-black text-cyan-400 mb-2">
                1000+
              </div>
              <p className="text-gray-400">Learners</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-black text-cyan-400 mb-2">
                3
              </div>
              <p className="text-gray-400">Levels</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-black text-cyan-400 mb-2">
                100%
              </div>
              <p className="text-gray-400">On-Chain</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-black text-cyan-400 mb-2">
                Free
              </div>
              <p className="text-gray-400">Forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black">
            Ready to Master Web3?
          </h2>
          <p className="text-xl text-gray-400">
            Start with Level 1 and earn your way up. No prerequisites, just curiosity and a wallet.
          </p>
          <Button
            onClick={handleStartLearning}
            className="px-10 py-6 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg text-lg flex items-center justify-center gap-2 mx-auto transition-all duration-300 group"
          >
            {isConnected ? "Go to Dashboard" : "Connect Wallet & Start"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-black border-2 border-cyan-500 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">⚡ Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Start your Web3 learning journey by connecting your MetaMask wallet.
            </p>
            <div className="mb-6">
              <WalletConnect compact={false} />
            </div>
            <button
              onClick={() => setShowWalletModal(false)}
              className="w-full py-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
