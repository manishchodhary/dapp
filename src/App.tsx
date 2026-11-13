import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Airdrop from "./Airdrop";
import Account from "./Account";
import GooeyNav from "./components/GooeyNav";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeIndex = location.pathname === "/account" ? 1 : 0;

  return (
    <header className="sticky top-0 z-40 mx-auto w-[calc(100%-2rem)] max-w-6xl rounded-2xl border border-purple-200/80 bg-white/75 shadow-sm shadow-purple-100/40 backdrop-blur-xl">
      <div className="flex min-h-[68px] w-full flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 py-2 sm:h-[68px] sm:flex-nowrap sm:px-6 sm:py-0">
        <NavLink
          to="/"
          className="brand shrink-0 text-xl font-bold tracking-tight text-[#241b35]"
        >
          Lamport<span className="text-purple-600">.</span>
        </NavLink>

        <div className="order-2 ml-auto shrink-0 sm:order-3 sm:ml-0">
          <WalletMultiButton />
        </div>

        <div className="order-3 flex basis-full justify-center sm:order-2 sm:basis-auto sm:ml-auto">
          <GooeyNav
            items={[{ label: "Airdrop" }, { label: "Account" }]}
            activeIndex={activeIndex}
            onChange={(index) => navigate(index === 0 ? "/" : "/account")}
            theme="light"
            color="#7c3aed"
            activeTextColor="#ffffff"
            colors={["#a855f7", "#7c3aed"]}
            size="md"
            frame={false}
            animationTime={650}
            particleCount={12}
            spread={42}
            gooeyness={0.55}
            wobble={0.55}
            hoverEffect
          />
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-transparent text-[#241b35]">
        <Navbar />

        <Routes>
          <Route path="/" element={<Airdrop />} />
          <Route path="/account" element={<Account />} />
        </Routes>

        <footer className="mt-16 border-t border-purple-100 bg-white/50 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-5 py-6">
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
