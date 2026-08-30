"use client";

import { Sparkles, ArrowRight, ShieldCheck, Zap, Fingerprint, CheckCircle2, XCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="text-center max-w-3xl mx-auto py-8 space-y-6">
      {/* Workshop Pill */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-brand-300 text-xs font-mono shadow-lg shadow-brand-500/10">
        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
        <span>ROAD TO DEVCON – IIITN EDITION</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
        Event Ticketing Without
        <span className="block bg-gradient-to-r from-brand-400 via-cyber-violet to-emerald-400 bg-clip-text text-transparent">
          Seed Phrases or Gas Anxiety
        </span>
      </h1>

      <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Claim your verified event pass in under 30 seconds with <strong>Passkeys</strong>. 
        ZeroDev <strong>ERC-4337 Smart Accounts</strong> + <strong>Paymaster Gas Sponsorship</strong> 
        removes wallet installation while ensuring cryptographically un-duplicatable door check-ins.
      </p>

      {/* Comparison Grid */}
      <div className="grid sm:grid-cols-2 gap-4 text-left my-8">
        {/* Old Way */}
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-xs space-y-2.5">
          <div className="flex items-center space-x-2 text-rose-400 font-bold uppercase tracking-wider">
            <XCircle className="w-4 h-4" />
            <span>The Traditional Failure Points</span>
          </div>
          <ul className="space-y-1.5 text-slate-400">
            <li className="flex items-start">
              <span className="text-rose-400 mr-1.5">•</span>
              Attendees must install a wallet, backup 12 seed words, and acquire testnet ETH.
            </li>
            <li className="flex items-start">
              <span className="text-rose-400 mr-1.5">•</span>
              Organisers run check-in off fragile Google Forms and eyeballed spreadsheets at the door.
            </li>
          </ul>
        </div>

        {/* TapTicket Way */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2.5">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>The TapTicket Solution</span>
          </div>
          <ul className="space-y-1.5 text-slate-300">
            <li className="flex items-start">
              <span className="text-emerald-400 mr-1.5">•</span>
              Passkey login creates a ZeroDev Kernel Smart Account automatically in seconds.
            </li>
            <li className="flex items-start">
              <span className="text-emerald-400 mr-1.5">•</span>
              ZeroDev Paymaster sponsors gas ($0 cost to attendee); contract prevents double entries.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
