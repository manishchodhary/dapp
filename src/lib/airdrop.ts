import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export async function requestSolAirdrop(
  connection: Connection,
  publicKey: PublicKey,
  amount: number,
) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter a valid SOL amount");
  }

  if (amount * LAMPORTS_PER_SOL > Number.MAX_SAFE_INTEGER) {
    throw new Error("Amount is too large");
  }
  const lamports = Math.round(amount * LAMPORTS_PER_SOL);
  const signature = await connection.requestAirdrop(publicKey, lamports);

for (let i = 0; i < 30; i++) {
  const result = await connection.getSignatureStatuses(
    [signature],
    { searchTransactionHistory: true }
  );

  const status = result.value[0];

  if (status?.err) {
    throw new Error("Airdrop transaction failed");
  }

  if (
    status?.confirmationStatus === "confirmed" ||
    status?.confirmationStatus === "finalized"
  ) {
    return signature;
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));
}

throw new Error(`Confirmation pending. Signature: ${signature}`);
}
