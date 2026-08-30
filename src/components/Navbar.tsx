"use client";

import Link from "next/navigation";
import { useState, useEffect } from "react";
import { Ticket, ShieldCheck, Cpu, Zap, Sparkles, QrCode } from "lucide-react";
import { getLocalDemoMode, setLocalDemoMode } from "@/lib/simulatedAA";

export default function Navbar() {
  const [demoMode, setDemoMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDemoMode(getLocalDemoMode());
  }, []);

  const toggleDemoMode = () => {
    const next = !demoMode;
    setDemoMode(next);
    setLocalDemoMode(next);
    window.dispatchEvent(new Event("tapticket_mode_change"));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyber-violet flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  TapTicket
                </span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono font-medium">
                  ERC-4337
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">
                IIIT Nagpur × Bhaisaaab
              </p>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <a
              href="/"
              className="px-3.5 py-1.5 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Attendee Portal
            </a>
            <a
              href="/gate"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Organiser Gate</span>
            </a>
            <a
              href="/ticket"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>My Pass</span>
            </a>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Paymaster Sponsored Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>ZeroDev Paymaster</span>
            </div>

            {/* Presentation / Demo Mode Toggle */}
            {mounted && (
              <button
                onClick={toggleDemoMode}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  demoMode
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/20"
                    : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/80"
                }`}
                title="Toggle Demo Mode for instant presentation without RPC/network latency"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{demoMode ? "Demo Mode: ON" : "Live AA"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
