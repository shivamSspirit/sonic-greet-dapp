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
  "97uCKFPMDU4S4DQmNwu7BQAYCCFM5fMBms7zk71uJeib"
);

export function getGreetSVMProgram(provider: AnchorProvider): Program<GreetSvm> {
  return new Program(IDL as GreetSvm, provider);
}

export function getGreetSvmProgramId(cluster: Cluster): PublicKey {
  switch (cluster) {
    case "testnet":
      return greetSvmProgramId;
    case "devnet":
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