
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import * as IDL from "./idl.json";
import { PublicKey, Cluster, Connection } from "@solana/web3.js";
import { GreetSvm } from "./programtypes";
import {
  AnchorWallet,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useNetwork } from "./context/NetworkContext";


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
  const { network } = useNetwork();
  const testConnection = new Connection(network.endpoint)
  const wallet = useWallet();
  return new AnchorProvider(testConnection, wallet as AnchorWallet, {
    commitment: "confirmed",
  });
}