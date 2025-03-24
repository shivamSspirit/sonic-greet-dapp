import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import AppWalletProvider from "./components/WalletProvider";
import { WalletButton } from "./components/CustomWalletButton";
import { NetworkDropdown } from "./components/ClusterNetwork";
import { RefreshProvider } from "./context/RefreshContext";
import "./globals.css";


export const metadata: Metadata = {
  title: "SVM Greet",
  description: "A Solana-based greeting dApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-gray-900 text-white`}
      >
        <AppWalletProvider>
          <RefreshProvider>
            <Toaster
              position="bottom-right"
              reverseOrder={false}
            />
            <header className="p-4 flex justify-between items-center border-b border-teal-800 bg-gradient-to-r from-gray-900 to-blue-900">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">
                SVM Greet
              </h2>
              <div className="flex items-center gap-4">
                <NetworkDropdown />
                <WalletButton />
              </div>
            </header>
            <main className="min-h-screen">{children}</main>
          </RefreshProvider>
        </AppWalletProvider>
      </body>
    </html>
  );
}