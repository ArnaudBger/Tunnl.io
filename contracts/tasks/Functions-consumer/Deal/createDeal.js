const { types } = require("hardhat/config")
const { networks } = require("../../../networks")
const { BigNumber } = require('ethers');

task("create-deal", "Creates a new deal")
  .addParam("influencer", "Influencer address")
  .addParam("contract", "Address of the contract")
  .addOptionalParam("verify", "Set to true to verify consumer contract", false, types.boolean)
  .addOptionalParam(
    "configpath",
    "Path to Functions request config file",
    `${__dirname}/../../Functions-request-config.js`,
    types.string
  )
  .setAction(async (taskArgs) => {
    console.log("\n__Compiling Contracts__")
    await run("compile")
    
    let gasLimit, gasPrice;

    // Manually specify gas limit and gas price
    gasLimit = ethers.utils.hexlify(1000000); // Example gas limit
    gasPrice = ethers.utils.parseUnits("10", "gwei"); // Example gas price

    let brand, influencer

    [brand, influencer] = await ethers.getSigners();


    InfluencerMarketingContract = await ethers.getContractFactory("InfluencerMarketingContract");
    contract = await InfluencerMarketingContract.attach(taskArgs.contract);

    StableCoinContract = await ethers.getContractFactory("SimpleStableCoin");
    stcContract = await StableCoinContract.attach("0x4c48a47B87F4Fe3A38C5e3DdBB1e11110b6bc895");
    stcDecimals = await stcContract.decimals();

    await stcContract.connect(brand).approve(contract.address, BigNumber.from(10000).pow(stcDecimals), {gasLimit,gasPrice})

     // Define parameters for createDeal function based on your contract's requirements
     const influencerAddress = influencer.address;
     const brandDeposit = 1; // for example, 10 tokens
     const timeToPost = 3600; // in seconds
     const timeToVerify = 3600; // in seconds
     const timeToPerform = 3600; // in seconds
     const impressionsTarget = 1000;
     const expectedContentHash = "0xaf0ce9c95a4a15b4aca49063258060870978337d4dd662521086aca28af1fcfb"; // example content hash

     let initialDealCount = await contract.nextDealId();
     // Call the createDeal function
     const tx = await contract.connect(brand).createDeal(
         influencerAddress,
         brandDeposit,
         timeToPost,
         timeToVerify,
         timeToPerform,
         impressionsTarget,
         expectedContentHash,
         {gasLimit, gasPrice}

     );

    await tx.wait(networks[network.name].confirmations)

    console.log(`\n The content accepted transaction has the following hash ${tx.hash} on ${network.name}`)
    console.log(`\n The deal created has the following ID, ${initialDealCount}`)

});