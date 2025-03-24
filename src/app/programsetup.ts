import { Program, AnchorProvider } from "@coral-xyz/anchor";
import * as IDL from "./idl.json";
import { PublicKey, Cluster } from "@solana/web3.js";
import { GreetSvm } from "./programtypes";
import {
  AnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

export { IDL };
export type { GreetSvm };

export const greetSvmProgramId = new PublicKey(
  "HAnmxVnFWCuQJ5jfYTmKSeiz1hwj25R2cDWps8rs6sGp"
);

export function getGreetSVMProgram(provider: AnchorProvider): Program<GreetSvm> {
  return new Program(IDL as GreetSvm, provider);
}

export function getGreetSvmProgramId(cluster: Cluster): PublicKey {
  switch (cluster) {
    case "devnet":
    case "testnet":
    case "mainnet-beta":
      return greetSvmProgramId;
    default:
      return greetSvmProgramId;
  }
}

export function useAnchorProvider(): AnchorProvider {
  const { connection } = useConnection();
  const wallet = useWallet();
  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: "confirmed",
  });
}