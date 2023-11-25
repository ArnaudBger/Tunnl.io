const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');

describe("Owner functions tests", function () {
    let InfluencerMarketingContract;
    let contract;
    let owner, brand, influencer;
    let gasLimit, gasPrice;
    let randomBytes = "0xaf0ce9c95a4a15b4aca49063258060870978337d4dd662521086aca28af1fcfb"
    let randomAddress = "0x580A588419F0dBfcEb9202E2410240c2F2C8F193"
    let hahaLabsVerifier, hahaLabsTreasury

    beforeEach(async function () {
        // Manually specify gas limit and gas price
        const gasLimit = ethers.utils.hexlify(1000000); // Example gas limit
        const gasPrice = ethers.utils.parseUnits("10", "gwei"); // Example gas price

        InfluencerMarketingContract = await ethers.getContractFactory("InfluencerMarketingContract");
        [owner, brand, influencer] = await ethers.getSigners();

        contract = await InfluencerMarketingContract.deploy(randomAddress, randomBytes , stcContract.address);
    });

    describe("setHahaLabsVerifier function tests", function () {
        it("should allow owner to set a new verifier address", async function () {
          let hahaLabsVerifier = await contract.hahaLabsVerifier();
          expect(hahaLabsVerifier).to.equal(owner.address);

          // Owner set a new verifier address
          await contract.connect(owner).setHahaLabsVerifier(randomAddress);
          hahaLabsVerifier = await contract.hahaLabsVerifier();
          
          //Check if the verifier is updated with the correct address
          expect(hahaLabsVerifier).to.equal(randomAddress);
        });

    });

    describe("setHahaLabsTreasury function tests", function () {
        it("should allow owner to set a new verifier address", async function () {
          let hahaLabsTreasury = await contract.hahaLabsTreasury();
          expect(hahaLabsTreasury).to.equal(owner.address);

          // Owner set a new verifier address
          await contract.connect(owner).setHahaLabsTreasury(randomAddress);
          hahaLabsTreasury = await contract.hahaLabsTreasury();
          
          //Check if the verifier is updated with the correct address
          expect(hahaLabsTreasury).to.equal(randomAddress);
        });

    });
});