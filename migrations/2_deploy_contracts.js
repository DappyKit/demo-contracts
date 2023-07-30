const SocialConnections = artifacts.require("SocialConnections");
const forwarder = require('../build/gsn/Forwarder.json')

module.exports = async function(deployer) {
    await deployer.deploy(SocialConnections, forwarder.address);
    await SocialConnections.deployed();
};
