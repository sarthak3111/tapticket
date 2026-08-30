import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "TapTicket | Zero-Friction Event Ticketing on Ethereum",
  description:
    "Road to Devcon IIITN Edition: Claim your ticket in 30 seconds with Passkeys and ZeroDev ERC-4337 Smart Accounts. Zero seed phrases, gas sponsored by paymaster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col justify-between text-slate-100 selection:bg-brand-500 selection:text-white">
        <div>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </div>
        <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-6 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-400">
                ROAD TO DEVCON – IIITN EDITION
              </span>
              <span>•</span>
              <span>Ethereum Research Workshop & Builders Lab</span>
            </div>
            <p>
              IIIT Nagpur × Bhaisaaab • Built with ZeroDev Kernel Smart Accounts (ERC-4337) & Sepolia Testnet
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
