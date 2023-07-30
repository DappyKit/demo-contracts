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

    it("should execute gas-less transactions", async function () {
        const accountsToFollow = [accounts[0], accounts[1]];
        await socialConnectionsGasless.methods.follow(accountsToFollow).send({from});

        let user = await socialConnectionsGasless.methods.getUser(from).call();
        // Stringify arrays before comparing
        expect(JSON.stringify(user.following)).to.equal(JSON.stringify(accountsToFollow));

        await socialConnectionsGasless.methods.unfollowAll().send({from});
        user = await socialConnectionsGasless.methods.getUser(from).call();
        expect(user.following.length).to.equal(0);
    });
});
