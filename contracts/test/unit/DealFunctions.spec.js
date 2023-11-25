const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');
const helpers = require("@nomicfoundation/hardhat-network-helpers");

describe("Brand-Influencer deal functions tests", function () {
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
        // const tx_2 = await contract.connect(brand).deleteDeal(dealID, {gasLimit, gasPrice});
        // await tx_2.wait();

        // expect(tx_2).to.be.revertedWith("The deal has been signed already")

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
        // const tx_2 = await contract.connect(owner).signDeal(dealID);

        //SOMEONE OTHER THAN INFLUENCER TRY TO SIGN THE DEAL
        // expect(tx_2).to.be.revertedWith('Only the designated influencer can sign the deal');

      });

      it("should revert once the deal is deleted", async function () {

        //The brand choose to delete the deal before the influencer signed it
        // const txBis = await contract.connect(brand).deleteDeal(dealID);

        // await txBis.wait();

        //SOMEONE OTHER THAN INFLUENCER TRY TO SIGN THE DEAL
        // expect(contract.connect(owner).signDeal(dealID, {gasLimit, gasPrice})).to.be.revertedWith('The deal was deleted');

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

          let postURL = "https://influencer.com";

          const tx_3 = await contract.connect(influencer).postContent(dealID, postURL);
          await tx_3.wait();

          await expect(tx_3).to.emit(contract, "ContentPosted").withArgs(dealID, postURL);

          let dealAfterPosting = await contract.deals(dealID);
          expect(dealAfterPosting.postURL).to.equal(postURL);
        });

        it("should revert when someone else post content", async function () {
          const tx_2 = await contract.connect(influencer).signDeal(dealID);
          await tx_2.wait();

          // const tx_3 = await contract.connect(owner).postContent(dealID, "https://influencer.com");
          // await tx_3.wait();

          // expect(tx_3).to.be.revertedWith("Only influencer can post content");
        });

        it("should revert when influencer hasn't sign the deal", async function () {
          // const tx_3 = await contract.connect(influencer).postContent(dealID, "https://influencer.com", {gasLimit, gasPrice});
          // await tx_3.wait();

          // expect(tx_3).to.be.revertedWith("Only influencer can post content");
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

          // Increase time by 3600 seconds (1 hour)
          // advance time by one hour and mine a new block
          await helpers.time.increase(3600);
          const tx_3 = await contract.connect(brand).claimDeposit(dealID);
          await tx_3.wait();

          let balanceAfterClaimingDeposit = await stcContract.balanceOf(brand.address);
          let brandDepositBigNumber = BigNumber.from(brandDeposit);

          expect(balanceAfterClaimingDeposit).to.equal(balanceBeforeClaimingDeposit.add(brandDepositBigNumber));
        });
        it("should allow brand to claim deposit if the influencer post an empty url", async function () {
          const tx_3 = await contract.connect(influencer).postContent(dealID, "");
          await tx_3.wait();

          //Check the brand balance before claiming deposit
          let balanceBeforeClaimingDeposit = await stcContract.balanceOf(brand.address);

          // Increase time by 3600 seconds (1 hour)
          // advance time by one hour and mine a new block
          await helpers.time.increase(3600);
          const tx_4 = await contract.connect(brand).claimDeposit(dealID);
          await tx_4.wait();

          let balanceAfterClaimingDeposit = await stcContract.balanceOf(brand.address);
          let brandDepositBigNumber = BigNumber.from(brandDeposit);

          expect(balanceAfterClaimingDeposit).to.equal(balanceBeforeClaimingDeposit.add(brandDepositBigNumber));
        });

        it("should revert when another person than the brand tries to claim deposit", async function () {
          // Increase time by 3600 seconds (1 hour)
          // advance time by one hour and mine a new block
          await helpers.time.increase(3600);
          // const tx_3 = await contract.connect(owner).claimDeposit(dealID);
          // await tx_3.wait();

          // expect(tx_3).to.be.revertedWith("Only the brand can claim the deposit");
        });
    });

    describe("Accept content tests", function () {
      let postURL;
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
            {gasLimit, gasPrice});

        // Wait for the transaction to be mined

        await tx.wait();

        //Influencer signs the deal and post content
        const tx_2 = await contract.connect(influencer).signDeal(dealID);
        await tx_2.wait();
      });

        
      // Tests related to the accept content function
      it("should allow brand to accept content after", async function () {
        postURL = "https://influencer.com";
        const tx_3 = await contract.connect(influencer).postContent(dealID, postURL);
        await tx_3.wait();
        let deal = await contract.deals(dealID);
        expect(deal.isAccepted).to.equal(false);
        const tx_4 = await contract.connect(brand).acceptContent(dealID);
        await tx_4.wait();

        deal = await contract.deals(dealID);
        expect(tx_4).to.emit(contract, "ContentAccepted").withArgs(dealID);
        expect(deal.isAccepted).to.equal(true);

      });

      it("should revert when someone else tries to accept content", async function () {
        // postURL = "https://influencer.com";
        // const tx_3 = await contract.connect(influencer).postContent(dealID, postURL);
        // await tx_3.wait();
        // const tx_4 = await contract.connect(owner).acceptContent(dealID);
        // await tx_4.wait();

        // expect(tx_4).to.be.revertedWith("Only brand can accept content");
      });

      it("should revert once the timeToVerify has elapsed", async function () {
        // postURL = "https://influencer.com";
        // const tx_3 = await contract.connect(influencer).postContent(dealID, postURL);
        // await tx_3.wait();
        // // Increase time by 3600 seconds (1 hour)
        // // advance time by one hour and mine a new block
        // await helpers.time.increase(3600);
        // const tx_4 = await contract.connect(brand).acceptContent(dealID);
        // await tx_4.wait();
        // expect(tx_4).to.be.revertedWith("Verification period has expired");
      });

      it("should revert if the content is not yet posted" , async function () {
        // const tx_4 = await contract.connect(owner).acceptContent(dealID);
        // await tx_4.wait();

        // expect(tx_4).to.be.revertedWith("Content has not been posted yet");
      });

    });

    describe("Dispute Content", function () {
      let postURL;
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
            {gasLimit, gasPrice});

        // Wait for the transaction to be mined

        await tx.wait();

        //Influencer signs the deal and post content
        const tx_2 = await contract.connect(influencer).signDeal(dealID);
        await tx_2.wait();
      });

        
      // Tests related to the dispute content function
      it("should allow brand to dispute content after", async function () {
        postURL = "https://influencer.com";
        const tx_3 = await contract.connect(influencer).postContent(dealID, postURL);
        await tx_3.wait();
        let deal = await contract.deals(dealID);
        expect(deal.isDisputed).to.equal(false);
        const tx_4 = await contract.connect(brand).disputeContent(dealID);
        await tx_4.wait();

        deal = await contract.deals(dealID);
        expect(tx_4).to.emit(contract, "ContentAccepted").withArgs(dealID);
        expect(deal.isDisputed).to.equal(true);

      });

      it("should revert when someone else tries to dispute content", async function () {
        // postURL = "https://influencer.com";
        // const tx_3 = await contract.connect(influencer).postContent(dealID, postURL);
        // await tx_3.wait();
        // const tx_4 = await contract.connect(owner).disputeContent(dealID);
        // await tx_4.wait();

        // expect(tx_4).to.be.revertedWith("Only brand can dispute content");
      });

      it("should revert once the timeToVerify has elapsed", async function () {
        // postURL = "https://influencer.com";
        // const tx_3 = await contract.connect(influencer).postContent(dealID, postURL);
        // await tx_3.wait();
        // // Increase time by 3600 seconds (1 hour)
        // // advance time by one hour and mine a new block
        // await helpers.time.increase(3600);
        // const tx_4 = await contract.connect(brand).disputeContent(dealID);
        // await tx_4.wait();
        // expect(tx_4).to.be.revertedWith("Verification period has expired");
      });

      it("should revert if the content is not yet posted" , async function () {
        // const tx_4 = await contract.connect(owner).disputeContent(dealID);
        // await tx_4.wait();

        // expect(tx_4).to.be.revertedWith("Content has not been posted yet");
      });
    });

    describe("verify disputed content tests", function () {
      let postURL;
      beforeEach(async function () {
        //BRAND CREATES THE DEAL

        await stcContract.connect(brand).approve(contract.address, BigNumber.from(10000).pow(stcDecimals), {gasLimit,gasPrice})

        // Define parameters for createDeal function based on your contract's requirements
        influencerAddress = influencer.address;
        brandDeposit = 10000000000; // for example, 10 tokens
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
            {gasLimit, gasPrice});

        // Wait for the transaction to be mined

        await tx.wait();

        //Influencer signs the deal and post content
        const tx_2 = await contract.connect(influencer).signDeal(dealID);
        await tx_2.wait();

        postURL = "https://influencer.com";
        const tx_3 = await contract.connect(influencer).postContent(dealID, postURL);
        await tx_3.wait();

      });
      it("should allow hahalabs verifier to verify content and if accepting the content then give the brand deposit to the treasury and the influencer", async function () {
        //The Brand disputes the content
        const tx_4 = await contract.connect(brand).disputeContent(dealID);
        await tx_4.wait();

        /*After the brand disputed the content, the verifier accept it, then 
        95% of the brand deposit will go to the influencer and 5% to the hahalabsTreasury*/

        let balanceInfluencerBeforeHahalabsVerification = await stcContract.balanceOf(influencer.address);
        let balanceTreasuryBeforeHahalabsVerification = await stcContract.balanceOf(owner.address);
        
        let influencerDue = brandDeposit * 0.95
        let treasuryDue = brandDeposit * 0.05

        let influencerDueBigNumber = BigNumber.from(influencerDue);
        let hahaTreasuryDueBigNumber = BigNumber.from(treasuryDue);
        //The verification is done Hahalabs has approved the content

        const tx_5 = await contract.connect(owner).verifyDisputedContent(dealID, true)
        await tx_5.wait();


        let balanceInfluencerAfterHahalabsVerification = await stcContract.balanceOf(influencer.address);
        let balanceTreasuryAfterHahalabsVerification = await stcContract.balanceOf(owner.address);


        expect(balanceInfluencerAfterHahalabsVerification).to.equal(balanceInfluencerBeforeHahalabsVerification.add(influencerDueBigNumber));
        expect(balanceTreasuryAfterHahalabsVerification).to.equal(balanceTreasuryBeforeHahalabsVerification.add(hahaTreasuryDueBigNumber));
      });

      it("should allow hahalabs verifier to verify content and if not accepting, the brand deposit will get back to the brand", async function () {
        //The Brand disputes the content
        const tx_4 = await contract.connect(brand).disputeContent(dealID);
        await tx_4.wait();

        /*After the brand disputed the content, the verifier accept it, then
        95% of the brand deposit will go to the influencer and 5% to the hahalabsTreasury*/

        let balanceBrandBeforeHahalabsVerification = await stcContract.balanceOf(brand.address);
        

        let brandDueBigNumber = BigNumber.from(brandDeposit);

        //The verification is done Hahalabs hasn't approved the content

        const tx_5 = await contract.connect(owner).verifyDisputedContent(dealID, false)
        await tx_5.wait();


        let balanceBrandAfterHahalabsVerification = await stcContract.balanceOf(brand.address);

        expect(balanceBrandAfterHahalabsVerification).to.equal(balanceBrandBeforeHahalabsVerification.add(brandDueBigNumber));
      });

      it("should revert if the content is not disputed", async function () {
        // const tx_5 = await contract.connect(owner).verifyDisputedContent(dealID, true)
        // await tx_5.wait();

        // expect(tx_5).to.be.revertedWith("Content is not disputed");
      });

      it("should revert if someone else than the verifier tries to verify disputed content", async function () {
        // //The Brand disputes the content
        // const tx_4 = await contract.connect(brand).disputeContent(dealID);
        // await tx_4.wait();

        // const tx_5 = await contract.connect(brand).verifyDisputedContent(dealID, true)
        // await tx_5.wait();

        // expect(tx_5).to.be.revertedWith("Only Haha Labs' verifier can verify content");
      });

      // More tests for other role-restricted functions
  });
});
