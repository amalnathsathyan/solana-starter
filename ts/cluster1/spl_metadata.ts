import wallet from "../dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("3PSaL7kB7FCoT7ZpikoocdmiVhEmwwG2DsfZEJZm9oRw")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint: mint,
            mintAuthority: signer,
            payer: signer,
            updateAuthority:signer,
        }

        let data: DataV2Args = {
            name:"COOKIES",
            symbol:"COOKIES",
            uri:"https://ipfs.io/ipfs/bafkreihvc3gd3lolfb4vdrqwgwnedl4jwihh5rhbsca5hxdlq56iivsxj4",
            sellerFeeBasisPoints:0,
            creators:null,
            collection:null,
            uses:null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data: data,
            isMutable: false,
            collectionDetails:null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
        //tx sig : 3ryjGR3g2T8jA6vB8x4Qcfjmof1cc1vEEmvMj1jtUrhg8198xhSfvHqcXyCV8UkwNxZWHrCNEUMHDJJoVtoq2Y9v
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
