import { defineChain } from "viem";

export const sepolia = defineChain({
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://ethereum-sepolia-rpc.publicnode.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://sepolia.etherscan.io",
    },
  },
  testnet: true,
});

export const APP_CHAIN = sepolia;

export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

export const ZERODEV_PROJECT_ID =
  process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID || "";

export const TICKET_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_TICKET_CONTRACT_ADDRESS ||
  "0x94fC49aE5779c13fe6F0a5814529FE5d81bFFe37"
) as `0x${string}`;

export const ENTRYPOINT_ADDRESS_V07 =
  "0x0000000071727De22E5E9d8BAf0edAc6f37da032" as `0x${string}`;
