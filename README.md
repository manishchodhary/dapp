# Lamport

A lightweight Solana Devnet dashboard for connecting a wallet, requesting test SOL, and inspecting on-chain account information.

<p align="center">
  <strong>Explore your Solana wallet on Devnet.</strong>
</p>

## Overview

Lamport is a client-side dApp built around the Solana Devnet. It provides a simple interface for common wallet and account-inspection tasks while keeping the interface focused and minimal.

## Features

- **Wallet connection** — connect a supported wallet through the Solana Wallet Adapter.
- **Devnet airdrop** — request test SOL and view the resulting transaction signature when confirmed.
- **Faucet guidance** — provides a link to the official Solana Faucet when the configured RPC faucet is unavailable.
- **Account overview** — inspect the connected wallet address, SOL balance, account data size, owner program, and executable status.
- **Transaction history** — view recent signatures associated with the connected wallet.
- **Animated interface** — animated navigation and a Gradient ASCII background.

> Lamport currently targets **Solana Devnet**. Test SOL has no mainnet value.

## Tech stack

| Area | Technologies |
| --- | --- |
| UI | React 19, TypeScript |
| Build tooling | Vite |
| Styling | Tailwind CSS |
| Solana | Solana Web3.js, Solana Wallet Adapter |
| Animation | GSAP |
| Routing | React Router |
| UI utilities | Base UI, Lucide React |

## Getting started

### Requirements

- Node.js (use a current version compatible with the installed Vite release)
- npm
- A Solana wallet browser extension configured for Devnet

### 1. Clone the repository

```bash
git clone https://github.com/manishchodhary/dapp.git
cd dapp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the Solana RPC endpoint

Create a local environment file:

```bash
cp .env.example .env.local
```

Set `VITE_SOLANA_RPC_URL` in `.env.local` to a complete Solana Devnet RPC URL:

```env
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
```

You can replace the example endpoint with an RPC provider URL. Keep `.env.local` private and restart the development server after changing it.

**Important:** Vite exposes variables prefixed with `VITE_` in the browser bundle. An RPC URL containing an API key is therefore visible to users. Use a restricted key with domain/origin restrictions, usage limits, and only the required methods. Do not put server-side secrets in a `VITE_*` variable.

### 4. Start the development server

```bash
npm run dev
```

Vite prints the local development URL in the terminal.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run TypeScript project builds and create the production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

The repository is kept intentionally simple. Page-level components remain in `src/` and reusable visual components, shared utilities, and static assets have their own directories.

```text
dapp/
├── public/                 # Static files served as-is
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/             # Imported images and assets
│   ├── components/         # Reusable visual components
│   │   ├── GooeyNav.tsx
│   │   └── GradientASCII.tsx
│   ├── lib/                # Shared helpers and Solana operations
│   │   ├── airdrop.ts
│   │   └── utils.ts
│   ├── Account.tsx         # Wallet account overview and history
│   ├── Airdrop.tsx         # Devnet SOL airdrop page
│   ├── App.tsx             # App routes, navigation, and layout
│   ├── App.css
│   ├── index.css
│   └── main.tsx            # React entry point and Solana providers
├── .env.example            # Example environment configuration
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

For a short explanation of the responsibilities and conventions of these folders, see [Project Structure](docs/PROJECT_STRUCTURE.md).

## Network

Lamport is configured for **Solana Devnet**. Make sure your connected wallet is also set to Devnet when testing wallet balances, airdrops, and transaction history.

If the RPC provider does not support airdrop requests, use the [official Solana Faucet](https://faucet.solana.com/) to request Devnet SOL.

## Deployment

The project can be deployed as a Vite static site on Vercel or another static hosting provider.

For Vercel:

1. Import this GitHub repository.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add `VITE_SOLANA_RPC_URL` under the project's environment variables.
5. Redeploy after changing environment variables.

Remember that `VITE_*` values are public in the client bundle.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Keep changes focused and test with `npm run build`.
4. Open a pull request describing the change.

## License

No license has been specified yet. All rights remain with the repository owner unless a license is added.
