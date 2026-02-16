import { useState } from "react";
import { ChevronDown, CheckCircle2, Circle } from "lucide-react";

interface DeploymentStep {
  title: string;
  description: string;
}

interface ModernDeploymentGuideProps {
  steps: DeploymentStep[];
  title?: string;
}

export const ModernDeploymentGuide = ({ steps, title = "Deployment Steps" }: ModernDeploymentGuideProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors flex items-center justify-between group"
      >
        <span className="font-semibold text-white">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-emerald-400 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-3">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex-shrink-0 pt-1">
                <Circle className="w-5 h-5 text-emerald-400 fill-emerald-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">
                  Step {idx + 1}: {step.title}
                </h4>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
