"use client";

import { WalletReadyState } from "@solana/wallet-adapter-base";
import {
  WalletProvider as SolanaWalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useState } from "react";
import WalletModal from "./CustomWalletModal";


export function WalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { wallet, wallets, publicKey, disconnect } = useWallet();

  const supportedWalletNames = ["Backpack", "Nightly"];
  const filteredWallets = wallets.filter(
    (wallet) =>
      supportedWalletNames.includes(wallet.adapter.name) &&
      wallet.readyState === WalletReadyState.Installed
  );

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  if (publicKey) {
    return (
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 flex items-center gap-2"
        >
          {wallet?.adapter.icon && (
            <img src={wallet.adapter.icon} alt="Wallet Icon" className="w-6 h-6 rounded-full" />
          )}
          <span className="text-xs">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
          <svg
            className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-xl">
            <button
              onClick={() => {
                disconnect();
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-600"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  if (filteredWallets.length > 0) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-gray-700 rounded-full hover:bg-gray-600"
        >
          Connect Wallet
        </button>
        <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }


  return (
    <>
      <a
        href="https://www.backpack.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-2 bg-gray-700 rounded-full hover:bg-gray-600"
      >
        Install Backpack
      </a>
    </>
  )




}