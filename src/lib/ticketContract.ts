import { createPublicClient, encodeFunctionData, http, parseAbiItem } from "viem";
import { APP_CHAIN, RPC_URL, TICKET_CONTRACT_ADDRESS } from "@/config/chains";
import { TAPTICKET_ABI, DEFAULT_EVENT_CONFIG } from "@/config/contracts";
import { TicketDetails, EventStats } from "@/types";

export const publicClient = createPublicClient({
  chain: APP_CHAIN,
  transport: http(RPC_URL),
});

export async function getOnChainTicketStatus(
  attendeeAddress: `0x${string}`,
  contractAddress: `0x${string}` = TICKET_CONTRACT_ADDRESS
): Promise<TicketDetails> {
  try {
    const data = await publicClient.readContract({
      address: contractAddress,
      abi: TAPTICKET_ABI,
      functionName: "getTicketStatus",
      args: [attendeeAddress],
    });

    const [hasTicket, isUsed, issuedTime, checkInTime] = data;

    return {
      attendeeAddress,
      hasTicket,
      isUsed,
      issuedAt: Number(issuedTime),
      checkedInAt: Number(checkInTime),
      eventName: DEFAULT_EVENT_CONFIG.name,
      venue: DEFAULT_EVENT_CONFIG.venue,
      isSponsored: true,
    };
  } catch (error) {
    console.warn("Could not read contract on-chain, falling back to local state:", error);
    return {
      attendeeAddress,
      hasTicket: false,
      isUsed: false,
      issuedAt: 0,
      checkedInAt: 0,
      eventName: DEFAULT_EVENT_CONFIG.name,
      venue: DEFAULT_EVENT_CONFIG.venue,
      isSponsored: true,
    };
  }
}

export async function getOnChainEventStats(
  contractAddress: `0x${string}` = TICKET_CONTRACT_ADDRESS
): Promise<EventStats> {
  try {
    const data = await publicClient.readContract({
      address: contractAddress,
      abi: TAPTICKET_ABI,
      functionName: "getEventStats",
    });

    const [name, venue, capacity, issued, checkedIn] = data;

    return {
      name: name || DEFAULT_EVENT_CONFIG.name,
      venue: venue || DEFAULT_EVENT_CONFIG.venue,
      capacity: Number(capacity) || DEFAULT_EVENT_CONFIG.capacity,
      totalIssued: Number(issued),
      totalCheckedIn: Number(checkedIn),
    };
  } catch (error) {
    return {
      name: DEFAULT_EVENT_CONFIG.name,
      venue: DEFAULT_EVENT_CONFIG.venue,
      capacity: DEFAULT_EVENT_CONFIG.capacity,
      totalIssued: 0,
      totalCheckedIn: 0,
    };
  }
}

export function encodeClaimTicketCallData(): `0x${string}` {
  return encodeFunctionData({
    abi: TAPTICKET_ABI,
    functionName: "claimTicket",
  });
}

export function encodeIssueTicketCallData(attendee: `0x${string}`): `0x${string}` {
  return encodeFunctionData({
    abi: TAPTICKET_ABI,
    functionName: "issueTicket",
    args: [attendee],
  });
}

export function encodeCheckInCallData(attendee: `0x${string}`): `0x${string}` {
  return encodeFunctionData({
    abi: TAPTICKET_ABI,
    functionName: "checkIn",
    args: [attendee],
  });
}
