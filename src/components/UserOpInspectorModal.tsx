"use client";

import { useState } from "react";
import { Cpu, X, CheckCircle2, ExternalLink, Copy, Check, Terminal } from "lucide-react";
import { UserOpDetails } from "@/types";
import { formatAddress } from "@/lib/utils";

interface UserOpInspectorProps {
  userOp: UserOpDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserOpInspectorModal({
  userOp,
  isOpen,
  onClose,
}: UserOpInspectorProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !userOp) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(userOp, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                ERC-4337 UserOperation Inspector
              </h3>
              <p className="text-xs text-slate-400">
                ZeroDev Kernel Smart Account execution payload
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Key Pipeline Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">
                EntryPoint
              </span>
              <div className="text-xs font-mono text-brand-300 font-semibold mt-0.5">
                v0.7
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                {formatAddress(userOp.entryPoint)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">
                Bundler
              </span>
              <div className="text-xs font-mono text-emerald-400 font-semibold mt-0.5 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {userOp.bundlerStatus.toUpperCase()}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">ZeroDev RPC</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">
                Paymaster
              </span>
              <div className="text-xs font-mono text-amber-300 font-semibold mt-0.5">
                100% SPONSORED
              </div>
              <div className="text-[10px] text-slate-400 font-mono">User Gas: 0 ETH</div>
            </div>
          </div>

          {/* UserOp JSON Payload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 flex items-center">
                <Terminal className="w-3.5 h-3.5 mr-1.5 text-brand-400" />
                PackedUserOperation Struct
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Payload"}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              {JSON.stringify(userOp, null, 2)}
            </pre>
          </div>

          {/* Hashes & Explorer links */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">UserOp Hash:</span>
              <span className="font-mono text-brand-300 font-medium truncate max-w-[280px]">
                {userOp.userOpHash}
              </span>
            </div>
            {userOp.txHash && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sepolia Tx Hash:</span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${userOp.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <span className="truncate max-w-[260px]">{userOp.txHash}</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Target: TapTicket.sol (`claimTicket()`)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
