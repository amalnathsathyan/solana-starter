import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../dev-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("3PSaL7kB7FCoT7ZpikoocdmiVhEmwwG2DsfZEJZm9oRw");

// Recipient address
const to = new PublicKey("berg7BKPHZWPiAdjpitQaWCfTELaKjQ6x7e9nDSu23d");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromATA = getOrCreateAssociatedTokenAccount(connection,keypair,mint,keypair.publicKey);

        // Get the token account of the toWallet address, and if it does not exist, create it
         const toATA = getOrCreateAssociatedTokenAccount(connection,keypair,mint,to);

        const amount = new BN('10000000');

        // Transfer the new token to the "toTokenAccount" we just created
        const transferTx = await transfer(connection,keypair,(await fromATA).address,(await toATA).address,keypair.publicKey,amount);
        console.log(`transfer successful:${transferTx}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();