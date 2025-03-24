"use client";

import { useEffect, useState } from "react";
import { useGreetSVMProgram } from "./ProgramInteraction";
import { useRefresh } from "../context/RefreshContext";

export default function GreetingCard() {
  const { greetPDAAccount, fetchGreetAccount, publicKey } = useGreetSVMProgram();
  const { refreshTrigger } = useRefresh();
  const [greetData, setGreetData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!greetPDAAccount || !publicKey) {
      console.log("[CounterCard] Missing greetPDAAccount or publicKey");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchGreetAccount();
        console.log("[CounterCard] Fetch result:", data);
        setGreetData(data);
      } catch (error) {
        console.error("[CounterCard] Fetch error:", error);
      }
    };

    // Initial fetch
    setIsLoading(true);
    fetchData();

    // Poll for data
    const pollInterval = setInterval(async () => {
      console.log("[CounterCard] Polling...");
      await fetchData();
      if (greetData?.greet) { // Stop when greet is non-empty
        clearInterval(pollInterval);
        setIsLoading(false);
        console.log("[CounterCard] Data found, polling stopped");
      }
    }, 2000);

    // Timeout after 20s (Sonic testnet can be slow)
    const timeoutId = setTimeout(() => {
      clearInterval(pollInterval);
      setIsLoading(false);
      console.log("[CounterCard] Timeout reached");
    }, 20000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, [greetPDAAccount, publicKey, refreshTrigger]);

  if (!publicKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg">
        <p className="text-center text-gray-400">Connect wallet to see your greeting</p>
      </div>
    );
  }

  console.log("[CounterCard] Render - isLoading:", isLoading, "greetData:", greetData);

  return (
    <div className="h-full flex flex-col p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Your Greeting</h2>
      <div className="flex-1">
        {isLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : greetData?.user && greetData?.greet ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Public Key</p>
              <p className="text-sm font-mono break-all">
                {greetData.user.toString().slice(0, 4)}...{greetData.user.toString().slice(-4)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Message</p>
              <p className="text-lg font-bold">{greetData.greet}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No greeting found. Submit one above!</p>
        )}
      </div>
    </div>
  );
}