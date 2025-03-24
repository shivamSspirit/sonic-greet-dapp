"use client";

import { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import { NightlyWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletReadyState } from "@solana/wallet-adapter-base";

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
      case "mainnet":
        return WalletAdapterNetwork.Mainnet;
      case "testnet":
        return WalletAdapterNetwork.Testnet;
      default:
        return WalletAdapterNetwork.Testnet;
    }
  }, [network.name]);

  const endpoint = useMemo(
    () => clusterApiUrl(walletAdapterNetwork),
    [walletAdapterNetwork]
  );
  
  const wallets = useMemo(() => [new NightlyWalletAdapter()], [walletAdapterNetwork]);

  const supportedWalletNames = ["Backpack", "Nightly"];

  const filteredWallets = wallets.filter(
    (wallet:any) =>
      supportedWalletNames.includes(wallet.adapter?.name) &&
      wallet.readyState === WalletReadyState.Installed
  );


  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={filteredWallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}