const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');


describe("InfluencerMarketingContract", function () {
    let InfluencerMarketingContract;
    let contract;
    let owner, brand, influencer;
    let gasLimit, gasPrice;
    let randomBytes = "0xaf0ce9c95a4a15b4aca49063258060870978337d4dd662521086aca28af1fcfb"
    let randomAddress = "0x580A588419F0dBfcEb9202E2410240c2F2C8F193"
    beforeEach(async function () {
        // Manually specify gas limit and gas price
        const gasLimit = ethers.utils.hexlify(1000000); // Example gas limit
        const gasPrice = ethers.utils.parseUnits("10", "gwei"); // Example gas price

        InfluencerMarketingContract = await ethers.getContractFactory("InfluencerMarketingContract");
        [owner, brand, influencer] = await ethers.getSigners();
      
        StableCoinContract = await ethers.getContractFactory("SimpleStableCoin");

        stcContract = await StableCoinContract.deploy();
        stcDecimals = await stcContract.decimals();
        contract = await InfluencerMarketingContract.deploy(randomAddress, randomBytes , stcContract.address);
      
        await stcContract.connect(brand).mintToken();

    });

    describe("Create Deal Management", function () {
        it("should allow a brand to create a deal", async function () {
          await stcContract.connect(brand).approve(contract.address, BigNumber.from(10000).pow(stcDecimals), {gasLimit,gasPrice})

          // Define parameters for createDeal function based on your contract's requirements
          const influencerAddress = influencer.address;
          const brandDeposit = 1; // for example, 10 tokens
          const timeToPost = 3600; // in seconds
          const timeToVerify = 3600; // in seconds
          const timeToPerform = 3600; // in seconds
          const targetType = 0; // assuming 0 is one of the enum values for TargetType
          const impressionsTarget = 1000;
          const likesTarget = 500;
          const expectedContentHash = "0xaf0ce9c95a4a15b4aca49063258060870978337d4dd662521086aca28af1fcfb"; // example content hash

          let initialDealCount = await contract.nextDealId();
          // Call the createDeal function
          const tx = await contract.connect(brand).createDeal(
              influencerAddress,
              brandDeposit,
              timeToPost,
              timeToVerify,
              timeToPerform,
              targetType,
              impressionsTarget,
              likesTarget,
              expectedContentHash,
              {gasLimit, gasPrice}

          );

          // Wait for the transaction to be mined
          await tx.wait();

          // Check if the DealCreated event was emitted
          expect(tx).to.emit(contract, "DealCreated");

          // Verify that the deal count has incremented
          expect(await contract.nextDealId()).to.equal(initialDealCount.add(1));
        });

        it("should allow an influencer to sign a deal", async function () {
            await contract.connect(brand).createDeal();
            await contract.connect(influencer).signDeal(/* dealId */);
            // Add assertions to check the deal signing
        });

        it("should re")

        // More tests for postContent, acceptContent, disputeContent, etc.
    });

    describe("Sign Deal Management", function () {
      it("should allow a brand to create a deal", async function () {
      });

  });

    describe("Dispute Resolution and Payment", function () {
        it("should correctly handle disputed content verification", async function () {
            // Setup a disputed deal
            // Call verifyDisputedContent
            // Add assertions for expected outcomes
        });

        it("should handle claimDeposit correctly", async function () {
            // Setup a scenario where a deposit can be claimed
            // Call claimDeposit
            // Add assertions for expected outcomes
        });

        // More tests for deleteDeal, _payAddress, etc.
    });

    describe("Chainlink Functions", function () {
        // Tests related to Chainlink Automated Functions
    });

    describe("Access Control", function () {
        it("should restrict access to setHahaLabsAdmin", async function () {
            await expect(contract.connect(influencer).setHahaLabsAdmin(influencer.address)).to.be.reverted;
            // Check if the transaction is reverted for non-owner
        });

        // More tests for other role-restricted functions
    });

    // Additional tests as needed
});
