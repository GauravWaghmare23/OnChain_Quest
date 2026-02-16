import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionStatus } from "@/components/web3/TransactionStatus";
import { useStorageContract } from "@/hooks/useStorageContract";
import { Loader } from "lucide-react";

export const StorageContractDemo = () => {
  const { isConnected } = useAccount();
  const { storeNumber, getNumber, storedNumber, loading, success, error, txHash, txUrl, resetState, isReady } = useStorageContract();
  const [inputValue, setInputValue] = useState("");
  const [fetching, setFetching] = useState(false);

  const handleStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    await storeNumber(inputValue);
    setInputValue("");
  };

  const handleGetNumber = async () => {
    setFetching(true);
    await getNumber();
    setFetching(false);
  };

  if (!isConnected) {
    return (
      <Card className="border-2 border-gray-300 rounded-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold">💾 Storage Contract</CardTitle>
          <CardDescription>Connect wallet to interact</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Please connect your wallet first</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-400 rounded-none bg-blue-50">
      <CardHeader className="bg-blue-100 border-b-2 border-blue-400">
        <CardTitle className="text-lg font-bold text-blue-900">💾 Storage Contract</CardTitle>
        <CardDescription className="text-blue-700">Store and retrieve numbers on Shardeum</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {!isReady && (
          <div className="mb-4 p-3 bg-yellow-100 border-2 border-yellow-400 rounded-none">
            <p className="text-sm font-bold text-yellow-900">⚠️ Switch to Shardeum Sphinx testnet to use this feature</p>
          </div>
        )}

        {error && error.includes("HTTP") && (
          <div className="mb-4 p-3 bg-orange-100 border-2 border-orange-400 rounded-none">
            <p className="text-xs font-bold text-orange-900">ℹ️ RPC Connection Issue</p>
            <p className="text-xs text-orange-800 mt-1">The Shardeum RPC endpoint is experiencing issues. Gas estimation will use default values. Your transaction may still succeed!</p>
          </div>
        )}

        <TransactionStatus
          loading={loading}
          success={success}
          error={error}
          txHash={txHash}
          txUrl={txUrl}
          onDismiss={resetState}
        />

        <form onSubmit={handleStore} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-bold mb-2">Number to Store</label>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a number (0-999)"
              disabled={loading || !isReady}
              className="border-2 border-blue-300 rounded-none font-mono"
              min="0"
              max="999"
            />
          </div>
          <Button
            type="submit"
            disabled={!inputValue || loading || !isReady}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-none border-2 border-blue-400"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Storing...
              </>
            ) : (
              "⛓️ Store Number"
            )}
          </Button>
        </form>

        <Button
          onClick={handleGetNumber}
          disabled={loading || fetching || !isReady}
          variant="outline"
          className="w-full mt-4 border-2 border-blue-400 rounded-none font-bold hover:bg-blue-50"
        >
          {fetching ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Fetching...
            </>
          ) : (
            "🔍 Get Number"
          )}
        </Button>

        {storedNumber !== null && (
          <div className="mt-4 p-3 bg-blue-100 border-2 border-blue-400 rounded-none">
            <p className="text-sm font-bold text-blue-900">Stored Number: {storedNumber.toString()}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
