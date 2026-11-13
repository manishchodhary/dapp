import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { ConfirmedSignatureInfo } from "@solana/web3.js";

function Account() {
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
  const [owner, setOwner] = useState("--");
  const [dataSize, setDataSize] = useState<number | null>(null);
  const [executable, setExecutable] = useState<boolean | null>(null);
  const [transactions, setTransactions] = useState<ConfirmedSignatureInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("History");

  const refreshAccount = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      setOwner("--");
      setDataSize(null);
      setExecutable(null);
      setTransactions([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [lamports, accountInfo, history] = await Promise.all([
        connection.getBalance(publicKey, "confirmed"),
        connection.getAccountInfo(publicKey, "confirmed"),
        connection.getSignaturesForAddress(
          publicKey,
          { limit: 20 },
          "confirmed"
        ),
      ]);

      setBalance(lamports / LAMPORTS_PER_SOL);
      setOwner(accountInfo?.owner.toBase58() ?? "--");
      setDataSize(accountInfo?.data.length ?? 0);
      setExecutable(accountInfo?.executable ?? false);
      setTransactions(history);
    } catch (err) {
      console.error("Account fetch failed:", err);
      setError("Unable to load account information.");
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    refreshAccount();
  }, [refreshAccount]);

  const copyAddress = async () => {
    if (!publicKey) return;

    try {
      await navigator.clipboard.writeText(publicKey.toBase58());
    } catch {
      setError("Unable to copy wallet address.");
    }
  };

  const formatTime = (timestamp: number | null | undefined) => {
    if (!timestamp) return "--";

    return (
      new Date(timestamp * 1000).toLocaleString("en-US", {
        timeZone: "UTC",
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }) + " UTC"
    );
  };

  const tabs = [
    "History",
    "Metadata",
    "Attributes",
    "Compression",
    "Tokens",
    "Domains",
  ];

  return (
    <main ref={pageRef} className="mx-auto max-w-5xl px-5 pb-10 pt-12">
      <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#241b35]">
            Account
          </h1>
          <p className="mt-2 text-sm text-[#81788e]">
            View wallet information and transaction activity.
          </p>
        </div>

        <span className="rounded-md border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
          SOLANA DEVNET
        </span>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#30263f]">Overview</h2>

          <button
            onClick={copyAddress}
            disabled={!connected}
            className="rounded-md border border-[#ded5ed] bg-white px-3 py-1.5 text-xs font-medium text-[#6b6078] transition hover:border-purple-300 hover:text-purple-700 disabled:opacity-40"
          >
            Copy Address
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#e9e3f2] bg-white shadow-sm">
          <div className="grid grid-cols-[200px_1fr] gap-4 border-b border-[#eeeaf5] px-4 py-4 text-sm">
            <span className="text-[#81788e]">Address</span>
            <span className="break-all font-mono text-[#383044]">
              {publicKey?.toBase58() ?? "Wallet not connected"}
            </span>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 border-b border-[#eeeaf5] px-4 py-4 text-sm">
            <span className="text-[#81788e]">Balance (SOL)</span>
            <span className="font-mono font-medium text-[#241b35]">
              {loading
                ? "Loading..."
                : balance !== null
                  ? balance.toFixed(9)
                  : "--"}
            </span>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 border-b border-[#eeeaf5] px-4 py-4 text-sm">
            <span className="text-[#81788e]">Allocated Data Size</span>
            <span className="text-[#383044]">
              {dataSize !== null ? `${dataSize} byte(s)` : "--"}
            </span>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 border-b border-[#eeeaf5] px-4 py-4 text-sm">
            <span className="text-[#81788e]">Assigned Program Id</span>
            <span className="break-all font-mono text-purple-700">
              {owner}
            </span>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 px-4 py-4 text-sm">
            <span className="text-[#81788e]">Executable</span>
            <span className="text-[#383044]">
              {executable === null ? "--" : executable ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-x-7 border-b border-[#e9e3f2]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 pb-4 text-sm transition ${
              activeTab === tab
                ? "border-purple-600 font-semibold text-purple-700"
                : "border-transparent text-[#81788e] hover:text-purple-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#30263f]">
            {activeTab === "History" ? "Transaction History" : activeTab}
          </h2>

          {activeTab === "History" && (
            <button
              onClick={refreshAccount}
              disabled={!connected || loading}
              className="rounded-md border border-[#ded5ed] bg-white px-3 py-2 text-xs font-medium text-[#6b6078] transition hover:border-purple-300 hover:text-purple-700 disabled:opacity-40"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
          )}
        </div>

        {!connected ? (
          <div className="rounded-lg border border-[#e9e3f2] bg-white px-5 py-14 text-center text-sm text-[#81788e]">
            Connect your wallet to view account information.
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>
        ) : activeTab === "History" ? (
          <div className="overflow-x-auto rounded-lg border border-[#e9e3f2] bg-white shadow-sm">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="border-b border-[#eeeaf5] bg-[#fbfaff] text-[11px] uppercase tracking-wide text-[#81788e]">
                <tr>
                  <th className="px-4 py-4 font-medium">
                    Transaction Signature
                  </th>
                  <th className="px-4 py-4 font-medium">Time</th>
                  <th className="px-4 py-4 font-medium">Block</th>
                  <th className="px-4 py-4 font-medium">Size (Bytes)</th>
                </tr>
              </thead>

              <tbody>
                {loading && transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-[#9990a5]">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-[#9990a5]">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr
                      key={tx.signature}
                      className="border-b border-[#eeeaf5] last:border-0 transition hover:bg-[#faf8ff]"
                    >
                      <td className="px-4 py-4">
                        <a
                          href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-purple-700 transition hover:text-purple-900 hover:underline"
                        >
                          {tx.signature.slice(0, 5)}...{tx.signature.slice(-5)}
                        </a>

                        <div className="mt-2">
                          <span
                            className={`rounded-md px-2 py-1 text-xs font-medium ${
                              tx.err === null
                                ? "bg-purple-50 text-purple-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {tx.err === null ? "Success" : "Failed"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-[#81788e]">
                        {formatTime(tx.blockTime)}
                      </td>

                      <td className="px-4 py-4 font-mono text-purple-700">
                        {tx.slot.toLocaleString("en-US")}
                      </td>

                      <td className="px-4 py-4 text-[#9990a5]">--</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-[#e9e3f2] bg-white px-5 py-14 text-center text-sm text-[#81788e]">
            {activeTab} information is not available for this account yet.
          </div>
        )}
      </section>
    </main>
  );
}

export default Account;