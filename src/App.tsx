import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Airdrop from "./Airdrop";
import Account from "./Account";

function App() {
  return (
    <BrowserRouter>
   <div className="min-h-screen bg-transparent text-[#241b35]">
     <header className="sticky top-4 z-40 mx-auto mt-4 w-[calc(100%-2rem)] max-w-5xl rounded-2xl border border-purple-200/70 bg-white/75 shadow-lg shadow-purple-100/40 backdrop-blur-xl">
  <div className="flex h-16 items-center justify-between px-6">
    <NavLink
      to="/"
      className="text-xl font-bold tracking-tight text-[#241b35]"
    >
      Solscope<span className="text-purple-600">.</span>
    </NavLink>

    <div className="flex items-center gap-7">
      <nav className="flex items-center gap-6 text-sm">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `transition ${
              isActive
                ? "font-semibold text-purple-700"
                : "text-[#81788e] hover:text-purple-700"
            }`
          }
        >
          Airdrop
        </NavLink>

        <NavLink
          to="/account"
          className={({ isActive }) =>
            `transition ${
              isActive
                ? "font-semibold text-purple-700"
                : "text-[#81788e] hover:text-purple-700"
            }`
          }
        >
          Account
        </NavLink>
      </nav>

      <WalletMultiButton />
    </div>
  </div>
</header>

        <Routes>
          <Route path="/" element={<Airdrop />} />
          <Route path="/account" element={<Account />} />
        </Routes>

     <footer className="mt-16 border-t border-purple-100 bg-white/50 backdrop-blur-md">
          <div className="mx-auto max-w-5xl px-5 py-6">
            <p className="text-center text-xs text-[#9990a5]">
              LAMPORT · Solana Devnet
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;