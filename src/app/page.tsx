"use client";

import HeroSection from "@/components/HeroSection";
import StatsCounter from "@/components/StatsCounter";
import AttendeePasskeyCard from "@/components/AttendeePasskeyCard";
import { ShieldCheck, Cpu, Zap, KeyRound, Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <HeroSection />

      {/* Real-Time Live Stats */}
      <StatsCounter />

      {/* Main Action Flow: Attendee Passkey Onboarding & Ticket Issuance */}
      <section className="relative">
        <div className="text-center mb-6">
          <span className="text-[11px] uppercase tracking-widest text-brand-400 font-mono font-semibold">
            Interactive Live Demo
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Claim Your Devcon IIITN Pass
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mt-1">
            Step through the end-to-end account abstraction flow below
          </p>
        </div>

        <AttendeePasskeyCard />
      </section>

      {/* Architecture Showcase Section */}
      <section className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-brand-400">
            How Account Abstraction Powers TapTicket
          </span>
          <h3 className="text-xl font-bold text-white">
            ERC-4337 Smart Account Architecture
          </h3>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20">
              <KeyRound className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">1. WebAuthn Passkeys</h4>
            <p className="text-slate-400 leading-relaxed">
              Device Secure Enclave acts as the cryptographic signer. Replaces 12-word seed phrases with biometric Touch ID / Face ID.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cyber-violet/10 text-cyber-violet flex items-center justify-center border border-cyber-violet/20">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">2. ZeroDev Kernel v3</h4>
            <p className="text-slate-400 leading-relaxed">
              Attendee's identity is an ERC-4337 Smart Account, not an EOA. Programmable validation decouples key management from identity.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">3. ZeroDev Paymaster</h4>
            <p className="text-slate-400 leading-relaxed">
              Organiser configures gas sponsorship policies. The attendee submits a sponsored UserOperation with zero ETH in their account.
            </p>
          </div>
        </div>

        {/* Gate Callout Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/60 via-slate-900 to-emerald-950/60 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">
                Ready to verify attendees at the door?
              </span>
              <span className="text-slate-400">
                Switch to the Organiser Gate Scanner to check in tickets on-chain.
              </span>
            </div>
          </div>
          <a
            href="/gate"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center space-x-1.5 transition-colors shrink-0 shadow-md shadow-emerald-600/20"
          >
            <span>Open Gate Scanner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
}
