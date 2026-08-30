import { createPublicClient, http, encodeFunctionData } from "viem";
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk";
import {
  toPasskeyValidator,
  toWebAuthnKey,
  WebAuthnMode,
  PasskeyValidatorContractVersion,
} from "@zerodev/passkey-validator";
import { getEntryPoint, KERNEL_V3_1 } from "@zerodev/sdk/constants";
import { APP_CHAIN, RPC_URL, ZERODEV_PROJECT_ID, TICKET_CONTRACT_ADDRESS, ENTRYPOINT_ADDRESS_V07 } from "@/config/chains";
import { TAPTICKET_ABI, DEFAULT_EVENT_CONFIG } from "@/config/contracts";
import { SmartAccountSession, TicketDetails, UserOpDetails } from "@/types";
import {
  createSimulatedPasskeyAccount,
  simulateSponsoredClaimTicket,
  saveLocalSession,
  saveLocalTicket,
  appendUserOp,
} from "./simulatedAA";

export const publicClient = createPublicClient({
  chain: APP_CHAIN,
  transport: http(RPC_URL),
});

const PASSKEY_SERVER_URL = "https://passkeys.zerodev.app/api/v2";

/**
 * Checks if live ZeroDev credentials are present
 */
export function isZeroDevConfigured(): boolean {
  return (
    typeof ZERODEV_PROJECT_ID === "string" &&
    ZERODEV_PROJECT_ID.trim().length > 0 &&
    ZERODEV_PROJECT_ID !== "your_zerodev_project_id_here"
  );
}

/**
 * Creates or logs in to a ZeroDev Passkey Kernel Smart Account
 */
export async function createOrLoginPasskeyAccount(
  username: string,
  mode: "register" | "login" = "register",
  forceSimulation: boolean = false
): Promise<SmartAccountSession> {
  if (forceSimulation || !isZeroDevConfigured()) {
    console.log("Using local/simulated Passkey Smart Account mode.");
    return createSimulatedPasskeyAccount(username);
  }

  try {
    const entryPoint = getEntryPoint("0.7");
    const kernelVersion = KERNEL_V3_1;

    // 1. Generate / Retrieve WebAuthn Passkey
    const webAuthnKey = await toWebAuthnKey({
      passkeyName: username || "Attendee Passkey",
      passkeyServerUrl: `${PASSKEY_SERVER_URL}/${ZERODEV_PROJECT_ID}`,
      mode: mode === "register" ? WebAuthnMode.Register : WebAuthnMode.Login,
    });

    // 2. Create Passkey Validator
    const passkeyValidator = await toPasskeyValidator(publicClient, {
      webAuthnKey,
      entryPoint,
      kernelVersion,
      validatorContractVersion: PasskeyValidatorContractVersion.V0_0_3_PATCHED,
    });

    // 3. Create Kernel Smart Account
    const kernelAccount = await createKernelAccount(publicClient, {
      plugins: {
        sudo: passkeyValidator,
      },
      entryPoint,
      kernelVersion,
    });

    const session: SmartAccountSession = {
      smartAccountAddress: kernelAccount.address,
      passkeyId: webAuthnKey.authenticatorId || `pk_${username}`,
      passkeyName: username,
      isDeployed: false,
      signerType: "passkey",
      createdAt: Date.now(),
    };

    saveLocalSession(session);
    return session;
  } catch (error) {
    console.warn("ZeroDev WebAuthn / live connection failed, falling back to simulated Smart Account:", error);
    return createSimulatedPasskeyAccount(username);
  }
}

/**
 * Claims a ticket using ZeroDev Paymaster (Sponsored Transaction)
 */
export async function sendSponsoredClaimTicketOp(
  session: SmartAccountSession,
  forceSimulation: boolean = false
): Promise<{ ticket: TicketDetails; userOp: UserOpDetails }> {
  if (forceSimulation || !isZeroDevConfigured() || session.signerType === "local_passkey_mock") {
    return simulateSponsoredClaimTicket(session);
  }

  try {
    const entryPoint = getEntryPoint("0.7");
    const kernelVersion = KERNEL_V3_1;

    // Reconstruct passkey validator
    const webAuthnKey = await toWebAuthnKey({
      passkeyName: session.passkeyName,
      passkeyServerUrl: `${PASSKEY_SERVER_URL}/${ZERODEV_PROJECT_ID}`,
      mode: WebAuthnMode.Login,
    });

    const passkeyValidator = await toPasskeyValidator(publicClient, {
      webAuthnKey,
      entryPoint,
      kernelVersion,
      validatorContractVersion: PasskeyValidatorContractVersion.V0_0_3_PATCHED,
    });

    const account = await createKernelAccount(publicClient, {
      plugins: {
        sudo: passkeyValidator,
      },
      entryPoint,
      kernelVersion,
    });

    // ZeroDev Paymaster Client for Sepolia Gas Sponsorship
    const zerodevPaymaster = createZeroDevPaymasterClient({
      chain: APP_CHAIN,
      transport: http(`https://rpc.zerodev.app/api/v2/paymaster/${ZERODEV_PROJECT_ID}`),
    });

    // Kernel Account Client with Bundler and Paymaster
    const kernelClient = createKernelAccountClient({
      account,
      chain: APP_CHAIN,
      bundlerTransport: http(`https://rpc.zerodev.app/api/v2/bundler/${ZERODEV_PROJECT_ID}`),
      paymaster: zerodevPaymaster,
      client: publicClient,
    });

    const callData = encodeFunctionData({
      abi: TAPTICKET_ABI,
      functionName: "claimTicket",
    });

    // Send UserOperation (Bundler + Paymaster)
    const userOpHash = await kernelClient.sendUserOperation({
      callData: await account.encodeCalls([
        {
          to: TICKET_CONTRACT_ADDRESS,
          value: BigInt(0),
          data: callData,
        },
      ]),
    });

    // Wait for UserOperation receipt
    const receipt = await kernelClient.waitForUserOperationReceipt({
      hash: userOpHash,
      timeout: 60000,
    });

    const now = Math.floor(Date.now() / 1000);
    const txHash = receipt.receipt.transactionHash;

    const userOp: UserOpDetails = {
      sender: account.address,
      nonce: "0x0",
      callData,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      bundlerStatus: "included",
      paymasterStatus: "sponsored",
      userOpHash,
      txHash,
      timestamp: now,
    };

    const ticket: TicketDetails = {
      attendeeAddress: account.address,
      hasTicket: true,
      isUsed: false,
      issuedAt: now,
      checkedInAt: 0,
      eventName: DEFAULT_EVENT_CONFIG.name,
      venue: DEFAULT_EVENT_CONFIG.venue,
      txHash,
      userOpHash,
      isSponsored: true,
    };

    saveLocalTicket(ticket);
    appendUserOp(userOp);

    return { ticket, userOp };
  } catch (error) {
    console.warn("Live ZeroDev UserOp failed, falling back to simulated execution:", error);
    return simulateSponsoredClaimTicket(session);
  }
}
