import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { requestSolAirdrop } from "./lib/airdrop";

function Airdrop() {
  const pageRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!pageRef.current) return;

    const context = gsap.context(() => {
      gsap.from(pageRef.current!.children, {
        y: 36,
        opacity: 0,
        duration: 1.2,
        stagger: 0.16,
        ease: "bounce.out",
        clearProps: "all",
      });
    }, pageRef);

    return () => context.revert();
  }, []);
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
    if (!connected || !publicKey) {
      setError("Please connect your wallet first.");
      return;
    }

    const solAmount = Number(amount);

    if (
      !Number.isFinite(solAmount) ||
      solAmount <= 0 ||
      solAmount > 1
    ) {
      setError("Enter an amount between 0 and 1 SOL.");
      return;
    }

    try {
      setAirdropLoading(true);
      setError("");
      setSignature("");

      const txSignature = await requestSolAirdrop(
        connection,
        publicKey,
        solAmount
      );

      setSignature(txSignature);
      await refreshBalance();
    } catch (err) {
      console.error("Airdrop failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while requesting airdrop."
      );
    } finally {
      setAirdropLoading(false);
    }
  };

  return (
    <main ref={pageRef} className="mx-auto max-w-5xl px-5 pb-10 pt-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#241b35]">
            Airdrop
          </h1>
          <p className="mt-2 text-sm text-[#81788e]">
            Request test SOL directly to your Solana Devnet wallet.
          </p>
        </div>

        <span className="rounded-md border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
          SOLANA DEVNET
        </span>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#30263f]">
            Wallet Overview
          </h2>
          <span className="text-xs text-[#9990a5]">Account details</span>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#e9e3f2] bg-white shadow-sm">
          <div className="grid grid-cols-[180px_1fr] gap-4 border-b border-[#eeeaf5] px-5 py-4 text-sm">
            <span className="text-[#81788e]">Wallet Address</span>
            <span className="break-all font-mono text-[#383044]">
              {publicKey?.toBase58() ?? "Not connected"}
            </span>
          </div>

          <div className="grid grid-cols-[180px_1fr] gap-4 border-b border-[#eeeaf5] px-5 py-4 text-sm">
            <span className="text-[#81788e]">Balance</span>
            <span className="font-mono font-medium text-[#241b35]">
              {balanceLoading
                ? "Loading..."
                : balance !== null
                  ? `${balance.toFixed(9)} SOL`
                  : "--"}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <span className="text-xs text-[#9990a5]">
              Network: Solana Devnet
            </span>

            <button
              onClick={refreshBalance}
              disabled={!connected || balanceLoading}
              className="text-sm font-medium text-purple-700 transition hover:text-purple-900 disabled:opacity-40"
            >
              {balanceLoading ? "Refreshing..." : "↻ Refresh balance"}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-[#30263f]">
          Request SOL
        </h2>

        <div className="max-w-xl rounded-lg border border-[#e9e3f2] bg-white p-5 shadow-sm">
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium text-[#81788e]"
          >
            Amount (SOL)
          </label>

          <div className="flex flex-wrap gap-3">
            <input
              id="amount"
              type="number"
              min="0.000000001"
              max="1"
              step="0.1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter SOL amount"
              className="min-w-0 flex-1 rounded-md border border-[#ded5ed] bg-white px-4 py-3 text-sm text-[#241b35] outline-none transition placeholder:text-[#aaa2b5] focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <button
              onClick={handleAirdrop}
              disabled={!connected || airdropLoading || balanceLoading}
              className="rounded-md bg-purple-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {airdropLoading ? "Processing..." : "Request Airdrop"}
            </button>
          </div>

          <p className="mt-3 text-xs text-[#9990a5]">
            Maximum request: 1 SOL per transaction.
          </p>

          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {signature && (
            <div className="mt-5 rounded-md border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-semibold text-purple-800">
                Airdrop confirmed
              </p>

              <p className="mt-2 break-all font-mono text-xs text-[#6b6078]">
                {signature}
              </p>

              <a
                href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium text-purple-700 hover:text-purple-900"
              >
                View transaction on Explorer →
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Airdrop;