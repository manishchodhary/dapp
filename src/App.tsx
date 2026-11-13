import { useLayoutEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import gsap from "gsap";
import Airdrop from "./Airdrop";
import Account from "./Account";

function App() {
  const navbarRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!navbarRef.current) return;

    const context = gsap.context(() => {
      gsap.from(navbarRef.current, {
        y: -36,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "all",
      });
    }, navbarRef);

    return () => context.revert();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-transparent text-[#241b35]">
        <header
          ref={navbarRef}
          className="sticky top-0 z-40 w-full rounded-b-2xl border-x border-b border-t border-purple-200/80 bg-white/75 shadow-sm shadow-purple-100/40 backdrop-blur-xl"
        >
          <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
            <NavLink
              to="/"
              className="shrink-0 text-xl font-bold tracking-tight text-[#241b35]"
            >
              Solscope<span className="text-purple-600">.</span>
            </NavLink>

            <div className="flex items-center gap-4 sm:gap-8">
              <nav className="flex items-center gap-4 text-sm sm:gap-7">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `transition-colors duration-200 ${
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
                    `transition-colors duration-200 ${
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
