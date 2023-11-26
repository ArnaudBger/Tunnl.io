const { types } = require("hardhat/config")
const { networks } = require("../../../networks")

task("dispute-content", "Brand disputes the post content")
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

    const tx = await contract.connect(brand).disputeContent(
        taskArgs.dealid,
        {gasLimit, gasPrice}

    );

    await tx.wait(networks[network.name].confirmations)

    console.log(`\n The content disputed transaction has the following hash ${tx.hash} on ${network.name}`)


});