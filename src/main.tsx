import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";
import "./index.css";
import GradientASCII from "./components/GradientASCII";

const endpoint = import.meta.env.VITE_SOLANA_RPC_URL?.trim();

if (!endpoint) {
  throw new Error(
    "Missing VITE_SOLANA_RPC_URL. Add it to .env.local in the project root and restart the Vite server."
  );
}

try {
  const rpcUrl = new URL(endpoint);

  if (rpcUrl.protocol !== "https:" && rpcUrl.protocol !== "http:") {
    throw new Error("RPC URL must start with http:// or https://");
  }
} catch {
  throw new Error(
    "Invalid VITE_SOLANA_RPC_URL. Provide a complete RPC URL starting with https://."
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="relative min-h-screen">
            <div className="pointer-events-none fixed inset-0 z-0">
              <GradientASCII
                colors={["#a855f7", "#e8f0ff", "#a855f7", "#7c3aed"]}
                shape="pinch"
                characters=" =+xX0S8#@"
                cellSize={18}
                density={0.8}
                glyphOpacity={0.85}
                glow={0.2}
                depthOfField={0}
                flicker={0.2}
                softness={0.5}
                scale={1}
                flow={0.5}
                speed={1}
                gradientOpacity={0.9}
                grain={0.08}
                variation={0}
                mouseInteraction
                scrambleRadius={0.1}
                clickEffect="burst"
                intro
                lightMode
              ></GradientASCII>
            </div>
            <div className="relative z-10">
              {" "}
              <App />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>,
);
