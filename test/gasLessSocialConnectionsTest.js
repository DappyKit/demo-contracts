const SocialConnections = artifacts.require("SocialConnections");
const {Web3} = require("web3");
const Forwarder = require('../build/gsn/Forwarder.json');
const Paymaster = require('../build/gsn/Paymaster.json');
const {RelayProvider} = require('@opengsn/provider');
const SocialConnectionsABI = require('../build/contracts/SocialConnections.json').abi;

describe("SocialConnections Gas-less", function () {
    let accounts;
    let socialConnections;
    let userWallet;
    let provider;
    let from;
    let socialConnectionsGasless;

    before(async function () {
        this.timeout(40000);
        accounts = await web3.eth.getAccounts();
        socialConnections = await SocialConnections.new(Forwarder.address);
        userWallet = web3.eth.accounts.create();

        const gsnConfig = {
            paymasterAddress: Paymaster.address,
            loggerConfiguration: {
                logLevel: 'off'
            }
        };
        provider = await RelayProvider.newProvider({provider: web3.currentProvider, config: gsnConfig}).init();
        from = provider.newAccount().address;
        socialConnectionsGasless = new (new Web3(provider)).eth.Contract(SocialConnectionsABI, socialConnections.address);
    });

    it("Follow a user gas-less", async function() {
        const follower = from;
        const following = accounts[0];

        // Now, account 1 follows account 2
        await socialConnectionsGasless.methods.follow([following]).send({ from: follower });

        const user = await socialConnectionsGasless.methods.getUser(follower).call();
        expect(user.following.includes(following)).to.be.true;

        const userFollowed = await socialConnectionsGasless.methods.getUser(following).call();
        expect(userFollowed.followers.includes(follower)).to.be.true;
    });

    it("Follow multiple users gas-less", async function() {
        const follower = from;
        const following = [accounts[0], accounts[1], accounts[2]];

        // Check if already following
        for (let i = 0; i < following.length; i++) {
            let user = await socialConnectionsGasless.methods.getUser(follower).call();
            if (!user.following.includes(following[i])) {
                await socialConnectionsGasless.methods.follow([following[i]]).send({ from: follower });
            }

            user = await socialConnectionsGasless.methods.getUser(follower).call();
            expect(user.following.includes(following[i])).to.be.true;

            const userFollowed = await socialConnectionsGasless.methods.getUser(following[i]).call();
            expect(userFollowed.followers.includes(follower)).to.be.true;
        }
    });

    it("Unfollow multiple users gas-less", async function() {
        const follower = from;
        const following = [accounts[0], accounts[1], accounts[2]];

        // Check if not already unfollowed
        for (let i = 0; i < following.length; i++) {
            let user = await socialConnectionsGasless.methods.getUser(follower).call();
            if (user.following.includes(following[i])) {
                await socialConnectionsGasless.methods.unfollow([following[i]]).send({ from: follower });
            }

            user = await socialConnectionsGasless.methods.getUser(follower).call();
            expect(user.following.includes(following[i])).to.be.false;

            const userFollowed = await socialConnectionsGasless.methods.getUser(following[i]).call();
            expect(userFollowed.followers.includes(follower)).to.be.false;
        }
    });

    it("Unfollow all users", async function() {
        const accountsToFollow = [accounts[0], accounts[1], accounts[2]];
        await socialConnectionsGasless.methods.follow(accountsToFollow).send({from});
        await socialConnectionsGasless.methods.unfollowAll().send({from});

        const user = await socialConnectionsGasless.methods.getUser(from).call();
        expect(user.following.length).to.equal(0);
    });

    it("Follow no one (empty array)", async function() {
        await socialConnectionsGasless.methods.follow([]).send({from});
        const user = await socialConnectionsGasless.methods.getUser(from).call();
        expect(user.following.length).to.equal(0);
    });

    it("Unfollow no one (empty array)", async function() {
        await socialConnectionsGasless.methods.unfollow([]).send({from});
        const user = await socialConnectionsGasless.methods.getUser(from).call();
        expect(user.following.length).to.equal(0);
    });
});
