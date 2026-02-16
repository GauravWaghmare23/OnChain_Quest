import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ModernCodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const ModernCodeBlock = ({ code, language = "solidity", title }: ModernCodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {title && <p className="text-sm font-semibold text-gray-300">{title}</p>}
      <div className="relative rounded-xl bg-gray-950 border border-gray-800 overflow-hidden group hover:border-emerald-500/30 transition-colors">
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-emerald-500/50 transition-all flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">Copy</span>
            </>
          )}
        </button>

        {/* Code Content */}
        <pre className="p-6 pr-32 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed">
          <code>{code}</code>
        </pre>

        {/* Language Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="text-xs font-semibold text-gray-500 uppercase">{language}</span>
        </div>
      </div>
    </div>
  );
};
