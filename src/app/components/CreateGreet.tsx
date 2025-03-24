"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { useGreetSVMProgram } from "./ProgramInteraction";
import { useRefresh } from "../context/RefreshContext";
import { useNetwork } from "../context/NetworkContext";
import Link from "next/link";

export default function CreateGreet() {
  const [greet, setGreet] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const { publicKey } = useWallet();
  const { initializeGreetAccount, fetchGreetAccount } = useGreetSVMProgram();
  const { triggerRefresh } = useRefresh();
  const { network } = useNetwork();

  useEffect(() => {
    const checkIfGreeted = async () => {
      if (!publicKey) {
        setHasGreeted(false);
        return;
      }
      try {
        const existingGreet = await fetchGreetAccount();
        setHasGreeted(!!existingGreet);
      } catch (error) {
        console.error("Failed to check greeting account:", error);
        setHasGreeted(false);
      }
    };
    checkIfGreeted();
  }, [publicKey, fetchGreetAccount]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    if (inputText.length <= 99) setGreet(inputText);
  };

  const handleSubmit = async () => {
    if (!greet.trim() || !publicKey) {
      toast.error("Please enter a greeting and connect your wallet.");
      return;
    }

    const existingGreet = await fetchGreetAccount();
    if (existingGreet) {
      toast.error("You have already submitted a greeting. You can only greet once.");
      return;
    }

    setIsSubmitting(true);

    try {
      const tx = await initializeGreetAccount(greet);
      setGreet("");
      setHasGreeted(true);
      triggerRefresh();

      // Show toast with transaction signature link
      toast.success((t) => (
        <div className="flex flex-col space-y-2">
          <span>Greeting submitted successfully!</span>
          <Link
            href={`https://explorer.solana.com/tx/${tx}?cluster=${network.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-400 hover:underline cursor-pointer"
          >
            View Transaction on Solana Explorer
          </Link>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="mt-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Dismiss
          </button>
        </div>
      ), { duration: 5000 });
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit greeting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasGreeted) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg">
        <p className="text-center text-gray-400">
          You have already submitted a greeting. You can only greet once.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 bg-gray-800 rounded-lg space-y-4">
      <h2 className="text-xl font-bold">Create Greeting</h2>
      <div className="flex-1 flex flex-col space-y-4">
        <input
          type="text"
          value={greet}
          onChange={handleInputChange}
          placeholder="Enter your greeting (max 99 characters)"
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          maxLength={99}
          disabled={isSubmitting}
        />
        <p className="text-sm text-gray-400">{greet.length}/99 characters</p>
      </div>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full px-6 py-2 bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-teal-400 transition-colors cursor-pointer"
      >
        {isSubmitting ? "Submitting..." : "Submit Greeting"}
      </button>
    </div>
  );
}