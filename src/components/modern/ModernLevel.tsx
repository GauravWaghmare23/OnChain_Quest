import { ReactNode } from "react";
import { WalletConnect } from "@/components/web3/WalletConnect";

interface ModernLevelProps {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: "cyan" | "emerald" | "purple";
  children: ReactNode;
  progress?: number;
}

const colorMap = {
  cyan: {
    gradient: "from-cyan-500/10 to-blue-500/10",
    border: "border-cyan-500/30",
    accent: "text-cyan-400",
    button: "bg-cyan-600 hover:bg-cyan-700",
  },
  emerald: {
    gradient: "from-emerald-500/10 to-green-500/10",
    border: "border-emerald-500/30",
    accent: "text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  purple: {
    gradient: "from-purple-500/10 to-pink-500/10",
    border: "border-purple-500/30",
    accent: "text-purple-400",
    button: "bg-purple-600 hover:bg-purple-700",
  },
};

export const ModernLevel = ({
  icon,
  title,
  subtitle,
  description,
  accentColor,
  children,
  progress = 0,
}: ModernLevelProps) => {
  const colors = colorMap[accentColor];

  return (
    <div className="min-h-screen bg-black text-white">
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
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <span className="font-bold text-lg">{title}</span>
          </div>
          <WalletConnect />
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`p-8 rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.gradient} backdrop-blur-sm mb-12`}>
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">{icon}</div>
              <div className="flex-1">
                <h1 className={`text-5xl font-black ${colors.accent} mb-2`}>{title}</h1>
                <p className="text-gray-400 text-lg">{subtitle}</p>
              </div>
            </div>
            <p className="text-gray-400">{description}</p>

            {/* Progress Bar */}
            {progress > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className={`text-sm font-bold ${colors.accent}`}>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-8">{children}</div>
        </div>
      </div>
    </div>
  );
};
