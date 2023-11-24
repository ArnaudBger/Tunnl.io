const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');
const helpers = require("@nomicfoundation/hardhat-network-helpers");



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

    describe("Create deal tests", function () {
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

          // Check if the DealCreated event was emitted
          await expect(tx).to.emit(contract, "DealCreated").withArgs(initialDealCount, brand.address, influencer.address);

          // Verify that the deal count has incremented
          expect(await contract.nextDealId()).to.equal(initialDealCount.add(1));
        });

    });


    describe("Delete deal test", function () {
      let dealID;
      let influencerAddress;
      let brandDeposit;
      let timeToPost;
      let timeToVerify;
      let timeToPerform;
      let targetType;
      let impressionsTarget;
      let likesTarget;
      let expectedContentHash;

      beforeEach(async function () {
        //BRAND CREATES THE DEAL

        await stcContract.connect(brand).approve(contract.address, BigNumber.from(10000).pow(stcDecimals), {gasLimit,gasPrice})

        // Define parameters for createDeal function based on your contract's requirements
        influencerAddress = influencer.address;
        brandDeposit = 1; // for example, 10 tokens
        timeToPost = 3600; // in seconds
        timeToVerify = 3600; // in seconds
        timeToPerform = 3600; // in seconds
        targetType = 0; // assuming 0 is one of the enum values for TargetType
        impressionsTarget = 1000;
        likesTarget = 500;
        expectedContentHash = "0xaf0ce9c95a4a15b4aca49063258060870978337d4dd662521086aca28af1fcfb"; // example content hash

        // Get the deal id
        dealID = await contract.nextDealId();

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
      });

      it("should allow the brand to delete deal before the influencer has signed", async function () {
        //Check if the deal status is active
        let dealAfterCreation = await contract.deals(dealID);
        expect(dealAfterCreation.status).to.equal(1)

        //Delete the current deal
        const tx_2 = await contract.connect(brand).deleteDeal(dealID);
        await tx_2.wait();

        //Check if the deal status is deleted
        let dealAfterDelete = await contract.deals(dealID);
        expect(dealAfterDelete.status).to.equal(2)

      }),

      it("should revert when the brand tries to delete the deal after the influencer has signed", async function () {
        // Influencer signs the deal
        await contract.connect(influencer).signDeal(dealID);

        //Delete the current deal
        const tx_2 = await contract.connect(brand).deleteDeal(dealID, {gasLimit, gasPrice});
        await tx_2.wait();

        await expect(tx_2).to.be.revertedWith("The deal has been signed already")

      })
      });

    describe("Sign deal tests", function () {
      let dealID;
      let influencerAddress;
      let brandDeposit;
      let timeToPost;
      let timeToVerify;
      let timeToPerform;
      let targetType;
      let impressionsTarget;
      let likesTarget;
      let expectedContentHash;

      beforeEach(async function () {
        //BRAND CREATES THE DEAL

        await stcContract.connect(brand).approve(contract.address, BigNumber.from(10000).pow(stcDecimals), {gasLimit,gasPrice})

        // Define parameters for createDeal function based on your contract's requirements
        influencerAddress = influencer.address;
        brandDeposit = 1; // for example, 10 tokens
        timeToPost = 3600; // in seconds
        timeToVerify = 3600; // in seconds
        timeToPerform = 3600; // in seconds
        targetType = 0; // assuming 0 is one of the enum values for TargetType
        impressionsTarget = 1000;
        likesTarget = 500;
        expectedContentHash = "0xaf0ce9c95a4a15b4aca49063258060870978337d4dd662521086aca28af1fcfb"; // example content hash

        // Get the deal id
        dealID = await contract.nextDealId();

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


      });

      it("should allow the influencer to sign a deal", async function () {
        //INFLUENCER SIGNS THE DEAL
        // before signing, the deal is not already signed by the influencer...
        const dealBeforeSigning = await contract.deals(dealID);

        expect(dealBeforeSigning.influencerSigned).to.equal(false);

        const tx_2 = await contract.connect(influencer).signDeal(dealID);
        
        const dealAfterSigning = await contract.deals(dealID);

        // after signing, the deal is signed by the influencer...
        expect(dealAfterSigning.influencerSigned).to.equal(true);


        // Check if the DealSigned event was emitted
        await expect(tx_2).to.emit(contract, "DealSigned").withArgs(dealID, influencer.address);


      });

      it("should revert when another person tries to sign a deal", async function () {
      
        const tx_2 = await contract.connect(owner).signDeal(dealID, {gasLimit: 5000000});

        //SOMEONE OTHER THAN INFLUENCER TRY TO SIGN THE DEAL
        await expect(tx_2).to.be.revertedWith('Only the designated influencer can sign the deal');

      });

      it("should revert once the deal is deleted", async function () {

        //The brand choose to delete the deal before the influencer signed it
        const txBis = await contract.connect(brand).deleteDeal(dealID);

        await txBis.wait();

        //SOMEONE OTHER THAN INFLUENCER TRY TO SIGN THE DEAL
        await expect(
          contract.connect(owner).signDeal(dealID, {gasLimit: 5000000})
        ).to.be.revertedWith('The deal was deleted');

      });
      });

    describe("Post Content tests", function () {

      beforeEach(async function () {
        //BRAND CREATES THE DEAL

        await stcContract.connect(brand).approve(contract.address, BigNumber.from(10000).pow(stcDecimals), {gasLimit,gasPrice})

        // Define parameters for createDeal function based on your contract's requirements
        influencerAddress = influencer.address;
        brandDeposit = 1; // for example, 10 tokens
        timeToPost = 3600; // in seconds
        timeToVerify = 3600; // in seconds
        timeToPerform = 3600; // in seconds
        targetType = 0; // assuming 0 is one of the enum values for TargetType
        impressionsTarget = 1000;
        likesTarget = 500;
        expectedContentHash = "0xaf0ce9c95a4a15b4aca49063258060870978337d4dd662521086aca28af1fcfb"; // example content hash

        // Get the deal id
        dealID = await contract.nextDealId();

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

      });
        it("should allow influencer to post Content", async function () {
          const tx_2 = await contract.connect(influencer).signDeal(dealID);
          await tx_2.wait();

          let dealAfterSigning = await contract.deals(dealID);
          expect(dealAfterSigning.postURL).to.equal("");

          const tx_3 = await contract.connect(influencer).postContent(dealID, "https://influencer.com");
          await tx_3.wait();

          let dealAfterPosting = await contract.deals(dealID);
          expect(dealAfterPosting.postURL).to.equal("https://influencer.com");
        });

        it("should revert when someone else post content", async function () {
          const tx_2 = await contract.connect(influencer).signDeal(dealID);
          await tx_2.wait();

          const tx_3 = await contract.connect(owner).postContent(dealID, "https://influencer.com");
          await tx_3.wait();

          await expect(tx_3).to.be.revertedWith("Only influencer can post content");
        });

        it("should revert when influencer hasn't sign the deal", async function () {
          const tx_3 = await contract.connect(influencer).postContent(dealID, "https://influencer.com");
          await tx_3.wait();

          await expect(tx_3).to.be.revertedWith("Only influencer can post content");
        });
    });

    describe("Claim Deposit tests", function() {
      beforeEach(async function () {
        //BRAND CREATES THE DEAL

        await stcContract.connect(brand).approve(contract.address, BigNumber.from(10000).pow(stcDecimals), {gasLimit,gasPrice})

        // Define parameters for createDeal function based on your contract's requirements
        influencerAddress = influencer.address;
        brandDeposit = 1; // for example, 10 tokens
        timeToPost = 3600; // in seconds
        timeToVerify = 3600; // in seconds
        timeToPerform = 3600; // in seconds
        targetType = 0; // assuming 0 is one of the enum values for TargetType
        impressionsTarget = 1000;
        likesTarget = 500;
        expectedContentHash = "0xaf0ce9c95a4a15b4aca49063258060870978337d4dd662521086aca28af1fcfb"; // example content hash

        // Get the deal id
        dealID = await contract.nextDealId();

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

        const tx_2 = await contract.connect(influencer).signDeal(dealID);
        await tx_2.wait();

        

      });
        it("should allow brand to claim deposit if the influencer do not post content on-time", async function () {

          //Check the brand balance before claiming deposit
          let balanceBeforeClaimingDeposit = await stcContract.balanceOf(brand.address);
          let blockNumber = await ethers.provider.getBlockNumber();
          let block = await ethers.provider.getBlock(blockNumber);

          // Increase time by 3600 seconds (1 hour)
          // advance time by one hour and mine a new block
          await helpers.time.increase(3600);

          blockNumber = await ethers.provider.getBlockNumber();

          block = await ethers.provider.getBlock(blockNumber);

          const tx_3 = await contract.connect(brand).claimDeposit(dealID);
          await tx_3.wait();

          let balanceAfterClaimingDeposit = await stcContract.balanceOf(brand.address);

          let brandDepositBigNumber = BigNumber.from(brandDeposit);

          let depositInWei = brandDepositBigNumber.mul(BigNumber.from("1000000000000000000"));

          expect(balanceAfterClaimingDeposit).to.equal(balanceBeforeClaimingDeposit.add(depositInWei));
        });
        it("should allow brand to claim deposit if the influencer post an empty url", async function () {
          const tx_3 = await contract.connect(influencer).postContent(dealID, "");
          await tx_3.wait();




        });
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
