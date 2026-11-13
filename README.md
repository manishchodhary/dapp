# Lamport

A Solana Devnet dApp built with React, TypeScript, Vite, and the Solana wallet adapter.

## RPC configuration

The app uses the public Solana Devnet RPC endpoint by default. To use an RPC provider, copy `.env.example` to `.env.local` and set `VITE_SOLANA_RPC_URL` to your provider endpoint.

```bash
cp .env.example .env.local
```

Restart the Vite development server after changing environment variables.

**Security:** Vite exposes every `VITE_*` variable in the browser bundle. Do not put an unrestricted or private RPC credential in this variable. For a browser-based app, use an RPC key restricted to your deployed domain and allowed methods, with rate limits enabled. For stronger protection, route RPC traffic through a backend proxy and keep the provider credential server-side. Rotate any key that has already been committed publicly.

## Development

```bash
npm install
npm run dev
```
