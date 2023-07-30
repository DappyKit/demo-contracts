// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@opengsn/contracts/src/ERC2771Recipient.sol";

/**
 * @title SocialConnections
 * @dev Contract to manage social connections (following, followers) and permissions for MetaTransactions
 */
contract SocialConnections is ERC2771Recipient {

    /**
     * @dev Represents a user with their social connections and a nonce.
     * Each user has a list of addresses they are following and their followers.
     * We also track the relationships in mappings for quick lookups.
     * Nonce is a placeholder for potential future use.
     */
    struct User {
        address[] following;
        address[] followers;
        mapping(address => bool) isFollowing;
        mapping(address => bool) isFollowedBy;
        uint256 nonce;
    }

    /**
     * @dev Mapping of user addresses to User structs.
     */
    mapping(address => User) private users;

    /**
     * @dev Event emitted when a user starts following another user.
     */
    event Follow(address indexed follower, address indexed following);

    /**
     * @dev Event emitted when a user stops following another user.
     */
    event Unfollow(address indexed follower, address indexed following);

    /**
     * @dev Constructs the contract, setting the trusted forwarder for meta transactions.
     * @param forwarder Trusted forwarder address
     */
    constructor(address forwarder) {
        _setTrustedForwarder(forwarder);
    }

    /**
     * @notice Allows a user to follow one or multiple users
     * @param usersToFollow The address of the user(s) to follow
     */
    function follow(address[] memory usersToFollow) public {
        address msgSender = _msgSender();
        for (uint256 i = 0; i < usersToFollow.length; i++) {
            address userToFollow = usersToFollow[i];

            require(msgSender != userToFollow, "Cannot follow yourself");
            require(!users[msgSender].isFollowing[userToFollow], "Already following");

            users[msgSender].following.push(userToFollow);
            users[msgSender].isFollowing[userToFollow] = true;
            users[userToFollow].followers.push(msgSender);
            users[userToFollow].isFollowedBy[msgSender] = true;

            emit Follow(msgSender, userToFollow);
        }
    }

    /**
     * @notice Allows a user to unfollow one or multiple users
     * @param usersToUnfollow The address of the user(s) to unfollow
     */
    function unfollow(address[] memory usersToUnfollow) public {
        address msgSender = _msgSender();
        for (uint256 i = 0; i < usersToUnfollow.length; i++) {
            address userToUnfollow = usersToUnfollow[i];

            require(users[msgSender].isFollowing[userToUnfollow], "Not following this user");

            removeAddressFromArray(users[msgSender].following, userToUnfollow);
            users[msgSender].isFollowing[userToUnfollow] = false;
            removeAddressFromArray(users[userToUnfollow].followers, msgSender);
            users[userToUnfollow].isFollowedBy[msgSender] = false;

            emit Unfollow(msgSender, userToUnfollow);
        }
    }

    /**
     * @notice Allows a user to unfollow all users they're currently following
     */
    function unfollowAll() public {
        address msgSender = _msgSender();
        for (uint256 i = users[msgSender].following.length; i > 0; i--) {
            address userToUnfollow = users[msgSender].following[i - 1];

            users[msgSender].following.pop();
            users[msgSender].isFollowing[userToUnfollow] = false;
            removeAddressFromArray(users[userToUnfollow].followers, msgSender);
            users[userToUnfollow].isFollowedBy[msgSender] = false;

            emit Unfollow(msgSender, userToUnfollow);
        }
    }

    /**
     * @dev Removes an address from an array in storage.
     * This is a helper function to manage lists of followers and following.
     * @param array The array to remove from
     * @param toRemove The address to remove
     */
    function removeAddressFromArray(address[] storage array, address toRemove) private {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == toRemove) {
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }

    /**
     * @notice Returns the social connections and nonce of a user
     * @param userAddress The address of the user
     * @return following The addresses the user is following
     * @return followers The addresses following the user
     * @return nonce The nonce of the user
     */
    function getUser(address userAddress) public view returns (
        address[] memory following,
        address[] memory followers,
        uint256 nonce
    ) {
        User storage user = users[userAddress];
        following = user.following;
        followers = user.followers;
        nonce = user.nonce;
    }
}
