const { types } = require("hardhat/config")

task("bucket-info", "Deal deails")
  .addParam("dealid", "ID of the deal")
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

    let brand, influencer

    [brand, influencer] = await ethers.getSigners();


    InfluencerMarketingContract = await ethers.getContractFactory("InfluencerMarketingContract");
    contract = await InfluencerMarketingContract.attach(taskArgs.contract);

    let gasLimit, gasPrice;

    // Manually specify gas limit and gas price
    gasLimit = ethers.utils.hexlify(1000000); // Example gas limit
    gasPrice = ethers.utils.parseUnits("10", "gwei"); // Example gas price

    const dealDeadlines = await contract.dealDeadlines(
        taskArgs.dealid,
        {gasLimit, gasPrice}
    );
    
    console.log(`\n performDeadline : ${dealDeadlines.performDeadline}`)

    const calculateBucket = await contract.calculateBucket(
        taskArgs.dealid,
        {gasLimit, gasPrice}
    );

    console.log(`\n postURL : ${dealDetails.postURL}`)
    console.log(`\n impressionsTarget : ${dealDetails.impressionsTarget}`)
    console.log(`\n isAccepted : ${dealDetails.isAccepted}`)
    console.log(`\n isDisputed : ${dealDetails.isDisputed}`)
    console.log(`\n influencerSigned : ${dealDetails.influencerSigned}`)
    console.log(`\n expectedContentHash : ${dealDetails.expectedContentHash}`)





});