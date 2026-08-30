// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TapTicket
 * @dev Minimal, plain-mapping event ticketing contract for ROAD TO DEVCON – IIITN EDITION.
 *      Designed specifically for ERC-4337 Smart Accounts (ZeroDev Kernel) with Sponsored Gas.
 *      No ERC-721 tokens, no IPFS dependencies, no seed phrases required.
 */
contract TapTicket {
    // Event Metadata
    string public eventName;
    string public eventVenue;
    uint256 public maxCapacity;
    address public organiser;

    // Ticketing State Mappings (Plain mappings as per specification)
    mapping(address => bool) public hasValidTicket;
    mapping(address => bool) public isUsed;
    mapping(address => uint256) public ticketIssuedAt;
    mapping(address => uint256) public checkedInAt;

    // Counters
    uint256 public totalIssued;
    uint256 public totalCheckedIn;

    // Events for real-time indexing & gate listeners
    event TicketIssued(address indexed attendee, uint256 indexed ticketNumber, uint256 timestamp);
    event TicketCheckedIn(address indexed attendee, uint256 timestamp);
    event OrganiserTransferred(address indexed previousOrganiser, address indexed newOrganiser);

    // Custom Errors for gas efficiency and clear UI diagnostics
    error NotOrganiser();
    error EventSoldOut();
    error TicketAlreadyIssued();
    error NoValidTicket();
    error TicketAlreadyUsed();
    error InvalidAddress();

    modifier onlyOrganiser() {
        if (msg.sender != organiser) {
            revert NotOrganiser();
        }
        _;
    }

    constructor(
        string memory _name,
        string memory _venue,
        uint256 _maxCapacity
    ) {
        organiser = msg.sender;
        eventName = _name;
        eventVenue = _venue;
        maxCapacity = _maxCapacity;
    }

    /**
     * @notice Allows an attendee's Smart Account to self-claim their ticket.
     *         Called as a sponsored UserOperation via the ZeroDev Paymaster.
     */
    function claimTicket() external {
        _issueTicket(msg.sender);
    }

    /**
     * @notice Organiser can directly issue a ticket to an attendee Smart Account address.
     * @param attendee Address of the attendee's Smart Account
     */
    function issueTicket(address attendee) external onlyOrganiser {
        _issueTicket(attendee);
    }

    function _issueTicket(address attendee) internal {
        if (attendee == address(0)) revert InvalidAddress();
        if (hasValidTicket[attendee]) revert TicketAlreadyIssued();
        if (totalIssued >= maxCapacity) revert EventSoldOut();

        hasValidTicket[attendee] = true;
        ticketIssuedAt[attendee] = block.timestamp;
        totalIssued++;

        emit TicketIssued(attendee, totalIssued, block.timestamp);
    }

    /**
     * @notice Organiser check-in gatekeeper function.
     *         Validates ticket on-chain, marks it used, and reverts on duplicates.
     * @param attendee Address of the attendee claiming entry
     */
    function checkIn(address attendee) external onlyOrganiser {
        if (attendee == address(0)) revert InvalidAddress();
        if (!hasValidTicket[attendee]) revert NoValidTicket();
        if (isUsed[attendee]) revert TicketAlreadyUsed();

        isUsed[attendee] = true;
        checkedInAt[attendee] = block.timestamp;
        totalCheckedIn++;

        emit TicketCheckedIn(attendee, block.timestamp);
    }

    /**
     * @notice Helper to transfer organiser authority if needed
     */
    function transferOrganiser(address newOrganiser) external onlyOrganiser {
        if (newOrganiser == address(0)) revert InvalidAddress();
        address old = organiser;
        organiser = newOrganiser;
        emit OrganiserTransferred(old, newOrganiser);
    }

    /**
     * @notice Returns comprehensive status of an attendee's ticket
     */
    function getTicketStatus(address attendee)
        external
        view
        returns (
            bool hasTicket,
            bool used,
            uint256 issuedTime,
            uint256 checkInTime
        )
    {
        return (
            hasValidTicket[attendee],
            isUsed[attendee],
            ticketIssuedAt[attendee],
            checkedInAt[attendee]
        );
    }

    /**
     * @notice Returns event summary statistics
     */
    function getEventStats()
        external
        view
        returns (
            string memory name,
            string memory venue,
            uint256 capacity,
            uint256 issued,
            uint256 checkedIn
        )
    {
        return (
            eventName,
            eventVenue,
            maxCapacity,
            totalIssued,
            totalCheckedIn
        );
    }
}
