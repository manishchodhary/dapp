
import { useEffect, useState } from "react";

import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { requestSolAirdrop } from "./lib/airdrop";

function App() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const [amount, setAmount] = useState("1");
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");

  async function getBalance() {
    if (!publicKey) return;

    const lamports = await connection.getBalance(
      publicKey,
      "confirmed"
    );

    setBalance(lamports / LAMPORTS_PER_SOL);
  }

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    getBalance().catch(console.error);
  }, [publicKey, connection]);

  async function handleAirdrop() {
    if (!publicKey) return;

    const solAmount = Number(amount);

    if (!Number.isFinite(solAmount) || solAmount <= 0) {
      setMessage("Enter a valid SOL amount");
      return;
    }

    setLoading(true);
    setMessage("");
    setSignature("");

    try {
      const txSignature = await requestSolAirdrop(
        connection,
        publicKey,
        solAmount
      );

      setSignature(txSignature);
      setMessage("Airdrop successful!");

      await getBalance();
    } catch (error) {
      setMessage(
        error instanceof Error ? "Airdrop failed" : ""
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#101014] text-white flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-[#1c1c24] border border-[#30303a] rounded-2xl p-8 space-y-6">

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            SOL Airdrop
          </h1>

          <p className="text-gray-400">
            Get free SOL on Solana Devnet
          </p>
        </div>

        <div className="flex justify-center">
          <WalletMultiButton />
        </div>

        {connected && (
          <>
            <div className="bg-[#272731] rounded-xl p-5 text-center">
              <p className="text-gray-400 text-sm">
                Your Balance
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {balance === null
                  ? "Loading..."
                  : `${balance.toFixed(4)} SOL`}
              </h2>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-400">
                Amount in SOL
              </label>

              <input
                type="number"
                min="0.000000001"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#272731] border border-[#393944] rounded-xl p-4 outline-none focus:border-[#ab9ff2]"
                placeholder="Enter amount"
              />

              <button
                onClick={handleAirdrop}
                disabled={loading}
                className="w-full bg-[#ab9ff2] hover:bg-[#9888e8] disabled:opacity-50 text-black font-semibold rounded-xl p-4 transition"
              >
                {loading
                  ? "Processing..."
                  : "Request Airdrop"}
              </button>
            </div>
          </>
        )}

        {message && (
          <div className="bg-[#272731] rounded-xl p-4 text-sm break-all ">
            {message}
          </div>
        )}

        {signature && (
          <a
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-[#ab9ff2] text-sm underline"
          >
            View Transaction on Solana Explorer
          </a>
        )}

        <p className="text-center text-xs text-gray-500">
          Network: Solana Devnet
        </p>

      </div>
    </div>
  );
}

export default App;
