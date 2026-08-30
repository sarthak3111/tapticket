"use client";

import GateScanner from "@/components/GateScanner";
import StatsCounter from "@/components/StatsCounter";
import { QrCode, ArrowLeft, ShieldAlert } from "lucide-react";

export default function GatePage() {
  return (
    <div className="space-y-8">
      {/* Top Breadcrumb / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <a
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Attendee Portal</span>
          </a>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Organiser Gatekeeper Station
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            ROAD TO DEVCON – IIITN EDITION • Real-time on-chain check-in & duplicate rejection
          </p>
        </div>
      </div>

      {/* Live Stats */}
      <StatsCounter />

      {/* Main Scanner */}
      <GateScanner />
    </div>
  );
}
