"use client";

import { useState, useEffect } from "react";
import TicketPassView from "@/components/TicketPassView";
import AttendeePasskeyCard from "@/components/AttendeePasskeyCard";
import { TicketDetails, SmartAccountSession, UserOpDetails } from "@/types";
import { getLocalSession, getLocalTicket, getLocalUserOps } from "@/lib/simulatedAA";
import { ArrowLeft, Ticket, AlertCircle } from "lucide-react";

export default function TicketPage() {
  const [session, setSession] = useState<SmartAccountSession | null>(null);
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [userOp, setUserOp] = useState<UserOpDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const curSession = getLocalSession();
    if (curSession) {
      setSession(curSession);
      const curTicket = getLocalTicket(curSession.smartAccountAddress);
      if (curTicket) setTicket(curTicket);

      const ops = getLocalUserOps();
      if (ops.length > 0) setUserOp(ops[0]);
    }
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <a
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </a>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-white">Your Event Pass</h1>
        <p className="text-xs text-slate-400">
          ROAD TO DEVCON – IIITN EDITION • Verified by ZeroDev Smart Account
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 font-mono">
          Loading pass details...
        </div>
      ) : ticket && ticket.hasTicket ? (
        <TicketPassView
          ticket={ticket}
          session={session}
          userOp={userOp}
          onRefresh={() => {
            if (session) setTicket(getLocalTicket(session.smartAccountAddress));
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <Ticket className="w-8 h-8 text-brand-400 mx-auto opacity-70" />
            <p className="text-xs text-slate-300">
              No ticket claimed yet for this device. Claim your pass below with 1-click Passkey!
            </p>
          </div>
          <AttendeePasskeyCard />
        </div>
      )}
    </div>
  );
}
