const { networks } = require("../networks")

task("deploy-haha", "Deploys the AutomatedFunctionsConsumer contract")
  .addParam("subid", "Billing subscription ID used to pay for Functions requests")
  .addParam("tokenAddress", "stable coin address")
  .setAction(async (taskArgs) => {
    console.log("\n__Compiling Contracts__")
    await run("compile")

    const functionsRouterAddress = networks[network.name]["functionsRouter"]
    const tokenAddress = taskArgs.tokenAddress
    const donId = networks[network.name]["donId"]
    const donIdBytes32 = hre.ethers.utils.formatBytes32String(donId)
    const signer = await ethers.getSigner()
    const linkTokenAddress = networks[network.name]["linkToken"]
    const txOptions = { confirmations: networks[network.name].confirmations }

    const subscriptionId = taskArgs.subid

    // Initialize SubscriptionManager
    const subManager = new SubscriptionManager({ signer, linkTokenAddress, functionsRouterAddress })
    await subManager.initialize()

    console.log(`Deploying Haha contract to ${network.name}`)
    const HahaContractFactory = await ethers.getContractFactory("Haha")
    const HahaContract = await HahaContractFactory.deploy(functionsRouterAddress, donIdBytes32, tokenAddress)

    console.log(`\nWaiting 1 block for transaction ${HahaContract.deployTransaction.hash} to be confirmed...`)
    await HahaContract.deployTransaction.wait(1)

    const consumerAddress = HahaContract.address

    console.log(`\nAdding ${consumerAddress} to subscription ${subscriptionId}...`)
    const addConsumerTx = await subManager.addConsumer({ subscriptionId, consumerAddress, txOptions })
    console.log(`\nAdded consumer contract ${consumerAddress} in Tx: ${addConsumerTx.transactionHash}`)

    const verifyContract = taskArgs.verify
    if (
      network.name !== "localFunctionsTestnet" &&
      verifyContract &&
      !!networks[network.name].verifyApiKey &&
      networks[network.name].verifyApiKey !== "UNSET"
    ) {
      try {
        console.log(`\nVerifying contract ${consumerAddress}...`)
        await HahaContract.deployTransaction.wait(Math.max(6 - networks[network.name].confirmations, 0))
        await run("verify:verify", {
          address: consumerAddress,
          constructorArguments: [functionsRouterAddress, donIdBytes32],
        })
        console.log("Contract verified")
      } catch (error) {
        if (!error.message.includes("Already Verified")) {
          console.log("Error verifying contract.  Delete the build folder and try again.")
          console.log(error)
        } else {
          console.log("Contract already verified")
        }
      }
    } else if (verifyContract && network.name !== "localFunctionsTestnet") {
      console.log(
        "\nPOLYGONSCAN_API_KEY, ETHERSCAN_API_KEY or FUJI_SNOWTRACE_API_KEY is missing. Skipping contract verification..."
      )
    }

    console.log(`\Haha contract deployed to ${consumerAddress} on ${network.name}`)
  })
