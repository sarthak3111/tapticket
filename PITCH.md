# TapTicket — Project Pitch & Presentation Summary

## Project Name
**TapTicket**

## One-Line Pitch
*Zero-friction, passkey-powered event ticketing on Ethereum where students claim passes in 30 seconds with zero gas fees, and organisers eliminate spreadsheet check-in chaos forever.*

---

## The Problem
Student-run tech events, campus meetups, and hackathons struggle with two major failure points:
1. **Attendee Onboarding Wall**: Forcing newcomers to install wallet extensions, safeguard 12 seed words, and acquire testnet ETH leads to massive drop-offs before the event even starts.
2. **Gatekeeper Verification Chaos**: Organisers rely on fragile Google Sheets and eyeballed lists at the door, making check-in slow and vulnerable to screenshot sharing, duplicate entries, and counterfeit tickets.

---

## The Solution
TapTicket provides an invisible Ethereum ticketing layer:
* **Passkey Onboarding**: Attendees authenticate with Touch ID, Face ID, or Windows Hello. A ZeroDev Kernel Smart Account (ERC-4337) is created instantly.
* **Sponsored Gas**: The ZeroDev Paymaster pays all transaction fees. Attendees claim tickets with 0 ETH.
* **Autonomous Gate Check-In**: The door scanner validates passes against a minimal on-chain smart contract (`TapTicket.sol`), marking the ticket used and mathematically rejecting duplicate entries.

---

## Target Users
1. **Event Attendees & Students**: Get verified entry passes in under 30 seconds without needing prior crypto knowledge or wallet setup.
2. **Campus Organisers & Hackathon Leads**: Run seamless, counterfeit-proof door check-in without buying gas for every attendee or managing manual spreadsheets.

---

## Why Ethereum?
* **Immutable State**: Single-source-of-truth verification that prevents counterfeit tickets and double entry.
* **Decentralized Identity**: Attendees own their smart account pass, enabling interoperable badges and proof-of-attendance verifiable anywhere.
* **Composability**: Ticketing state can easily integrate with on-chain hackathon voting, POAPs, and prize distributions.

---

## Why Account Abstraction?
Account Abstraction is the key technical enabler:
* **Signer-Account Decoupling**: Replaces 12-word seed phrases with device biometrics (WebAuthn P-256 validator).
* **Paymaster Gas Sponsorship**: Lets organisers sponsor user operations so attendees pay $0 gas.
* **Bundler Coordination**: Bundles UserOperations to execute through standard EntryPoint v0.7 without user RPC setup.

---

## Main Innovation
Bridging **WebAuthn hardware security** directly to **ERC-4337 modular smart accounts** for frictionless physical event gatekeeping. Good Account Abstraction hides blockchain complexity while preserving its cryptographic integrity.

---

## Architecture Summary
```
Attendee Device (Passkey / WebAuthn P-256)
   ↓ [Signed UserOp]
ZeroDev Kernel v3 Smart Account
   ↓ [Sponsorship Request]
ZeroDev Paymaster (Gas Sponsored)
   ↓ [handleOps]
EntryPoint v0.7 Contract (Sepolia)
   ↓ [Execution]
TapTicket.sol (Plain Mappings)
   ↓ [Door Verification]
Organiser Gatekeeper Scanner (/gate)
```

---

## Challenges Overcome
* **WebAuthn Signature Serialization**: Bridging browser P-256 WebAuthn assertions into EVM-verifiable smart contract validator payloads via ZeroDev Passkey Validator.
* **Zero-Friction UX**: Creating a unified flow that hides gas, nonces, and calldata from the attendee while providing an educational inspector drawer for judges.
* **Fail-Safe Gate Verification**: Building robust door check-in that works both live on Sepolia and via deterministic demo mode for stage presentations.

---

## Future Roadmap
1. **Session Keys**: Temporary, role-based permission keys for student door volunteers to scan tickets on mobile without accessing admin master keys.
2. **Batch Ticket Minting**: Bulk issuing of 100+ tickets in a single UserOp bundle.
3. **Multi-Event Factory**: Deploying lightweight event instances per campus club.
4. **POAP / SBT Auto-Mint**: Automatically minting attendance soulbound tokens upon successful door check-in.
