const { BigNumber } = require('ethers');

task("balance-stc", "Prints an account's balance")
  .addParam("contract", "The stable coin contract address")
  .setAction(async (taskArgs) => {
    // Manually specify gas limit and gas price
    gasLimit = ethers.utils.hexlify(1000000); // Example gas limit
    gasPrice = ethers.utils.parseUnits("25", "gwei"); // Example gas price
    
    const stcContractFactory = await ethers.getContractFactory("SimpleStableCoin")
    const stcContract = await stcContractFactory.attach(taskArgs.contract)
    const stcDecimals = await stcContract.decimals()
    const amountToApprove = 100000
    const amountToApproveBigNumber = BigNumber.from(amountToApprove);
    const realamountToApprove = amountToApproveBigNumber.mul(BigNumber.from(10).pow(stcDecimals));

    [dev, brand] = await ethers.getSigners();

    await stcContract.connect(brand).approve("0x1a4aC33A1997B39cC151503bacb393e14EFF48A8", realamountToApprove, {gasLimit,gasPrice})
    console.log(realamountToApprove, "STC")
  })

module.exports = {}

