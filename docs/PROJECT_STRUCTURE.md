# Project Structure

This document describes the current repository layout and the intended direction for organizing future Lamport features.

## Current layout

```text
dapp/
├── public/                 # Static files copied to the build output
├── src/
│   ├── assets/             # Images and imported static assets
│   ├── components/         # Reusable UI components
│   ├── lib/                # Shared helpers and Solana utilities
│   ├── Account.tsx         # Account overview and transaction history page
│   ├── Airdrop.tsx         # Devnet airdrop page
│   ├── App.tsx             # Routing, navigation, and application layout
│   ├── App.css             # App-level styles
│   ├── index.css           # Global styles
│   └── main.tsx            # React bootstrap and Solana providers
├── docs/                   # Project documentation
├── .env.example            # Environment variable template
├── package.json            # Dependencies and scripts
├── tsconfig*.json          # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Directory responsibilities

| Path | Responsibility |
| --- | --- |
| `public/` | Files served directly without being imported by application code |
| `src/assets/` | Images, illustrations, and assets imported by components |
| `src/components/` | Reusable presentation components that are not tied to one page |
| `src/lib/` | Shared functions, helpers, and integrations such as Solana operations |
| `src/App.tsx` | Route definitions and shared page shell |
| `src/main.tsx` | Application entry point and provider setup |
| `docs/` | Architecture notes and contributor documentation |

## Suggested growth structure

As the app gains more pages and features, group page-specific code by feature rather than placing every page component directly under `src/`.

```text
src/
├── app/
│   ├── App.tsx
│   └── providers/
├── assets/
├── components/
│   ├── navigation/
│   └── ui/
├── features/
│   ├── account/
│   │   ├── components/
│   │   └── pages/
│   └── airdrop/
│       ├── components/
│       └── pages/
├── lib/
└── styles/
```

This is a future organizational target, not the current on-disk layout. Moving existing files into it should be done as a separate refactor with their imports and route references updated together, followed by a production build. The current documentation-only update intentionally leaves application files and imports untouched.

## Conventions

- Keep route-level screens inside their feature folder when feature organization is introduced.
- Keep reusable components independent of a single route.
- Keep Solana RPC and transaction helpers out of presentation components where practical.
- Keep environment files containing real credentials out of Git.
- Prefer clear, descriptive filenames and avoid duplicate utility modules.
