task("deploy-stable-coin", "Deploys the `stable coin` contract")
  .setAction(async (taskArgs) => {
    console.log("\n__Compiling Contracts__")
    await run("compile")


    console.log(`Deploying StableCoinContract contract to ${network.name}`)
    const StableCoinContractFactory = await ethers.getContractFactory("SimpleStableCoin")
    const StableCoinContract = await StableCoinContractFactory.deploy()

    console.log(`\nWaiting 1 block for transaction ${StableCoinContract.deployTransaction.hash} to be confirmed...`)
    await StableCoinContract.deployTransaction.wait(1)

    const contractAddress = StableCoinContract.address

    console.log(`\n STC contract deployed to ${contractAddress} on ${network.name}`)
  })
