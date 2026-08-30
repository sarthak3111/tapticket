import { keccak256, toHex, encodeFunctionData, parseEther } from "viem";
import { ENTRYPOINT_ADDRESS_V07 } from "@/config/chains";
import { TAPTICKET_ABI, DEFAULT_EVENT_CONFIG } from "@/config/contracts";
import { SmartAccountSession, TicketDetails, UserOpDetails, CheckInLogEntry } from "@/types";
import { generateMockTxHash } from "./utils";

const STORAGE_KEYS = {
  SESSION: "tapticket_smart_account_session",
  TICKET: "tapticket_user_ticket",
  STATS: "tapticket_event_stats",
  LOGS: "tapticket_checkin_logs",
  USEROPS: "tapticket_userop_history",
  DEMO_MODE: "tapticket_demo_mode_active",
};

/**
 * Deterministically derives a simulated Kernel Smart Account address from a passkey name or pubkey.
 */
export function deriveSimulatedKernelAddress(seed: string): `0x${string}` {
  const hash = keccak256(toHex(`kernel-v3-passkey-${seed.toLowerCase().trim()}`));
  return `0x${hash.slice(26)}` as `0x${string}`;
}

export function getLocalDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  const val = localStorage.getItem(STORAGE_KEYS.DEMO_MODE);
  return val === "true";
}

export function setLocalDemoMode(active: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.DEMO_MODE, active ? "true" : "false");
}

export function getLocalSession(): SmartAccountSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveLocalSession(session: SmartAccountSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function clearLocalSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export function getLocalTicket(accountAddress?: `0x${string}`): TicketDetails | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.TICKET);
  if (!raw) return null;
  try {
    const ticket: TicketDetails = JSON.parse(raw);
    if (accountAddress && ticket.attendeeAddress.toLowerCase() !== accountAddress.toLowerCase()) {
      return null;
    }
    return ticket;
  } catch {
    return null;
  }
}

export function saveLocalTicket(ticket: TicketDetails) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.TICKET, JSON.stringify(ticket));
}

export function getLocalStats(): { totalIssued: number; totalCheckedIn: number } {
  if (typeof window === "undefined") return { totalIssued: 142, totalCheckedIn: 89 };
  const raw = localStorage.getItem(STORAGE_KEYS.STATS);
  if (!raw) {
    const initial = { totalIssued: 142, totalCheckedIn: 89 };
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return { totalIssued: 142, totalCheckedIn: 89 };
  }
}

export function incrementLocalIssued(): { totalIssued: number; totalCheckedIn: number } {
  const current = getLocalStats();
  const updated = { ...current, totalIssued: current.totalIssued + 1 };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
  }
  return updated;
}

export function incrementLocalCheckedIn(): { totalIssued: number; totalCheckedIn: number } {
  const current = getLocalStats();
  const updated = { ...current, totalCheckedIn: current.totalCheckedIn + 1 };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
  }
  return updated;
}

export function getLocalCheckInLogs(): CheckInLogEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function appendCheckInLog(entry: CheckInLogEntry) {
  if (typeof window === "undefined") return;
  const existing = getLocalCheckInLogs();
  const updated = [entry, ...existing].slice(0, 50); // keep last 50
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
}

export function getLocalUserOps(): UserOpDetails[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.USEROPS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function appendUserOp(userOp: UserOpDetails) {
  if (typeof window === "undefined") return;
  const existing = getLocalUserOps();
  const updated = [userOp, ...existing].slice(0, 20);
  localStorage.setItem(STORAGE_KEYS.USEROPS, JSON.stringify(updated));
}

/**
 * Creates a simulated Passkey Smart Account Session
 */
export async function createSimulatedPasskeyAccount(name: string): Promise<SmartAccountSession> {
  // Simulate cryptographic keypair generation delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const passkeyId = `pk_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  const smartAccountAddress = deriveSimulatedKernelAddress(name || passkeyId);

  const session: SmartAccountSession = {
    smartAccountAddress,
    passkeyId,
    passkeyName: name || "Attendee Passkey",
    isDeployed: false,
    signerType: "local_passkey_mock",
    createdAt: Date.now(),
  };

  saveLocalSession(session);
  return session;
}

/**
 * Simulates a sponsored UserOperation to claim a ticket
 */
export async function simulateSponsoredClaimTicket(
  account: SmartAccountSession
): Promise<{ ticket: TicketDetails; userOp: UserOpDetails }> {
  // Simulate Bundler + Paymaster verification latency
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const stats = incrementLocalIssued();
  const userOpHash = generateMockTxHash();
  const txHash = generateMockTxHash();
  const now = Math.floor(Date.now() / 1000);

  const callData = encodeFunctionData({
    abi: TAPTICKET_ABI,
    functionName: "claimTicket",
  });

  const userOp: UserOpDetails = {
    sender: account.smartAccountAddress,
    nonce: "0x0",
    callData,
    callGasLimit: "0x249f0",
    verificationGasLimit: "0x493e0",
    preVerificationGas: "0xc350",
    maxFeePerGas: "0x59682f00",
    maxPriorityFeePerGas: "0x3b9aca00",
    paymasterAndData: "0x0000000000000000000000000000000000000000_SPONSORED_ZERODEV_PAYMASTER",
    signature: "0xwebauthn_passkey_signature_verified_mock_p256",
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    bundlerStatus: "included",
    paymasterStatus: "sponsored",
    userOpHash,
    txHash,
    timestamp: now,
  };

  const ticket: TicketDetails = {
    attendeeAddress: account.smartAccountAddress,
    hasTicket: true,
    isUsed: false,
    issuedAt: now,
    checkedInAt: 0,
    ticketNumber: stats.totalIssued,
    eventName: DEFAULT_EVENT_CONFIG.name,
    venue: DEFAULT_EVENT_CONFIG.venue,
    txHash,
    userOpHash,
    isSponsored: true,
  };

  saveLocalTicket(ticket);
  appendUserOp(userOp);

  return { ticket, userOp };
}

/**
 * Simulates Gate Check-In for an Attendee address
 */
export async function simulateGateCheckIn(
  attendeeAddress: `0x${string}`
): Promise<{ status: "SUCCESS" | "ALREADY_CHECKED_IN" | "NO_TICKET"; message: string; txHash?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const ticket = getLocalTicket(attendeeAddress);
  const now = Math.floor(Date.now() / 1000);

  if (!ticket || !ticket.hasTicket) {
    const result = {
      status: "NO_TICKET" as const,
      message: "No ticket issued for this Smart Account address.",
    };
    appendCheckInLog({
      id: Math.random().toString(36).substring(2, 9),
      attendee: attendeeAddress,
      status: "NO_TICKET",
      message: result.message,
      timestamp: now,
    });
    return result;
  }

  if (ticket.isUsed) {
    const result = {
      status: "ALREADY_CHECKED_IN" as const,
      message: `Ticket was already used at ${new Date(ticket.checkedInAt * 1000).toLocaleTimeString()}.`,
    };
    appendCheckInLog({
      id: Math.random().toString(36).substring(2, 9),
      attendee: attendeeAddress,
      status: "ALREADY_CHECKED_IN",
      message: result.message,
      timestamp: now,
    });
    return result;
  }

  // Mark ticket used
  const txHash = generateMockTxHash();
  const updatedTicket: TicketDetails = {
    ...ticket,
    isUsed: true,
    checkedInAt: now,
  };
  saveLocalTicket(updatedTicket);
  incrementLocalCheckedIn();

  const successMessage = "Access Granted! Welcome to Road to Devcon – IIITN Edition.";
  appendCheckInLog({
    id: Math.random().toString(36).substring(2, 9),
    attendee: attendeeAddress,
    status: "SUCCESS",
    message: successMessage,
    timestamp: now,
    txHash,
  });

  return {
    status: "SUCCESS",
    message: successMessage,
    txHash,
  };
}
