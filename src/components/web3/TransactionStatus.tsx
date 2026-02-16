import { useEffect, useState } from "react";
import { ExternalLink, CheckCircle2, AlertCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TransactionStatusProps {
  loading: boolean;
  success: boolean;
  error: string | null;
  txHash: string | null;
  txUrl: string | null;
  onDismiss?: () => void;
}

export const TransactionStatus = ({
  loading,
  success,
  error,
  txHash,
  txUrl,
  onDismiss,
}: TransactionStatusProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(loading || success || !!error);
  }, [loading, success, error]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  if (loading && txHash) {
    return (
      <Alert className="border-2 border-blue-400 bg-blue-50 rounded-none">
        <Loader className="h-4 w-4 text-blue-600 animate-spin" />
        <AlertDescription className="ml-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-blue-900">⛏️ Mining Block...</p>
              <p className="text-xs text-blue-700 mt-1 font-mono">{txHash}</p>
              {txUrl && (
                <a
                  href={txUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                >
                  View on Explorer <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (success && txHash) {
    return (
      <Alert className="border-2 border-green-400 bg-green-50 rounded-none">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="ml-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-green-900">✓ Transaction Success!</p>
              <p className="text-xs text-green-700 mt-1 font-mono">{txHash}</p>
              {txUrl && (
                <a
                  href={txUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 hover:underline flex items-center gap-1 mt-1"
                >
                  View on Explorer <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <Button
              onClick={handleDismiss}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-none"
            >
              Dismiss
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert className="border-2 border-red-400 bg-red-50 rounded-none">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="ml-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-red-900">✗ Transaction Failed</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
            <Button
              onClick={handleDismiss}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-none"
            >
              Dismiss
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
