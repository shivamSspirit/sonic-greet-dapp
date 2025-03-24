"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useNetwork } from "../context/NetworkContext";


export default function FetchWalletInfo() {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const { publicKey } = useWallet();
  const { network } = useNetwork();

  useEffect(() => {
    if (!publicKey) {
      setWalletBalance(null);
      return;
    }

    const connection = new Connection(network.endpoint, "processed");
    const fetchBalance = async () => {
      try {
        const balance = await connection.getBalance(publicKey);
        setWalletBalance(balance);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        setWalletBalance(null);
      }
    };
    fetchBalance();
  }, [publicKey, network.endpoint]);

  if (!publicKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg">
        <p className="text-center text-gray-400">Wallet not connected</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Wallet Info</h2>
      <div className="flex-1 space-y-4">
        <div>
          <p className="text-sm text-gray-400">Public Key</p>
          <p className="text-sm font-mono break-all">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Balance</p>
          <p className="text-lg font-bold">
            {walletBalance !== null
              ? `${(walletBalance / LAMPORTS_PER_SOL).toFixed(4)} SOL`
              : "Loading..."}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Network</p>
          <p className="text-md font-semibold">{network.label}</p>
        </div>
      </div>
    </div>
  );
}