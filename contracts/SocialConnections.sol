// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SocialConnections
 * @dev Contract to manage social connections (following, followers) and permissions for MetaTransactions
 */
contract SocialConnections {

    struct User {
        address[] following;
        address[] followers;
        mapping(address => bool) isFollowing;
        mapping(address => bool) isFollowedBy;
        address[] allowedMetaContracts;
        mapping(address => bool) isAllowedMetaContract;
    }

    mapping(address => User) private users;

    event Follow(address indexed follower, address indexed following);
    event Unfollow(address indexed follower, address indexed following);
    event AllowedMetaContractAdded(address indexed user, address indexed metaContract);
    event AllowedMetaContractRemoved(address indexed user, address indexed metaContract);

    /**
     * @notice A user follows another user or multiple users
     * @param usersToFollow The address of the user(s) to follow
     */
    function follow(address[] memory usersToFollow) public {
        for (uint256 i = 0; i < usersToFollow.length; i++) {
            address userToFollow = usersToFollow[i];
            require(msg.sender != userToFollow, "Cannot follow yourself");
            require(!users[msg.sender].isFollowing[userToFollow], "Already following");

            users[msg.sender].following.push(userToFollow);
            users[msg.sender].isFollowing[userToFollow] = true;
            users[userToFollow].followers.push(msg.sender);
            users[userToFollow].isFollowedBy[msg.sender] = true;

            emit Follow(msg.sender, userToFollow);
        }
    }

    /**
     * @notice A user unfollows another user or multiple users
     * @param usersToUnfollow The address of the user(s) to unfollow
     */
    function unfollow(address[] memory usersToUnfollow) public {
        for (uint256 i = 0; i < usersToUnfollow.length; i++) {
            address userToUnfollow = usersToUnfollow[i];
            require(users[msg.sender].isFollowing[userToUnfollow], "Not following this user");

            removeAddressFromArray(users[msg.sender].following, userToUnfollow);
            users[msg.sender].isFollowing[userToUnfollow] = false;
            removeAddressFromArray(users[userToUnfollow].followers, msg.sender);
            users[userToUnfollow].isFollowedBy[msg.sender] = false;

            emit Unfollow(msg.sender, userToUnfollow);
        }
    }

    /**
     * @notice A user adds a meta contract to their allowed list
     * @param metaContracts The address of the meta contract(s) to add
     */
    function addAllowedMetaContracts(address[] memory metaContracts) public {
        for (uint256 i = 0; i < metaContracts.length; i++) {
            address metaContract = metaContracts[i];
            require(msg.sender != metaContract, "Cannot add yourself");
            require(!users[msg.sender].isAllowedMetaContract[metaContract], "Already added");

            users[msg.sender].allowedMetaContracts.push(metaContract);
            users[msg.sender].isAllowedMetaContract[metaContract] = true;

            emit AllowedMetaContractAdded(msg.sender, metaContract);
        }
    }

    /**
     * @notice A user removes a meta contract from their allowed list
     * @param metaContracts The address of the meta contract(s) to remove
     */
    function removeAllowedMetaContracts(address[] memory metaContracts) public {
        for (uint256 i = 0; i < metaContracts.length; i++) {
            address metaContract = metaContracts[i];
            require(users[msg.sender].isAllowedMetaContract[metaContract], "Not added");

            removeAddressFromArray(users[msg.sender].allowedMetaContracts, metaContract);
            users[msg.sender].isAllowedMetaContract[metaContract] = false;

            emit AllowedMetaContractRemoved(msg.sender, metaContract);
        }
    }

    /**
     * @notice A user removes all followers
     */
    function removeAllFollowers() public {
        for (uint256 i = 0; i < users[msg.sender].followers.length; i++) {
            address follower = users[msg.sender].followers[i];
            users[follower].isFollowing[msg.sender] = false;
            removeAddressFromArray(users[follower].following, msg.sender);
        }
        delete users[msg.sender].followers;
    }

    /**
     * @notice A user removes all allowed meta contracts
     */
    function removeAllAllowedMetaContracts() public {
        for (uint256 i = 0; i < users[msg.sender].allowedMetaContracts.length; i++) {
            delete users[msg.sender].isAllowedMetaContract[users[msg.sender].allowedMetaContracts[i]];
        }
        delete users[msg.sender].allowedMetaContracts;
    }

    /**
     * @dev Helper function to remove an address from an array
     * @param array The array to remove from
     * @param toRemove The address to remove
     */
    function removeAddressFromArray(address[] storage array, address toRemove) private {
        for(uint i = 0; i < array.length; i++){
            if(array[i] == toRemove){
                array[i] = array[array.length-1];
                array.pop();
                break;
            }
        }
    }
}
