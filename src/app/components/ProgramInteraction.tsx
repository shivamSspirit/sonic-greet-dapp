"use client";

import { Cluster, PublicKey } from "@solana/web3.js";
import { useMemo, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNetwork } from "../context/NetworkContext";
import { getGreetSVMProgram, getGreetSvmProgramId, useAnchorProvider } from "../programsetup";

export type GreetAccountData = {
  user: PublicKey;
  greet: string;
  bump?: number;
};

export function useGreetSVMProgram() {
  const { network } = useNetwork();
  const provider = useAnchorProvider();
  const { publicKey } = useWallet();

  const programId = useMemo(() => getGreetSvmProgramId(network.name as Cluster), [network.name]);
  const program = useMemo(() => getGreetSVMProgram(provider), [provider]);

  const [greetPDAAccount, greetPDABump] = useMemo(() => {
    if (!publicKey) return [null, null];
    return PublicKey.findProgramAddressSync(
      [Buffer.from("data"), publicKey.toBuffer()],
      programId
    );
  }, [publicKey, programId]);

  const initializeGreetAccount = useCallback(
    async (greet: string): Promise<string> => {
      if (!publicKey || !greetPDAAccount || !provider) {
        throw new Error("Wallet or provider not connected");
      }
      console.log("[useGreetSVMProgram] Initializing with greet:", greet);
      const txSignature = await program.methods
        .initialize(greet)
        .accounts({
         // greetAccount: greetPDAAccount, // Explicitly include PDA
          user: publicKey,
        })
        .rpc({ commitment: "confirmed" });
      console.log("[useGreetSVMProgram] Tx confirmed:", txSignature);
      return txSignature;
    },
    [publicKey, greetPDAAccount, program, provider]
  );

  const fetchGreetAccount = useCallback(async (): Promise<GreetAccountData | null> => {
    if (!greetPDAAccount) return null;
    try {
      const data = await program.account.greetAccount.fetch(greetPDAAccount);
      console.log("[useGreetSVMProgram] Fetched data:", data);
      return data;
    } catch (error) {
      console.error("[useGreetSVMProgram] Fetch failed:", error);
      return null;
    }
  }, [greetPDAAccount, program]);

  return {
    greetPDAAccount,
    greetPDABump,
    initializeGreetAccount,
    fetchGreetAccount,
    program,
    publicKey,
    programId,
  };
}