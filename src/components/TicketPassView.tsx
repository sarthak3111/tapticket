"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Ticket,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Calendar,
  MapPin,
  Cpu,
  Share2,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { TicketDetails, UserOpDetails, SmartAccountSession } from "@/types";
import { formatAddress, formatTimestamp } from "@/lib/utils";
import UserOpInspectorModal from "./UserOpInspectorModal";

interface TicketPassViewProps {
  ticket: TicketDetails;
  session?: SmartAccountSession | null;
  userOp?: UserOpDetails | null;
  onRefresh?: () => void;
}

export default function TicketPassView({
  ticket,
  session,
  userOp,
  onRefresh,
}: TicketPassViewProps) {
  const [copied, setCopied] = useState(false);
  const [showInspector, setShowInspector] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.attendeeAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // QR Code payload contains the attendee Smart Account address and verification signature payload
  const qrPayload = JSON.stringify({
    app: "tapticket",
    event: "ROAD_TO_DEVCON_IIITN",
    account: ticket.attendeeAddress,
    issuedAt: ticket.issuedAt,
    passkeyId: session?.passkeyId || "pk_default",
  });

  return (
    <div className="w-full max-w-md mx-auto my-4 animate-fadeIn">
      {/* Ticket Card Container */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl shadow-brand-950/40 overflow-hidden text-slate-100">
        {/* Glowing Ambient Top Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 via-cyber-violet to-emerald-400" />

        {/* Top Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-400 font-semibold">
                  Official Entry Pass
                </span>
                <h4 className="text-xs text-slate-400 leading-none">
                  IIIT Nagpur × Bhaisaaab
                </h4>
              </div>
            </div>

            {/* Status Pill */}
            {ticket.isUsed ? (
              <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Checked In</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold glow-emerald">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Pass</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
              ROAD TO DEVCON
            </h2>
            <p className="text-xs text-brand-300 font-mono mt-0.5">
              Ethereum Research Workshop & Builders Lab
            </p>
          </div>
        </div>

        {/* Event Meta Details */}
        <div className="px-6 py-3 bg-slate-950/40 border-y border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-start space-x-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Date</span>
              <span className="font-medium text-slate-200">Aug 30-31, 2026</span>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Venue</span>
              <span className="font-medium text-slate-200">IIIT Nagpur Campus</span>
            </div>
          </div>
        </div>

        {/* QR Code Center Section */}
        <div className="relative p-6 flex flex-col items-center justify-center bg-slate-900/60">
          {/* Perforated Notches */}
          <div className="ticket-edge-left border-r border-slate-700/80" />
          <div className="ticket-edge-right border-l border-slate-700/80" />

          {/* QR Container */}
          <div className="p-3.5 rounded-2xl bg-white shadow-xl shadow-black/40 relative group">
            <QRCodeSVG
              value={qrPayload}
              size={180}
              level="H"
              includeMargin={false}
            />
            {ticket.isUsed && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-1 animate-scaleIn" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  USED AT DOOR
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatTimestamp(ticket.checkedInAt)}
                </span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Present this QR at the entrance gate for instant on-chain check-in
          </p>
        </div>

        {/* Smart Account & Passkey Info */}
        <div className="p-6 pt-3 bg-slate-950/80 border-t border-dashed border-slate-800 space-y-3">
          {/* Attendee Handle & Smart Account */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                Smart Account (Kernel v3)
              </span>
              <span className="font-mono text-slate-200 font-semibold">
                {formatAddress(ticket.attendeeAddress, 6)}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Copy Smart Account Address"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Passkey Signer Info */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-cyber-violet mr-1.5" />
              Signer: Passkey (WebAuthn)
            </span>
            <span className="font-mono text-emerald-400 flex items-center">
              <Zap className="w-3 h-3 mr-1 fill-emerald-400" />
              Gas: $0 (Sponsored)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => setShowInspector(true)}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-brand-400" />
              <span>Inspect UserOp</span>
            </button>

            <a
              href="/gate"
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-brand-600/90 hover:bg-brand-500 border border-brand-500 text-xs font-semibold text-white transition-colors shadow-md shadow-brand-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Gate</span>
            </a>
          </div>
        </div>
      </div>

      {/* UserOp Inspector Modal */}
      <UserOpInspectorModal
        isOpen={showInspector}
        onClose={() => setShowInspector(false)}
        userOp={
          userOp || {
            sender: ticket.attendeeAddress,
            nonce: "0x0",
            callData: "0x4e71d92d",
            entryPoint: "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
            bundlerStatus: "included",
            paymasterStatus: "sponsored",
            userOpHash: ticket.userOpHash || "0x94fC49aE5779c13fe6F0a5814529FE5d81bFFe37",
            txHash: ticket.txHash,
            timestamp: ticket.issuedAt,
          }
        }
      />
    </div>
  );
}
