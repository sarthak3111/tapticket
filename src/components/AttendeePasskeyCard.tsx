"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Fingerprint,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Ticket,
  KeyRound,
  RotateCcw
} from "lucide-react";
import { SmartAccountSession, TicketDetails, UserOpDetails } from "@/types";
import {
  createOrLoginPasskeyAccount,
  sendSponsoredClaimTicketOp,
  isZeroDevConfigured,
} from "@/lib/zerodev";
import {
  getLocalSession,
  getLocalTicket,
  getLocalDemoMode,
  clearLocalSession,
} from "@/lib/simulatedAA";
import { formatAddress } from "@/lib/utils";
import TicketPassView from "./TicketPassView";

export default function AttendeePasskeyCard() {
  const [name, setName] = useState("");
  const [session, setSession] = useState<SmartAccountSession | null>(null);
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [userOp, setUserOp] = useState<UserOpDetails | null>(null);

  const [loadingPasskey, setLoadingPasskey] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusStep, setStatusStep] = useState<string>("");

  useEffect(() => {
    const existingSession = getLocalSession();
    if (existingSession) {
      setSession(existingSession);
      const existingTicket = getLocalTicket(existingSession.smartAccountAddress);
      if (existingTicket) {
        setTicket(existingTicket);
      }
    }

    const handleModeChange = () => {
      const curSession = getLocalSession();
      if (curSession) {
        setTicket(getLocalTicket(curSession.smartAccountAddress));
      }
    };

    window.addEventListener("tapticket_mode_change", handleModeChange);
    return () => window.removeEventListener("tapticket_mode_change", handleModeChange);
  }, []);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#10b981", "#8b5cf6", "#f59e0b"],
      });
    } catch {}
  };

  const handleCreatePasskey = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setLoadingPasskey(true);
    setStatusStep("Prompting WebAuthn Passkey (Touch ID / Face ID / Windows Hello)...");

    try {
      const demoActive = getLocalDemoMode();
      const newSession = await createOrLoginPasskeyAccount(
        name.trim() || "Devcon Attendee",
        "register",
        demoActive
      );
      setSession(newSession);
      setStatusStep("Smart Account counterfactual address generated!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to create passkey smart account.");
    } finally {
      setLoadingPasskey(false);
    }
  };

  const handleClaimTicket = async () => {
    if (!session) return;
    setErrorMsg(null);
    setLoadingClaim(true);
    setStatusStep("Building UserOperation & requesting ZeroDev Paymaster sponsorship...");

    try {
      const demoActive = getLocalDemoMode();
      const result = await sendSponsoredClaimTicketOp(session, demoActive);
      setTicket(result.ticket);
      setUserOp(result.userOp);
      triggerCelebration();
      window.dispatchEvent(new Event("tapticket_data_update"));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to claim sponsored ticket.");
    } finally {
      setLoadingClaim(false);
      setStatusStep("");
    }
  };

  const handleReset = () => {
    clearLocalSession();
    setSession(null);
    setTicket(null);
    setUserOp(null);
    setName("");
    window.dispatchEvent(new Event("tapticket_data_update"));
  };

  // If user already has ticket, render the Ticket Pass
  if (ticket && ticket.hasTicket) {
    return (
      <div className="space-y-4">
        <TicketPassView
          ticket={ticket}
          session={session}
          userOp={userOp}
          onRefresh={() => {
            if (session) setTicket(getLocalTicket(session.smartAccountAddress));
          }}
        />

        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo & Create Another Attendee</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyber-violet flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Fingerprint className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>Attendee 1-Click Passkey Onboarding</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono">
              Zero Seed Phrases
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Create an ERC-4337 Smart Account instantly using your device biometrics
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: Create Passkey Account */}
      {!session ? (
        <form onSubmit={handleCreatePasskey} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Attendee Name / Handle
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarthak (or sarthak.eth)"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm placeholder-slate-500 outline-none transition-all"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Your device will generate a WebAuthn P-256 keypair stored securely in your device Secure Enclave / TPM.
            </p>
          </div>

          <button
            type="submit"
            disabled={loadingPasskey}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyber-violet hover:from-brand-500 hover:to-cyber-violet text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loadingPasskey ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Smart Account with Passkey...</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-4 h-4" />
                <span>Create Passkey Ticket Wallet (1-Click)</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Step 2: Account Ready, Claim Ticket */
        <div className="space-y-5">
          {/* Smart Account Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400 mr-1" />
                ZeroDev Kernel v3 Smart Account
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Counterfactual Ready
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Smart Account Address:
                </span>
                <span className="font-mono text-xs sm:text-sm text-brand-300 font-semibold">
                  {session.smartAccountAddress}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Signer: Passkey (WebAuthn)</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                <span>Gas: $0 (Sponsored by Paymaster)</span>
              </div>
            </div>
          </div>

          {/* Claim Action */}
          <button
            onClick={handleClaimTicket}
            disabled={loadingClaim}
            className="w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loadingClaim ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sponsoring UserOp via ZeroDev Paymaster...</span>
              </>
            ) : (
              <>
                <Ticket className="w-4 h-4" />
                <span>Claim Free Ticket (Sponsored UserOp)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

          {/* Reset link */}
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
            >
              Switch / Re-create Passkey Account
            </button>
          </div>
        </div>
      )}

      {/* Pipeline Status Indicator */}
      {statusStep && (
        <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-brand-300 font-mono flex items-center space-x-2">
          <Cpu className="w-3.5 h-3.5 text-brand-400 shrink-0 animate-pulse" />
          <span>{statusStep}</span>
        </div>
      )}
    </div>
  );
}
