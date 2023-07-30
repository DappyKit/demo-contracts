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


## Gas-less Transactions with OpenZeppelin Defender

The SocialConnections contract integrates Ethereum meta-transactions to facilitate gas-less transactions for users. This is done using OpenGSN (Open Gas Station Network), a decentralized solution for solving the user onboarding issue in Ethereum applications. However, to handle these meta-transactions, we utilize OpenZeppelin Defender.

OpenZeppelin Defender is a platform for automating Ethereum operations, which serves as the backbone of our relay system for handling meta-transactions. By making use of Defender's Relayer service, we set up a robust and secure system to accept meta-transaction requests from users, relay these to the Ethereum network, and cover the gas fees ourselves.

In the context of the SocialConnections contract, users can sign transactions indicating that they wish to follow or unfollow other users, or retrieve their social graph, and send these to the Defender Relayer. The Relayer then forwards these transactions to the contract on-chain, with itself as the message sender. As a result, users can interact with the SocialConnections contract without needing any ETH, making the user experience smoother and less intimidating for newcomers to the Ethereum ecosystem.



## Testing

Testing your code is an essential part of the development process. The following steps will guide you through the process of setting up the environment and running tests for the SocialConnections project.

### Install Dependencies

The first step in setting up the environment for testing is to install the necessary dependencies. Run the following command to do this:

```
npm ci
```

This command is similar to `npm install`, but it's designed to be used in automated environments such as test platforms, continuous integration, and deployment. It can be significantly faster and more reliable since it bypasses a package's `package.json` to install modules from a package’s `lockfile`. This ensures that you're testing against the exact dependencies specified in the `lockfile`.

### Setup and Run Local Blockchain

Next, you need to set up a local Ethereum blockchain for development purposes. We'll be using Ganache for this, which is a personal Ethereum blockchain used for Ethereum development you can use to deploy contracts, develop applications, and run tests. If you haven't already installed Ganache, you can do so via npm:

```
npm install -g ganache-cli
```

To run Ganache, simply execute:

```
ganache-cli
```

This command will start the Ganache blockchain, by default it runs on `http://localhost:8545`.

### Deploy GSN Contracts

The next step is to deploy the Gas Station Network (GSN) contracts onto the Ganache blockchain. This can be done using the GSN package's `start` command:

```
npx gsn start --loglevel debug
```

The `gsn start` command deploys the GSN contracts onto your local blockchain (Ganache in this case), while the `--loglevel debug` flag gives you verbose output about what's happening during the deployment.

### Deploy Your Contracts

Now it's time to deploy your own contracts. For this, we use the Truffle framework's `migrate` command. In your project's root directory, run:

```
truffle migrate
```

This command compiles and deploys your contracts to the Ganache blockchain. The state of the blockchain and the deployed contracts will be as defined in your migration scripts.

### Run Tests

After your contracts have been deployed, you're ready to run your tests. Again, we use the Truffle framework for this. In your project's root directory, run:

```
truffle test
```

This command will run your test files against the deployed contracts. If all tests pass, you can be confident that your contracts are working as expected. If any tests fail, you'll need to review your contracts and tests to find out what's going wrong.

Make sure that each of your tests is independent and can run in isolation, this helps in identifying and fixing issues in your contract.
