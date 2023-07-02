// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract SimpleAutomation is AutomationCompatibleInterface {
    uint private s_interval;
    uint private s_counter;
    uint private s_lastTimestamp;
    address payable[] private s_tickets;

    event CheckUpkeepCall(address indexed keeper, uint timePassed, bool upkeepNeeded);
    event PerformUpkeepCall(address indexed keeper, uint lastTimestamp, uint counter);

    constructor(uint updateInterval) {
        s_interval = updateInterval;
        s_lastTimestamp = block.timestamp;
        s_counter = 0;
    }

    function checkUpkeep(bytes calldata /* checkData */) external override returns (bool upkeepNeeded, bytes memory /* performData */) {
        uint timePassed = (block.timestamp - s_lastTimestamp);
        upkeepNeeded = timePassed > s_interval;
        emit CheckUpkeepCall(msg.sender, timePassed, upkeepNeeded);
        return (upkeepNeeded, "0x");
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        if (block.timestamp - s_lastTimestamp > s_interval) {
            s_lastTimestamp = block.timestamp;
            s_counter += 1;
            emit PerformUpkeepCall(msg.sender, s_lastTimestamp, s_counter);
        }
    }

    function getCounter() public view returns (uint) {
        return s_counter;
    }

    function getLastTimeStamp() public view returns (uint) {
        return s_lastTimestamp;
    }

    function getInterval() public view returns (uint) {
        return s_interval;
    }

    function setInterval(uint interval) public {
        s_interval = interval;
    }

    function getNumberOfTickets() public view returns (uint) {
        return s_tickets.length;
    }

    function addBulkOfTickets(uint ticketsNumber) public {
        for (uint ticketId = 0; ticketId < ticketsNumber; ticketId++) {
            s_tickets.push(payable(msg.sender));
        }
    }

    function resetTickets() public {
        s_tickets = new address payable[](0);
    }
}
