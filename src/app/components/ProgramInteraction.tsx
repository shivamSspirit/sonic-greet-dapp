"use client";

import { Cluster, PublicKey } from "@solana/web3.js";
import { useMemo, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNetwork } from "../context/NetworkContext";
import { getGreetSVMProgram, getGreetSvmProgramId, useAnchorProvider } from "../programsetup";

export type GreetAccountData = {
  user: PublicKey;
  greet: string;
};

export function useGreetSVMProgram() {
  const { network } = useNetwork();
  const provider = useAnchorProvider();
  const { publicKey } = useWallet();

  const programId = useMemo(
    () => getGreetSvmProgramId(network.name as Cluster),
    [network.name]
  );
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
      if (!publicKey || !greetPDAAccount) {
        throw new Error("Wallet not connected");
      }
      const tx = await program.methods
        .initialize(greet)
        .accounts({
          user: publicKey,
       //   greetAccount: greetPDAAccount,
        })
        .rpc();
      return tx;
    },
    [publicKey, greetPDAAccount, program]
  );

  const fetchGreetAccount = useCallback(async (): Promise<GreetAccountData | null> => {
    if (!greetPDAAccount) return null;
    try {
      return await program.account.greetAccount.fetch(greetPDAAccount);
    } catch (error) {
      console.error("Failed to fetch greet account:", error);
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