import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { requestSolAirdrop } from "./lib/airdrop";

function App() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const [balance, setBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState("1");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [airdropLoading, setAirdropLoading] = useState(false);
  const [error, setError] = useState("");
  const [signature, setSignature] = useState("");

  const refreshBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    try {
      setBalanceLoading(true);

      const lamports = await connection.getBalance(publicKey, "confirmed");

      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error("Balance fetch failed:", err);
      setError("Unable to fetch wallet balance.");
    } finally {
      setBalanceLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  const handleAirdrop = async () => {
    if (!publicKey || !connected) {
      setError("Please connect your wallet first.");
      return;
    }

    const solAmount = Number(amount);

    if (!Number.isFinite(solAmount) || solAmount <= 0) {
      setError("Please enter a valid SOL amount.");
      return;
    }

    try {
      setAirdropLoading(true);
      setError("");
      setSignature("");

      const txSignature = await requestSolAirdrop(
        connection,
        publicKey,
        solAmount,
      );

      setSignature(txSignature);

      await refreshBalance();
    } catch (err) {
      console.error("Airdrop failed:", err);
      console.dir(err, { depth: null });

      if (err && typeof err === "object") {
        console.log("Error data:", "data" in err ? err.data : null);
        console.log("Error logs:", "logs" in err ? err.logs : null);
      }

      setError(err instanceof Error ? err.message : "Airdrop failed");
    } finally {
      setAirdropLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141419] p-6 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Solana Airdrop</h1>
          <p className="mt-2 text-sm text-gray-400">
            Request Devnet SOL directly to your wallet.
          </p>
        </div>

        <div className="mb-6 flex justify-center">
          <WalletMultiButton />
        </div>

        {connected && publicKey && (
          <div className="mb-6 rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs text-gray-400">Connected Wallet</p>

            <p className="mt-1 break-all text-sm text-purple-400">
              {publicKey.toBase58()}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Wallet Balance</p>

                <p className="mt-1 text-2xl font-semibold">
                  {balanceLoading
                    ? "Loading..."
                    : balance !== null
                      ? `${balance.toFixed(4)} SOL`
                      : "--"}
                </p>
              </div>

              <button
                onClick={refreshBalance}
                disabled={balanceLoading}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 disabled:opacity-50"
              >
                {balanceLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm text-gray-300">
            Amount (SOL)
          </label>

          <input
            id="amount"
            type="number"
            min="0.000000001"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter SOL amount"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-purple-500"
          />
        </div>

        <button
          onClick={handleAirdrop}
          disabled={!connected || airdropLoading || balanceLoading}
          className="w-full rounded-xl bg-purple-600 py-3 font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {airdropLoading ? "Processing Airdrop..." : "Request Airdrop"}
        </button>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {signature && (
          <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
            <p className="font-medium text-green-400">Airdrop confirmed!</p>

            <p className="mt-2 break-all text-xs text-gray-400">{signature}</p>

            <a
              href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-purple-400 hover:text-purple-300"
            >
              View Transaction on Solana Explorer →
            </a>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-gray-500">
          Connected to Solana Devnet
        </p>
      </div>
    </main>
  );
}

export default App;
