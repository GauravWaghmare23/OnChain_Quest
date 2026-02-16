import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroKingdom from "@/assets/hero-kingdom.png";

const Landing = () => {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowText(1), 500),
      setTimeout(() => setShowText(2), 1500),
      setTimeout(() => setShowText(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroKingdom}
          alt="BNB Kingdom"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 px-4 max-w-2xl">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl text-accent pixel-text-shadow animate-pixel-float">
            ⛏️ BNB QUEST ⛏️
          </h1>
          <div className="flex justify-center gap-1">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="text-[8px] text-primary">█</span>
            ))}
          </div>
        </div>

        {/* Story text */}
        <div className="quest-panel text-left space-y-4 max-w-lg mx-auto">
          <p className="text-[8px] text-gold mb-2">📖 PROLOGUE</p>

          {showText >= 1 && (
            <p className="text-[8px] text-foreground leading-relaxed animate-slide-up">
              A mysterious portal has opened to the BNB Kingdom — a realm where
              digital treasures flow through enchanted chains of blocks...
            </p>
          )}

          {showText >= 2 && (
            <p className="text-[8px] text-foreground leading-relaxed animate-slide-up">
              You are a brave adventurer seeking to master the ancient arts of
              Web3 — connecting wallets, signing decrees, and forging legendary NFTs.
            </p>
          )}

          {showText >= 3 && (
            <p className="text-[8px] text-accent leading-relaxed animate-slide-up">
              Your quest begins now. Will you enter the kingdom? ▼
            </p>
          )}
        </div>

        {/* CTA */}
        {showText >= 3 && (
          <div className="animate-slide-up space-y-4">
            <button
              onClick={() => navigate("/quest")}
              className="pixel-btn bg-primary text-primary-foreground text-xs px-10 py-4 animate-pixel-bounce"
            >
              ⚔️ BEGIN QUEST
            </button>
            <p className="text-[6px] text-muted-foreground">
              ~5 MIN • LEARN BLOCKCHAIN • EARN ACHIEVEMENTS
            </p>
          </div>
        )}

        {/* Pixel decoration */}
        <div className="flex justify-center gap-4 text-2xl">
          <span className="animate-pixel-float" style={{ animationDelay: "0s" }}>🏰</span>
          <span className="animate-pixel-float" style={{ animationDelay: "0.3s" }}>⛏️</span>
          <span className="animate-pixel-float" style={{ animationDelay: "0.6s" }}>💎</span>
          <span className="animate-pixel-float" style={{ animationDelay: "0.9s" }}>🗡️</span>
          <span className="animate-pixel-float" style={{ animationDelay: "1.2s" }}>🛡️</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;
