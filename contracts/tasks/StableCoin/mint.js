const { BigNumber } = require('ethers');

task("mint-stc", "Prints an account's balance")
  .addParam("account", "The account's address")
  .addParam("contract", "The stable coin contract address")
  .setAction(async (taskArgs) => {
    const stcContractFactory = await ethers.getContractFactory("SimpleStableCoin")
    const stcContract = await stcContractFactory.attach(taskArgs.contract)
    const stcDecimals = await stcContract.decimals()

    const mintToken = await stcContract.mintToken()
    console.log(`\nWaiting 1 block for transaction ${mintToken.hash} to be confirmed...`)
    await stcDecimals.wait(1)

    const balance = await stcContract.balanceOf(taskArgs.account)
    const balanceBigNumber = BigNumber.from(balance);
    const realBalance = balanceBigNumber.mul(BigNumber.from(10).pow(stcDecimals));
    console.log(realBalance, "STC")
  })

module.exports = {}

