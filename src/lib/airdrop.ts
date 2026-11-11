import {Connection ,PublicKey,LAMPORTS_PER_SOL} from "@solana/web3.js"

export async function requestSolAirdrop(
  connection: Connection,
  publicKey: PublicKey,
  amount: number
) {
     if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter a valid SOL amount");
  }

  if (amount * LAMPORTS_PER_SOL > Number.MAX_SAFE_INTEGER) {
    throw new Error("Amount is too large");
  }
  const lamports = Math.round(amount * LAMPORTS_PER_SOL);
  const signature = await connection.requestAirdrop(
    publicKey,
    lamports
  )

  const confirmation = await connection.confirmTransaction(
    signature,
    "confirmed"
  );
    if (confirmation.value.err) {
    throw new Error("Airdrop transaction failed");
  }

  return signature;
}