"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Network = {
  name: string;
  endpoint: string;
  label: string;
};

export const NETWORKS = {
  MAINNET: {
    name: "mainnet-beta",
    endpoint: "https://api.mainnet-beta.solana.com",
    label: "Solana Mainnet",
  },
  DEVNET: {
    name: "devnet",
    endpoint: "https://api.devnet.solana.com",
    label: "Solana Devnet",
  },
  TESTNET: {
    name: "testnet",
    endpoint: "https://api.testnet.solana.com",
    label: "Solana Testnet",
  },
} as const;

type NetworkContextType = {
  network: Network;
  setNetwork: (network: Network) => void;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<Network>(NETWORKS.DEVNET);

  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextType {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}