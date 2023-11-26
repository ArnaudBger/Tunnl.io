const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');

describe("Chainlink functions related functions tests", function () {
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
        StableCoinContract = await ethers.getContractFactory("SimpleStableCoin");

        stcContract = await StableCoinContract.deploy();

        contract = await InfluencerMarketingContract.deploy(randomAddress, randomBytes , stcContract.address);
    });

    describe("bucket system tests", function () {
        it("should allow owner to set a new verifier address", async function () {
        });

    });

    describe("setHahaLabsTreasury function tests", function () {
        it("should allow owner to set a new verifier address", async function () {
        });

    });
});