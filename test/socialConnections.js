const SocialConnections = artifacts.require("SocialConnections");
const { expect } = require('chai');

describe("SocialConnections", function() {
    let accounts;
    let socialConnections;

    beforeEach(async function() {
        accounts = await web3.eth.getAccounts();
        socialConnections = await SocialConnections.new(accounts[0]);
    });

    it("Follow a user", async function() {
        const follower = accounts[1];
        const following = accounts[2];

        // Initially, no one follows the other
        let user = await socialConnections.getUser(follower);
        expect(user.following.includes(following)).to.be.false;

        user = await socialConnections.getUser(following);
        expect(user.followers.includes(follower)).to.be.false;

        // Now, account 1 follows account 2
        await socialConnections.follow([following], { from: follower });

        user = await socialConnections.getUser(follower);
        expect(user.following.includes(following)).to.be.true;

        user = await socialConnections.getUser(following);
        expect(user.followers.includes(follower)).to.be.true;
    });

    it("Follow multiple users", async function() {
        const follower = accounts[1];
        const following = [accounts[2], accounts[3], accounts[4]];

        // Check if already following
        for (let i = 0; i < following.length; i++) {
            let user = await socialConnections.getUser(follower);
            if (!user.following.includes(following[i])) {
                await socialConnections.follow([following[i]], { from: follower });
            }

            user = await socialConnections.getUser(follower);
            expect(user.following.includes(following[i])).to.be.true;

            user = await socialConnections.getUser(following[i]);
            expect(user.followers.includes(follower)).to.be.true;
        }
    });

    it("Unfollow multiple users", async function() {
        const follower = accounts[1];
        const following = [accounts[2], accounts[3], accounts[4]];

        // Check if not already unfollowed
        for (let i = 0; i < following.length; i++) {
            let user = await socialConnections.getUser(follower);
            if (user.following.includes(following[i])) {
                await socialConnections.unfollow([following[i]], { from: follower });
            }

            user = await socialConnections.getUser(follower);
            expect(user.following.includes(following[i])).to.be.false;

            user = await socialConnections.getUser(following[i]);
            expect(user.followers.includes(follower)).to.be.false;
        }
    });

    it("Unfollow all users", async function() {
        const follower = accounts[1];
        const following = [accounts[2], accounts[3], accounts[4]];

        // Initially, account 1 follows account 2, 3, 4 only if not already following
        for (let i = 0; i < following.length; i++) {
            let user = await socialConnections.getUser(follower);
            if (!user.following.includes(following[i])) {
                await socialConnections.follow([following[i]], { from: follower });
            }
        }

        // Now, account 1 unfollows all
        await socialConnections.unfollowAll({ from: follower });

        for (let i = 0; i < following.length; i++) {
            let user = await socialConnections.getUser(follower);
            expect(user.following.includes(following[i])).to.be.false;

            user = await socialConnections.getUser(following[i]);
            expect(user.followers.includes(follower)).to.be.false;
        }
    });

    it("Follow yourself", async function() {
        const follower = accounts[1];

        try {
            await socialConnections.follow([follower], { from: follower });
            assert.fail("Expected revert not received");
        } catch (error) {
            expect(error.message).to.include("Cannot follow yourself", `Expected "Cannot follow yourself", but got ${error.message}`);
        }
    });

    it("Follow the same user twice", async function() {
        const follower = accounts[1];
        const following = accounts[2];

        // Initially, follow the user
        await socialConnections.follow([following], { from: follower });

        // Try to follow the same user again
        try {
            await socialConnections.follow([following], { from: follower });
            assert.fail("Expected revert not received");
        } catch (error) {
            expect(error.message).to.include("Already following", `Expected "Already following", but got ${error.message}`);
        }
    });

    it("Unfollow a user that is not being followed", async function() {
        const follower = accounts[1];
        const following = accounts[2];

        // Try to unfollow a user that is not being followed
        try {
            await socialConnections.unfollow([following], { from: follower });
            assert.fail("Expected revert not received");
        } catch (error) {
            expect(error.message).to.include("Not following this user", `Expected "Not following this user", but got ${error.message}`);
        }
    });

    it("Follow no one (empty array)", async function() {
        const follower = accounts[1];

        // Take a snapshot of the follower's state before the call
        const beforeState = await socialConnections.getUser(follower);

        // Call follow with an empty array
        await socialConnections.follow([], { from: follower });

        // Take a snapshot of the follower's state after the call
        const afterState = await socialConnections.getUser(follower);

        // Verify that the state has not changed
        expect(beforeState).to.deep.equal(afterState, "The state of the follower changed");
    });

    it("Unfollow no one (empty array)", async function() {
        const follower = accounts[1];

        // Take a snapshot of the follower's state before the call
        const beforeState = await socialConnections.getUser(follower);

        // Call unfollow with an empty array
        await socialConnections.unfollow([], { from: follower });

        // Take a snapshot of the follower's state after the call
        const afterState = await socialConnections.getUser(follower);

        // Verify that the state has not changed
        expect(beforeState).to.deep.equal(afterState, "The state of the follower changed");
    });

    it("Unfollow all users when none are being followed", async function() {
        const follower = accounts[1];

        // Try to unfollow all users when none are being followed
        try {
            await socialConnections.unfollowAll({ from: follower });
            const user = await socialConnections.getUser(follower);
            expect(user.following.length).to.equal(0, "User is following someone");
        } catch (error) {
            assert.fail(`Expected successful unfollowAll, but got error: ${error.message}`);
        }
    });

    it("Check the getUser function", async function() {
        const follower = accounts[1];
        const following = accounts[2];

        // Follow and unfollow some users, then check the getUser function
        await socialConnections.follow([following], { from: follower });
        let user = await socialConnections.getUser(follower);
        expect(user.following.includes(following)).to.be.true;

        await socialConnections.unfollow([following], { from: follower });
        user = await socialConnections.getUser(follower);
        expect(user.following.includes(following)).to.be.false;
    });

    it("Out of gas tests - Call follow or unfollow with a large number of addresses", async function() {
        const follower = accounts[1];
        const largeNumberOfAddresses = new Array(1000).fill(accounts[2]);

        // Try to follow a large number of addresses
        try {
            await socialConnections.follow(largeNumberOfAddresses, { from: follower });
        } catch (error) {
            expect(error.message).to.not.include("out of gas", `Expected "Not out of gas", but got ${error.message}`);
        }

        // Try to unfollow a large number of addresses
        try {
            await socialConnections.unfollow(largeNumberOfAddresses, { from: follower });
        } catch (error) {
            expect(error.message).to.not.include("out of gas", `Expected "Not out of gas", but got ${error.message}`);
        }
    });
});
