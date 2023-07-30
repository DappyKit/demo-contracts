# Social Connections: A gasless way to manage your social network connections

SocialConnections is a smart contract written in Solidity that enables users to manage their social connections in a decentralized way. It uses Ethereum's EVM (Ethereum Virtual Machine) and makes use of the OpenGSN package, providing an opportunity for gasless transactions.

### How it works:

The contract represents each user with their social connections and a nonce. The `User` structure contains arrays of addresses a user is following and being followed by. The contract also keeps track of the relationship in mappings for quick lookups.

### Gasless transactions:

One of the significant features of the SocialConnections contract is its ability to perform gasless transactions. This means the transactions can be sponsored and users can interact with the contract without having ETH in their account, thus removing one of the main barriers to entry for new users.

This is achieved through the use of a MetaTransaction mechanism using the OpenGSN package. OpenGSN provides a decentralized gas payment network, enabling dapps to pay the gas fees instead of their users. The `ERC2771Recipient` contract from OpenGSN provides the functionality required for this.

The trusted forwarder address required for this is passed into the constructor of the contract during deployment.

### How to use:

The contract exposes several methods that a user can interact with:

- `follow`: This method allows a user to follow one or multiple users. It takes an array of addresses, checks if you're not following yourself or someone you're already following, then adds the address to the follower's and the followed user's lists respectively.

- `unfollow`: This method allows a user to unfollow one or multiple users. It takes an array of addresses, checks if you're following the user(s), then removes the address from the follower's and the unfollowed user's lists respectively.

- `unfollowAll`: This method allows a user to unfollow all users they're currently following.

- `getUser`: This view method returns the social connections and nonce of a user. The nonce is currently a placeholder for potential future use.

### How it protects your social network connections:

SocialConnections provides an on-chain, permissionless way of managing your social network connections, providing protection in several ways:

1. **No third-party involvement**: As a decentralized solution, there's no third-party managing your data. All the data related to your connections is stored on the Ethereum blockchain and not under any third party's control.

2. **Transparent and secure**: Since it's on the Ethereum blockchain, anyone can view and verify the contract code, and the immutable nature of blockchain ensures that once a connection is made, it can't be changed or removed without the correct function call from the connected addresses.

3. **User-controlled data**: The contract only exposes the connections data if the correct function is called, ensuring users have full control over who they connect with.

Remember to consider the cost of gas fees when you interact with the contract. If gas prices are high, it might be better to wait or bundle your interactions (like following and unfollowing) into fewer transactions to save on costs.

