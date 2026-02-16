import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionStatus } from "@/components/web3/TransactionStatus";
import { useNFTContract } from "@/hooks/useNFTContract";
import { Loader } from "lucide-react";

export const NFTMintDemo = () => {
  const { isConnected, address } = useAccount();
  const { mintHero, getBalance, nftBalance, loading, success, error, txHash, txUrl, resetState, isReady } = useNFTContract();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [fetching, setFetching] = useState(false);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientAddress || !metadataURI) return;
    await mintHero(recipientAddress, metadataURI);
    setRecipientAddress("");
    setMetadataURI("");
  };

  const handleGetBalance = async () => {
    setFetching(true);
    await getBalance();
    setFetching(false);
  };

  if (!isConnected) {
    return (
      <Card className="border-2 border-gray-300 rounded-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold">🎮 Hero NFT</CardTitle>
          <CardDescription>Connect wallet to mint NFTs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Please connect your wallet first</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-400 rounded-none bg-purple-50">
      <CardHeader className="bg-purple-100 border-b-2 border-purple-400">
        <CardTitle className="text-lg font-bold text-purple-900">🎮 Hero NFT Minter</CardTitle>
        <CardDescription className="text-purple-700">Mint Hero NFTs on Shardeum</CardDescription>
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

        <form onSubmit={handleMint} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-bold mb-2">Recipient Address</label>
            <Input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder={address || "0x..."}
              disabled={loading || !isReady}
              className="border-2 border-purple-300 rounded-none font-mono text-xs"
            />
            {address && !recipientAddress && (
              <p className="text-xs text-gray-600 mt-1">📋 Click input to use your address: {address.slice(0, 10)}...</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Metadata URI</label>
            <Input
              type="text"
              value={metadataURI}
              onChange={(e) => setMetadataURI(e.target.value)}
              placeholder="ipfs://QmXx... or https://example.com/metadata.json"
              disabled={loading || !isReady}
              className="border-2 border-purple-300 rounded-none font-mono text-xs"
            />
            <p className="text-xs text-gray-600 mt-1">JSON metadata URL (max 2000 characters)</p>
          </div>

          <Button
            type="submit"
            disabled={!recipientAddress || !metadataURI || loading || !isReady}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-none border-2 border-purple-400"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Minting...
              </>
            ) : (
              "✨ Mint Hero NFT"
            )}
          </Button>
        </form>

        <Button
          onClick={handleGetBalance}
          disabled={loading || fetching || !isReady}
          variant="outline"
          className="w-full mt-4 border-2 border-purple-400 rounded-none font-bold hover:bg-purple-50"
        >
          {fetching ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Fetching...
            </>
          ) : (
            "🔍 Check Balance"
          )}
        </Button>

        {nftBalance !== null && (
          <div className="mt-4 p-3 bg-purple-100 border-2 border-purple-400 rounded-none">
            <p className="text-sm font-bold text-purple-900">👾 You own <span className="text-lg">{nftBalance.toString()}</span> Hero NFT(s)</p>
          </div>
        )}

        {address && (
          <div className="mt-4 p-3 bg-gray-100 border-2 border-gray-300 rounded-none">
            <p className="text-xs font-mono text-gray-700">Connected: {address}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
