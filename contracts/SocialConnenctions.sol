// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract SocialConnections {
    mapping(address => address[]) private connections;

    function addConnection(address friend) public {
        connections[msg.sender].push(friend);
    }

    function getConnections() public view returns (address[] memory) {
        return connections[msg.sender];
    }
}
