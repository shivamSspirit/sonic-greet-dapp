"use client";

import { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { NetworkProvider, useNetwork } from "../context/NetworkContext";

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NetworkProvider>
      <AppWalletProviderInner>{children}</AppWalletProviderInner>
    </NetworkProvider>
  );
}

function AppWalletProviderInner({ children }: { children: React.ReactNode }) {
  const { network } = useNetwork();

  const walletAdapterNetwork = useMemo(() => {
    switch (network.name) {
      case "mainnet-beta":
        return WalletAdapterNetwork.Mainnet;
      case "devnet":
        return WalletAdapterNetwork.Devnet;
      case "testnet":
        return WalletAdapterNetwork.Testnet;
      default:
        return WalletAdapterNetwork.Devnet;
    }
  }, [network.name]);

  const endpoint = useMemo(
    () => clusterApiUrl(walletAdapterNetwork),
    [walletAdapterNetwork]
  );

  const wallets = useMemo(() => [], [walletAdapterNetwork]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}