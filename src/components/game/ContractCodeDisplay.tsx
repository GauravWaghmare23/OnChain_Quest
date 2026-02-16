import { useState } from "react";
import { ChevronDown, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ContractCodeDisplayProps {
  title: string;
  contract: string;
  steps: Step[];
  color: "blue" | "purple" | "yellow" | "pink";
}

interface Step {
  number: number;
  title: string;
  description: string;
}

const colorMap = {
  blue: { bg: "bg-blue-900", border: "border-blue-500", text: "text-blue-300", button: "bg-blue-600 hover:bg-blue-700" },
  purple: { bg: "bg-purple-900", border: "border-purple-500", text: "text-purple-300", button: "bg-purple-600 hover:bg-purple-700" },
  yellow: { bg: "bg-yellow-900", border: "border-yellow-500", text: "text-yellow-300", button: "bg-yellow-600 hover:bg-yellow-700" },
  pink: { bg: "bg-pink-900", border: "border-pink-500", text: "text-pink-300", button: "bg-pink-600 hover:bg-pink-700" },
};

export const ContractCodeDisplay = ({ title, contract, steps, color }: ContractCodeDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const colors = colorMap[color];

  const handleCopy = () => {
    navigator.clipboard.writeText(contract);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Contract Code Section */}
      <Card className={`${colors.bg} border-2 ${colors.border} rounded-none`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full p-6 flex items-center justify-between hover:opacity-80 transition`}
        >
          <div className="text-left">
            <h2 className={`text-2xl font-bold ${colors.text} pixel-text`}>📋 Solidity Contract</h2>
            <p className="text-gray-400 text-sm mt-1">{title}</p>
          </div>
          <ChevronDown
            className={`w-6 h-6 ${colors.text} transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>

        {isExpanded && (
          <div className="border-t-2 border-opacity-50 p-6 space-y-4">
            {/* Code Block */}
            <div className="bg-black border-2 border-gray-700 rounded-none p-4 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-words">
                {contract}
              </pre>
            </div>

            {/* Copy Button */}
            <Button
              onClick={handleCopy}
              className={`w-full ${colors.button} text-white rounded-none pixel-button font-bold flex items-center justify-center gap-2`}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Contract Code
                </>
              )}
            </Button>
          </div>
        )}
      </Card>

      {/* Deployment Steps */}
      <Card className={`${colors.bg} border-2 ${colors.border} rounded-none p-6`}>
        <h3 className={`text-2xl font-bold ${colors.text} mb-6 pixel-text`}>🚀 Deploy in Remix</h3>

        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-black border-2 border-gray-700 rounded-none p-4 flex gap-4"
            >
              <div className={`${colors.button.replace('hover:bg-', 'bg-')} text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold`}>
                {step.number}
              </div>
              <div className="flex-1">
                <p className={`font-bold ${colors.text} text-sm`}>{step.title}</p>
                <p className="text-gray-300 text-xs mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Network Info */}
        <div className="mt-6 bg-gray-900 border-2 border-gray-700 rounded-none p-4">
          <p className="text-gray-300 text-xs font-mono">
            <span className="text-cyan-400">Network:</span> Shardeum Mezame <br />
            <span className="text-cyan-400">Chain ID:</span> 8119 <br />
            <span className="text-cyan-400">RPC URL:</span> https://api-mezame.shardeum.org <br />
            <span className="text-cyan-400">Explorer:</span> https://explorer-mezame.shardeum.org
          </p>
        </div>
      </Card>
    </div>
  );
};
