export const TAPTICKET_ABI = [
  {
    "type": "constructor",
    "inputs": [
      { "name": "_name", "type": "string", "internalType": "string" },
      { "name": "_venue", "type": "string", "internalType": "string" },
      { "name": "_maxCapacity", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "checkIn",
    "inputs": [{ "name": "attendee", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimTicket",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "issueTicket",
    "inputs": [{ "name": "attendee", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getEventStats",
    "inputs": [],
    "outputs": [
      { "name": "name", "type": "string", "internalType": "string" },
      { "name": "venue", "type": "string", "internalType": "string" },
      { "name": "capacity", "type": "uint256", "internalType": "uint256" },
      { "name": "issued", "type": "uint256", "internalType": "uint256" },
      { "name": "checkedIn", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTicketStatus",
    "inputs": [{ "name": "attendee", "type": "address", "internalType": "address" }],
    "outputs": [
      { "name": "hasTicket", "type": "bool", "internalType": "bool" },
      { "name": "used", "type": "bool", "internalType": "bool" },
      { "name": "issuedTime", "type": "uint256", "internalType": "uint256" },
      { "name": "checkInTime", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasValidTicket",
    "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isUsed",
    "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "eventName",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "eventVenue",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "maxCapacity",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "organiser",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalCheckedIn",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalIssued",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "TicketIssued",
    "inputs": [
      { "name": "attendee", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "ticketNumber", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TicketCheckedIn",
    "inputs": [
      { "name": "attendee", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "NotOrganiser",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EventSoldOut",
    "inputs": []
  },
  {
    "type": "error",
    "name": "TicketAlreadyIssued",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoValidTicket",
    "inputs": []
  },
  {
    "type": "error",
    "name": "TicketAlreadyUsed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidAddress",
    "inputs": []
  }
] as const;

export const DEFAULT_EVENT_CONFIG = {
  name: "ROAD TO DEVCON – IIITN EDITION",
  subtitle: "Ethereum Research Workshop & Builders Lab",
  organizer: "IIIT Nagpur × Bhaisaaab",
  venue: "Academic Block Auditorium, IIIT Nagpur Campus",
  date: "August 30-31, 2026",
  capacity: 350,
  defaultContractAddress: "0x94fC49aE5779c13fe6F0a5814529FE5d81bFFe37" as `0x${string}`,
};
