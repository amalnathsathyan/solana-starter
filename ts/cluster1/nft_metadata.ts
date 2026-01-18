import wallet from "../dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://gateway.irys.xyz/8T4E6oriR4ByCiZVhbDk4Y2AWBpBeXh7XZHChogXh7cp"
        const metadata = {
            name: "RUG-RUG",
            symbol: "RUGY",
            description: "Huge Rug",
            image: image,
            attributes: [
                {trait_type: 'rug-type', value: 'gene'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
        // Your metadata URI:  https://gateway.irys.xyz/6abobGpNC5p1E8LKWxoxuj76LtotJFAjgyDqqPT2FMe8
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
