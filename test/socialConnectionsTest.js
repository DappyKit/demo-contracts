const SocialConnections = artifacts.require("SocialConnections");

contract('SocialConnections', (accounts) => {
    let [alice, bob] = accounts;
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await SocialConnections.new();
    });

    it('should add a new connection', async () => {
        await contractInstance.addConnection(bob, {from: alice});
        let connections = await contractInstance.getConnections({from: alice});

        assert.equal(connections.length, 1);
        assert.equal(connections[0], bob);
    });
});
