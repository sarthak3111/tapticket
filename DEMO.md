# TapTicket: 2-Minute Demo Script & Presentation Guide

**Event**: ROAD TO DEVCON – IIITN EDITION  
**Project**: TapTicket  
**Date**: August 30-31, 2026  

---

## 2-Minute Demo Script

### 0:00 – 0:20 | The Problem
> *"At student tech events and hackathons, ticketing is broken in two places. For attendees, getting an on-chain ticket requires installing a wallet extension, writing down 12 seed words, and begging for testnet ETH. 80% of students drop out right there. For organisers, check-in is run off a messy Google Form while someone eyeballs rows on a laptop at the door, hoping nobody uses a duplicate screenshot."*

### 0:20 – 0:40 | The Product
> *"We built TapTicket to solve both problems completely using ERC-4337 Account Abstraction. With TapTicket, an attendee creates an on-chain ticket pass in 5 seconds using their device Passkey — Touch ID, Face ID, or Windows Hello. No seed phrase, no funding step. The organiser's ZeroDev Paymaster pays the gas. At the door, the organiser scans the pass, and our smart contract permanently locks the ticket on-chain, making double entry mathematically impossible."*

### 0:40 – 1:30 | Live Demonstration
*(Presenter navigates on screen)*
1. **[0:40 - 0:55] 1-Click Passkey Onboarding**:
   - *"Watch: I enter my name `Sarthak` and click 'Create Passkey Ticket Wallet'."*
   - *(Touch ID / Windows Hello prompt appears and succeeds in 1 second)*
   - *"Notice that my ZeroDev Kernel Smart Account address was generated instantly. No 12-word seed phrases."*
2. **[0:55 - 1:10] Sponsored Ticket Claim**:
   - *"Now, I click 'Claim Free Ticket'. Notice that my balance is 0 ETH. The ZeroDev Paymaster sponsors the UserOperation."*
   - *(Confetti pops, official Pass with dynamic QR code appears)*
   - *"Here is my verified Road to Devcon pass, ready for Apple Wallet / Web3 pass check-in."*
3. **[1:10 - 1:30] Organiser Door Check-In & Duplicate Rejection**:
   - *"Now let's switch to the Organiser Gate Station (`/gate`)."*
   - *"The attendee presents their pass. When scanned the first time: 🟢 **ACCESS GRANTED**. The ticket is marked used on Sepolia."*
   - *"Now imagine a friend tries to reuse that same screenshot: 🔴 **ENTRY DENIED: ALREADY CHECKED IN**. Double entry is blocked by on-chain contract logic."*

### 1:30 – 1:50 | Where Account Abstraction is Used
> *"Account Abstraction is not decorative here — it is the entire reason this works:*
> *1. **Passkey Validator**: The device's Secure Enclave P-256 key acts as the signer for our ZeroDev Kernel v3 Smart Account.*
> *2. **ZeroDev Paymaster**: Sponsoring gas so students don't need faucets.*
> *3. **UserOperations & EntryPoint v0.7**: Transactions are bundled and executed atomically without requiring user RPC setup.*
> *(Click 'Inspect UserOp' to briefly show the real PackedUserOperation payload)."*

### 1:50 – 2:00 | Future Potential
> *"Next, we are adding Session Keys so student volunteers can check in attendees on their phones with temporary permissions, and batch issuance for student clubs. TapTicket makes Ethereum invisible, frictionless, and secure. Thank you!"*

---

## Demo Prerequisites & Checklist

- [x] Node.js and npm installed (`npm run dev`)
- [x] Web browser with WebAuthn support (Chrome, Safari, Edge, Brave)
- [x] App loaded at `http://localhost:3000`
- [x] Organiser Gate Station opened in a second tab or window at `http://localhost:3000/gate`
- [x] Demo Mode toggle tested for lightning-fast stage presentation if needed

---

## URLs & Network Information

| Resource | URL / Address |
| :--- | :--- |
| **Local App URL** | `http://localhost:3000` |
| **Organiser Gate URL** | `http://localhost:3000/gate` |
| **Attendee Pass URL** | `http://localhost:3000/ticket` |
| **Network** | Ethereum Sepolia Testnet (Chain ID: 11155111) |
| **TapTicket Contract** | `0x94fC49aE5779c13fe6F0a5814529FE5d81bFFe37` |
| **EntryPoint Contract** | `0x0000000071727De22E5E9d8BAf0edAc6f37da032` (v0.7) |
| **GitHub Repository** | `https://github.com/sarthak3111/tapticket` |

---

## Backup Plan

If stage WiFi is slow or testnet RPCs experience latency:
1. Tap the **"Demo Mode"** button in the top navigation bar.
2. The app will immediately use the local deterministic AA simulation engine, allowing the full Passkey -> Smart Account -> Sponsored UserOp -> Gate Check-In -> Rejection flow to run with zero latency.
