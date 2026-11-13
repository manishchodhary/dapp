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

const endpoint =
  "https://solana-devnet.g.alchemy.com/v2/alch_v9XSiAMzGmXAfBzwTA2jP";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div style={{ width: "100%", height: "600px", position: "relative" }}>
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
            >
              <App />
            </GradientASCII>
          </div>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>,
);
