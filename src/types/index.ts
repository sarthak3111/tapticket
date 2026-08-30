export interface SmartAccountSession {
  smartAccountAddress: `0x${string}`;
  passkeyId: string;
  passkeyName: string;
  isDeployed: boolean;
  signerType: "passkey" | "local_passkey_mock";
  createdAt: number;
}

export interface TicketDetails {
  attendeeAddress: `0x${string}`;
  hasTicket: boolean;
  isUsed: boolean;
  issuedAt: number; // Unix timestamp
  checkedInAt: number; // Unix timestamp
  ticketNumber?: number;
  eventName: string;
  venue: string;
  txHash?: string;
  userOpHash?: string;
  isSponsored: boolean;
}

export interface EventStats {
  name: string;
  venue: string;
  capacity: number;
  totalIssued: number;
  totalCheckedIn: number;
}

export interface UserOpDetails {
  sender: `0x${string}`;
  nonce: string;
  initCode?: string;
  callData: string;
  callGasLimit?: string;
  verificationGasLimit?: string;
  preVerificationGas?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  paymasterAndData?: string;
  signature?: string;
  entryPoint: `0x${string}`;
  bundlerStatus: "pending" | "submitted" | "included" | "simulated";
  paymasterStatus: "sponsored" | "self-paid" | "sponsored_demo";
  userOpHash: string;
  txHash?: string;
  timestamp: number;
}

export interface CheckInLogEntry {
  id: string;
  attendee: `0x${string}`;
  status: "SUCCESS" | "ALREADY_CHECKED_IN" | "NO_TICKET" | "ERROR";
  message: string;
  timestamp: number;
  txHash?: string;
}
