"use client";

import { useState, useEffect, useRef } from "react";
import {
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  Search,
  Zap,
  Loader2,
  History,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { formatAddress, formatTimestamp } from "@/lib/utils";
import { CheckInLogEntry } from "@/types";
import { getLocalCheckInLogs, getLocalSession, getLocalTicket, getLocalDemoMode } from "@/lib/simulatedAA";

export default function GateScanner() {
  const [addressInput, setAddressInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: "SUCCESS" | "ALREADY_CHECKED_IN" | "NO_TICKET" | "ERROR";
    message: string;
    txHash?: string;
    attendee?: string;
  } | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [logs, setLogs] = useState<CheckInLogEntry[]>([]);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const refreshLogs = () => {
    setLogs(getLocalCheckInLogs());
  };

  useEffect(() => {
    refreshLogs();
    window.addEventListener("tapticket_data_update", refreshLogs);
    return () => {
      window.removeEventListener("tapticket_data_update", refreshLogs);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleVerifyCheckIn = async (attendeeAddress: string) => {
    if (!attendeeAddress || !attendeeAddress.startsWith("0x")) {
      setScanResult({
        status: "ERROR",
        message: "Invalid Ethereum address format.",
      });
      return;
    }

    setLoading(true);
    setScanResult(null);

    try {
      const demoActive = getLocalDemoMode();
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendeeAddress: attendeeAddress.trim(),
          forceSimulation: demoActive,
        }),
      });

      const data = await res.json();
      setScanResult({
        status: data.status || "ERROR",
        message: data.message || data.error || "Unknown verification result",
        txHash: data.txHash,
        attendee: attendeeAddress,
      });

      refreshLogs();
      window.dispatchEvent(new Event("tapticket_data_update"));
    } catch (err: any) {
      setScanResult({
        status: "ERROR",
        message: err.message || "Failed to contact gatekeeper node.",
      });
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const html5QrCode = new Html5Qrcode("gate-qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          let targetAddress = decodedText;
          try {
            const parsed = JSON.parse(decodedText);
            if (parsed.account) targetAddress = parsed.account;
          } catch {}

          if (targetAddress.startsWith("0x")) {
            setAddressInput(targetAddress);
            handleVerifyCheckIn(targetAddress);
            html5QrCode.stop().catch(() => {});
            setCameraActive(false);
          }
        },
        () => {}
      );
    } catch (err) {
      console.warn("Camera start failed, continuing in manual mode:", err);
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}
      setCameraActive(false);
    }
  };

  // Quick helper for test scenarios
  const fillSampleAddress = (type: "CURRENT_PASS" | "RANDOM_UNREGISTERED") => {
    if (type === "CURRENT_PASS") {
      const curSession = getLocalSession();
      if (curSession) {
        setAddressInput(curSession.smartAccountAddress);
        handleVerifyCheckIn(curSession.smartAccountAddress);
      } else {
        const dummy = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
        setAddressInput(dummy);
        handleVerifyCheckIn(dummy);
      }
    } else {
      const randomUnregistered = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
      setAddressInput(randomUnregistered);
      handleVerifyCheckIn(randomUnregistered);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Organiser Gate Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>Organiser Gatekeeper</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                  Door Verification
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                ROAD TO DEVCON – IIITN EDITION • Autonomous double-check-in prevention
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                cameraActive
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                  : "bg-brand-600 hover:bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{cameraActive ? "Stop Camera" : "Scan Attendee QR"}</span>
            </button>
          </div>
        </div>

        {/* Camera Scanner Viewport */}
        {cameraActive && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <div id="gate-qr-reader" className="w-full max-w-sm rounded-xl overflow-hidden" />
            <p className="text-xs text-slate-400 mt-2 font-mono">
              Align attendee's pass QR code inside the frame
            </p>
          </div>
        )}

        {/* Manual Address Input / Fast Tap Verification */}
        <div className="mt-6 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyCheckIn(addressInput);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Scan QR or paste Smart Account address (0x...)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-mono placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading || !addressInput}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center space-x-2 transition-all shadow-lg shadow-emerald-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Entry</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Buttons for Hackathon Presentation */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
              Quick Test Tap:
            </span>
            <button
              onClick={() => fillSampleAddress("CURRENT_PASS")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-mono border border-slate-700 transition-colors flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-brand-400" />
              <span>Current Registered Pass</span>
            </button>
            <button
              onClick={() => fillSampleAddress("RANDOM_UNREGISTERED")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono border border-slate-700 transition-colors"
            >
              Unregistered Account
            </button>
          </div>
        </div>

        {/* Verification Result Feedback Banner */}
        {scanResult && (
          <div
            className={`mt-6 p-5 rounded-2xl border transition-all animate-fadeIn ${
              scanResult.status === "SUCCESS"
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-100 glow-emerald"
                : scanResult.status === "ALREADY_CHECKED_IN"
                ? "bg-rose-950/80 border-rose-500 text-rose-100 glow-rose"
                : "bg-amber-950/80 border-amber-500 text-amber-100"
            }`}
          >
            <div className="flex items-start space-x-3">
              {scanResult.status === "SUCCESS" && (
                <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
              )}
              {scanResult.status === "ALREADY_CHECKED_IN" && (
                <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
              )}
              {scanResult.status === "NO_TICKET" && (
                <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0" />
              )}
              {scanResult.status === "ERROR" && (
                <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
              )}

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold tracking-tight">
                    {scanResult.status === "SUCCESS" && "ACCESS GRANTED"}
                    {scanResult.status === "ALREADY_CHECKED_IN" && "ENTRY DENIED: ALREADY CHECKED IN"}
                    {scanResult.status === "NO_TICKET" && "ENTRY DENIED: NO TICKET FOUND"}
                    {scanResult.status === "ERROR" && "VERIFICATION ERROR"}
                  </h4>
                  <span className="text-xs font-mono opacity-80">
                    {scanResult.status}
                  </span>
                </div>
                <p className="text-xs opacity-90">{scanResult.message}</p>
                {scanResult.attendee && (
                  <p className="text-[11px] font-mono opacity-80 pt-1">
                    Smart Account: {scanResult.attendee}
                  </p>
                )}
                {scanResult.txHash && (
                  <div className="pt-2">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${scanResult.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-emerald-300 hover:underline font-mono"
                    >
                      <span>Check-In Tx: {formatAddress(scanResult.txHash, 6)}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Door Check-In Audit Log Table */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-white">
              Live Door Entry Audit Trail
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {logs.length} Gate Events Logged
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 font-mono">
            No gate check-ins logged yet. Scan an attendee pass above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Smart Account</th>
                  <th className="pb-2">Gate Status</th>
                  <th className="pb-2">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="text-slate-300 hover:bg-slate-800/30">
                    <td className="py-2.5 text-slate-400">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="py-2.5 text-slate-200">
                      {formatAddress(log.attendee, 5)}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          log.status === "SUCCESS"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : log.status === "ALREADY_CHECKED_IN"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400 truncate max-w-xs">
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
