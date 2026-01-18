import wallet from "../dev-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader({ address: "https://devnet.irys.xyz" }));
umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    const image = await readFile(
      "/Users/amalnathsathyan/Documents/trycatchblock/learning/turbin3/turbin3-Q1-26/solana-starter/ts/generug.png",
    );

    //2. Convert image to generic file.
    const file = createGenericFile(image, "generug.png", {
      contentType: "image/png",
    });

    //3. Upload image
    const [myUri] = await umi.uploader.upload([file]);
    console.log("Your image URI: ", myUri);
    // Your image URI:  https://gateway.irys.xyz/8T4E6oriR4ByCiZVhbDk4Y2AWBpBeXh7XZHChogXh7cp
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
