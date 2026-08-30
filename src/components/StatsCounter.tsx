"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, Flame, ShieldAlert, Sparkles } from "lucide-react";
import { getLocalStats } from "@/lib/simulatedAA";
import { getOnChainEventStats } from "@/lib/ticketContract";

export default function StatsCounter() {
  const [stats, setStats] = useState({
    name: "ROAD TO DEVCON – IIITN EDITION",
    capacity: 350,
    totalIssued: 142,
    totalCheckedIn: 89,
  });

  const loadStats = async () => {
    try {
      const onChain = await getOnChainEventStats();
      if (onChain.totalIssued > 0) {
        setStats(onChain);
        return;
      }
    } catch {}
    const local = getLocalStats();
    setStats((prev) => ({
      ...prev,
      totalIssued: local.totalIssued,
      totalCheckedIn: local.totalCheckedIn,
    }));
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 4000);
    window.addEventListener("tapticket_data_update", loadStats);
    return () => {
      clearInterval(interval);
      window.removeEventListener("tapticket_data_update", loadStats);
    };
  }, []);

  const percentage = Math.min(
    100,
    Math.round((stats.totalCheckedIn / (stats.totalIssued || 1)) * 100)
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
      {/* Total Issued */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Tickets Claimed</span>
          <Users className="w-4 h-4 text-brand-400" />
        </div>
        <div className="text-2xl font-bold text-white font-mono">
          {stats.totalIssued}
          <span className="text-xs text-slate-500 font-normal ml-1">/ {stats.capacity}</span>
        </div>
        <div className="text-[11px] text-brand-400/90 mt-1 flex items-center">
          <Sparkles className="w-3 h-3 mr-1" />
          <span>100% Passkey Accounts</span>
        </div>
      </div>

      {/* Checked In */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Checked In at Door</span>
          <UserCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-emerald-400 font-mono">
          {stats.totalCheckedIn}
        </div>
        <div className="text-[11px] text-emerald-400/80 mt-1">
          {percentage}% venue occupancy
        </div>
      </div>

      {/* Gas Saved */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>User Gas Cost</span>
          <Flame className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold text-white font-mono">
          $0.00
        </div>
        <div className="text-[11px] text-emerald-400/90 mt-1 font-mono">
          Sponsored by ZeroDev
        </div>
      </div>

      {/* Duplicate Rejection */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Double Entry Prevention</span>
          <ShieldAlert className="w-4 h-4 text-cyber-violet" />
        </div>
        <div className="text-2xl font-bold text-cyber-violet font-mono">
          On-Chain
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          Zero double check-ins
        </div>
      </div>
    </div>
  );
}
