const SocialConnections = artifacts.require("SocialConnections");

module.exports = function(deployer) {
    deployer.deploy(SocialConnections);
};
