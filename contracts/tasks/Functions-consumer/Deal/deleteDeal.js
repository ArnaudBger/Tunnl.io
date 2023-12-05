const { types } = require("hardhat/config")
const { networks } = require("../../../networks")
const { BigNumber } = require('ethers');

task("delete-deal", "Creates a new deal")
  .addParam("contract", "Address of the contract")
  .addParam("dealid", "Id of the deal")
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
    gasPrice = ethers.utils.parseUnits("25", "gwei"); // Example gas price

    let brand, influencer

    [brand, influencer] = await ethers.getSigners();


    InfluencerMarketingContract = await ethers.getContractFactory("InfluencerMarketingContract");
    contract = await InfluencerMarketingContract.attach(taskArgs.contract);

    StableCoinContract = await ethers.getContractFactory("SimpleStableCoin");
    stcContract = await StableCoinContract.attach("0x97Cd2703B70f97A70d5aA8cf951072b2894677dA");
    stcDecimals = await stcContract.decimals();

     // Call the createDeal function
     const tx = await contract.connect(brand).deleteDeal(taskArgs.dealid);
     ;

    await tx.wait(networks[network.name].confirmations)

    console.log(`\n The content accepted transaction has the following hash ${tx.hash} on ${network.name}`)
    console.log(`\n The deal with the following ID, has been deleted ${taskArgs.dealid}`)

});