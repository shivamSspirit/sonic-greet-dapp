"use client";

import { useEffect, useState } from "react";
import { useGreetSVMProgram } from "./ProgramInteraction";
import { useRefresh } from "../context/RefreshContext"; 

export default function CounterCard() {
  const { greetPDAAccount, fetchGreetAccount, publicKey } = useGreetSVMProgram();
  const { refreshTrigger } = useRefresh(); 
  const [greetData, setGreetData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!greetPDAAccount || !publicKey) return;
      setLoading(true);
      const data = await fetchGreetAccount();
      setGreetData(data);
      setLoading(false);
    };
    fetchData();
  }, [greetPDAAccount, publicKey, refreshTrigger]);

  if (!publicKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg">
        <p className="text-center text-gray-400">Connect wallet to see your greeting</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Your Greeting</h2>
      <div className="flex-1">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : greetData ? (
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