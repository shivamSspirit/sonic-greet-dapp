"use client";

import { useState } from "react";
import { useNetwork, NETWORKS } from "../context/NetworkContext";


export function NetworkDropdown() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { network, setNetwork } = useNetwork();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleNetworkChange = (selectedNetwork: typeof NETWORKS[keyof typeof NETWORKS]) => {
    setNetwork(selectedNetwork);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 flex items-center gap-2"
      >
        <span>{network.label}</span>
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
          {Object.values(NETWORKS).map((net) => (
            <button
              key={net.name}
              onClick={() => handleNetworkChange(net)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-600 ${
                network.name === net.name ? "bg-gray-600" : ""
              }`}
            >
              {net.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}