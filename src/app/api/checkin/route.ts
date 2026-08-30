import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { APP_CHAIN, RPC_URL, TICKET_CONTRACT_ADDRESS } from "@/config/chains";
import { TAPTICKET_ABI } from "@/config/contracts";
import { simulateGateCheckIn } from "@/lib/simulatedAA";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { attendeeAddress, forceSimulation } = body;

    if (!attendeeAddress || !attendeeAddress.startsWith("0x")) {
      return NextResponse.json(
        { error: "Invalid attendee smart account address provided." },
        { status: 400 }
      );
    }

    const organiserKey = process.env.ORGANISER_PRIVATE_KEY;

    // Check if we should execute on live testnet
    if (!forceSimulation && organiserKey && organiserKey.startsWith("0x") && organiserKey.length === 66) {
      try {
        const publicClient = createPublicClient({
          chain: APP_CHAIN,
          transport: http(RPC_URL),
        });

        const account = privateKeyToAccount(organiserKey as `0x${string}`);
        const walletClient = createWalletClient({
          account,
          chain: APP_CHAIN,
          transport: http(RPC_URL),
        });

        // 1. Verify status on-chain first
        const [hasTicket, isUsed] = await publicClient.readContract({
          address: TICKET_CONTRACT_ADDRESS,
          abi: TAPTICKET_ABI,
          functionName: "getTicketStatus",
          args: [attendeeAddress as `0x${string}`],
        });

        if (!hasTicket) {
          return NextResponse.json({
            status: "NO_TICKET",
            message: "No ticket registered on-chain for this Smart Account address.",
          });
        }

        if (isUsed) {
          return NextResponse.json({
            status: "ALREADY_CHECKED_IN",
            message: "This ticket has already been used for entry.",
          });
        }

        // 2. Submit on-chain check-in
        const txHash = await walletClient.writeContract({
          address: TICKET_CONTRACT_ADDRESS,
          abi: TAPTICKET_ABI,
          functionName: "checkIn",
          args: [attendeeAddress as `0x${string}`],
        });

        await publicClient.waitForTransactionReceipt({ hash: txHash });

        return NextResponse.json({
          status: "SUCCESS",
          message: "Check-in verified on Sepolia testnet! Welcome to Road to Devcon.",
          txHash,
          isLiveTestnet: true,
        });
      } catch (chainError: any) {
        console.warn("On-chain check-in transaction failed, falling back to simulated check-in:", chainError);
      }
    }

    // Default: Simulated gate verification
    const result = await simulateGateCheckIn(attendeeAddress as `0x${string}`);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Check-in API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process check-in" },
      { status: 500 }
    );
  }
}
