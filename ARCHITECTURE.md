# TapTicket Architecture & System Design

**Project**: TapTicket  
**Hackathon**: ROAD TO DEVCON – IIITN EDITION (IIIT Nagpur × Bhaisaaab)  
**Target Chain**: Ethereum Sepolia Testnet  

---

## 1. Executive Summary

TapTicket solves two acute problems in student-run technical events:
1. **Attendee Drop-off**: Having to install a browser wallet, back up seed phrases, and acquire gas before claiming a ticket.
2. **Door Verification Chaos**: Organisers checking in attendees with fragile Google Forms and eyeballing spreadsheets.

To solve this, TapTicket deploys a specialized **ERC-4337 Account Abstraction** pipeline where **Passkeys (WebAuthn P-256)** authenticate a **ZeroDev Kernel Smart Account**, and a **ZeroDev Paymaster** sponsors transaction gas.

---

## 2. End-to-End Architectural Pipeline

```mermaid
flowchart TD
    subgraph Client ["1. Client / User Layer"]
        A[User Device] -->|TouchID / FaceID / Windows Hello| B[WebAuthn Passkey\nP-256 Curve]
        B -->|P-256 Signature| C[Next.js App Interface]
    end

    subgraph AA_Layer ["2. Account Abstraction Layer (ZeroDev)"]
        C -->|Constructs UserOp| D[ZeroDev Kernel v3 Account]
        D -->|Passkey Validator Plugin| E[PackedUserOperation]
        E -->|Request Sponsorship| F[ZeroDev Paymaster Client]
        F -->|Appends PaymasterAndData| E
    end

    subgraph Infra_Layer ["3. ERC-4337 Infrastructure Layer"]
        E -->|sendUserOperation| G[ZeroDev Bundler RPC]
        G -->|handleOps| H[EntryPoint v0.7\n0x0000000071727De22E5E9d8BAf0edAc6f37da032]
    end

    subgraph Chain_Layer ["4. Blockchain Execution Layer (Sepolia)"]
        H -->|validateUserOp & execute| I[Kernel Smart Account Contract]
        I -->|claimTicket\ncalldata| J[TapTicket.sol\nPlain Mappings Contract]
        J -->|Emits Event| K[TicketIssued Event]
    end

    subgraph Door_Layer ["5. Gate Verification (Organiser)"]
        L[Organiser Device / Scanner] -->|Scans QR Code| M[/api/checkin Endpoint]
        M -->|checkIn attendee| J
        J -->|State Transition| N[isUsed attendee = true]
    end
```

---

## 3. Detailed Component Breakdown & Rationale

### 3.1 WebAuthn Passkeys (Hardware Signer)
* **What it is**: Cryptographic keypair generation running directly in the device's Secure Enclave / TPM chip using the P-256 (secp256r1) elliptic curve.
* **Why it exists**: Regular Ethereum accounts use secp256k1 curves requiring raw private keys or 12-word seed phrases. WebAuthn allows attendees to sign using their fingerprint, facial recognition, or screen lock.
* **Why it matters**: Zero seed phrase backup. Zero extension downloads. Onboarding time drops from 10 minutes to under 5 seconds.

### 3.2 ZeroDev Kernel v3 Smart Account (ERC-4337)
* **What it is**: A modular smart contract wallet architecture developed by ZeroDev.
* **Why it exists**: Instead of treating the signer as the account (the EOA limitation), the Smart Account is an independent contract on Ethereum. The Passkey is installed as a `WebAuthnValidator` plugin authorized to execute operations on behalf of the Smart Account.
* **Why it matters**: Counterfactual address generation means the attendee's address is known immediately upon passkey registration, even before the contract is deployed on-chain!

### 3.3 ZeroDev Paymaster (Gas Abstraction)
* **What it is**: An ERC-4337 Paymaster service that validates user operations and pays the required native ETH gas to EntryPoint v0.7.
* **Why it exists**: In standard Ethereum, an account without ETH cannot broadcast transactions. The Paymaster allows the event organiser to sponsor tickets so the attendee pays exactly $0.00.
* **Why it matters**: Eliminates the faucet bottleneck at campus events.

### 3.4 EntryPoint v0.7 Contract
* **What it is**: Canonical singleton contract (`0x0000000071727De22E5E9d8BAf0edAc6f37da032`) standardizing ERC-4337 execution across Ethereum.
* **Why it exists**: Coordinates account validation, gas payments with the Paymaster, and calldata dispatch to the smart account.

### 3.5 TapTicket.sol (Target Ticket Contract)
* **What it is**: Minimal Solidity 0.8.20 smart contract using plain mappings:
  ```solidity
  mapping(address => bool) public hasValidTicket;
  mapping(address => bool) public isUsed;
  mapping(address => uint256) public ticketIssuedAt;
  mapping(address => uint256) public checkedInAt;
  ```
* **Why it exists**:
  - **No ERC-721 overhead**: Avoids unnecessary token transfers, approval logic, and metadata URLs.
  - **Single Event Scope**: Designed specifically for one event and one ticket type to minimize gas and attack surface.
  - **Guaranteed Single Entry**: `checkIn(address attendee)` sets `isUsed[attendee] = true` and reverts on any subsequent attempt with `revert TicketAlreadyUsed()`.

---

## 4. Key Design Decisions & Trade-Offs

| Architectural Choice | Chosen Approach | Alternative Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **Ticket Data Model** | Plain Mappings (`TapTicket.sol`) | ERC-721 / ERC-1155 NFT | NFTs introduce transfer complications, secondary market spam, and IPFS dependency. Plain mappings provide instant on-chain verification at minimal gas. |
| **Signer Method** | WebAuthn Passkeys (P-256) | Social Login (Google / Twitter) | Passkeys require zero centralized OAuth servers, store keys securely on the user's physical device, and never leak credentials. |
| **AA SDK** | ZeroDev SDK v5 + Kernel v3 | Biconomy / Alchemy | ZeroDev provides first-class native WebAuthn/Passkey validator plugins with optimized gas on EntryPoint v0.7. |
| **Gas Abstraction** | Paymaster Sponsorship | User Faucet Funding | Faucets create high friction and rate-limiting failures; paymasters provide a seamless 1-click claim. |
| **Presentation Reliability** | Built-in Dual-Engine (Live + Demo Mode) | Live Testnet Only | Hackathon stage presentations often suffer from hotel/campus WiFi latency or faucet drains; the demo engine ensures 100% demo reliability. |

---

## 5. Security & Verification Analysis

1. **Anti-Counterfeit QR Codes**: The ticket QR code encodes the attendee's Smart Account address. The gate scanner verifies the on-chain mapping directly.
2. **Double-Check-In Prevention**: Re-scanning an already-checked-in QR code immediately queries `isUsed[attendee]` on-chain, rendering screenshot sharing or counterfeit passes useless.
3. **No Private Key Custody**: Neither the application nor the organiser ever handles or stores attendee private keys.
