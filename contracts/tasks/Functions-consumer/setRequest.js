const {
    SubscriptionManager,
    SecretsManager,
    createGist,
    deleteGist,
    simulateScript,
    decodeResult,
    ResponseListener,
    Location,
    FulfillmentCode,
  } = require("@chainlink/functions-toolkit")
  const { networks } = require("../../networks")
  const utils = require("../utils")
  const chalk = require("chalk")
  const path = require("path")
  const process = require("process")
  
  task("functions-set-request", "Initiates an on-demand request from a Functions consumer contract")
    .addParam("contract", "Address of the consumer contract to call")
    .addParam("subid", "Billing subscription ID used to pay for Functions requests")
    .addOptionalParam(
      "callbackgaslimit",
      "Maximum amount of gas that can be used to call fulfillRequest in the consumer contract",
      100_000,
      types.int
    )
    .addOptionalParam(
        "slotid",
        "Slot ID to use for uploading DON hosted secrets. If the slot is already in use, the existing encrypted secrets will be overwritten.",
        0,
        types.int
      )
    .addOptionalParam("requestgaslimit", "Gas limit for calling the sendRequest function", 1_500_000, types.int)
    .addOptionalParam(
      "configpath",
      "Path to Functions request config file",
      `${__dirname}/../../Functions-request-config.js`,
      types.string
    )
    .setAction(async (taskArgs, hre) => {
      // Get the required parameters
      const contractAddr = taskArgs.contract
      const subscriptionId = parseInt(taskArgs.subid)
      const slotId = parseInt(taskArgs.slotid)
      const callbackGasLimit = parseInt(taskArgs.callbackgaslimit)
  
      // Attach to the FunctionsConsumer contract
      const consumerFactory = await ethers.getContractFactory("InfluencerMarketingContract")
      const consumerContract = consumerFactory.attach(contractAddr)
  
      // Get requestConfig from the specified config file
      const requestConfig = require(path.isAbsolute(taskArgs.configpath)
        ? taskArgs.configpath
        : path.join(process.cwd(), taskArgs.configpath))
  
     // Initialize the subscription manager
     const signer = await ethers.getSigner()
     const linkTokenAddress = networks[network.name]["linkToken"]
     const functionsRouterAddress = networks[network.name]["functionsRouter"]
     const subManager = new SubscriptionManager({ signer, linkTokenAddress, functionsRouterAddress })
     await subManager.initialize()

      const spinner = utils.spin()
      spinner.start(
        `Waiting for transaction for FunctionsConsumer contract ${contractAddr} on network ${network.name} to be confirmed...`
      )
      // Use a manual gas limit for the request transaction since estimated gas limit is not always accurate
      const overrides = {
        gasLimit: taskArgs.requestgaslimit,
      }
      // If specified, use the gas price from the network config instead of Ethers estimated price
      if (networks[network.name].gasPrice) {
        overrides.gasPrice = networks[network.name].gasPrice
      }
      // If specified, use the nonce from the network config instead of automatically calculating it
      if (networks[network.name].nonce) {
        overrides.nonce = networks[network.name].nonce
      }
    
    // Initialize the secrets manager
    const donId = networks[network.name]["donId"]
    const secretsManager = new SecretsManager({ signer, functionsRouterAddress, donId })
    await secretsManager.initialize()

    // Handle encrypted secrets
    let encryptedSecretsReference = []
    // let gistUrl
    // if (
    //   network.name !== "localFunctionsTestnet" &&
    //   requestConfig.secrets &&
    //   Object.keys(requestConfig.secrets).length > 0
    // ) {
    //   const encryptedSecrets = await secretsManager.encryptSecrets(requestConfig.secrets)

    //   switch (requestConfig.secretsLocation) {
    //     case Location.Inline:
    //       throw Error("Inline encrypted secrets are not supported for requests.")

    //     case Location.Remote:
    //       if (!process.env["GITHUB_API_TOKEN"]) {
    //         throw Error("GITHUB_API_TOKEN environment variable is required to upload Remote encrypted secrets.")
    //       }
    //       gistUrl = await createGist(process.env["GITHUB_API_TOKEN"], JSON.stringify(encryptedSecrets))
    //       encryptedSecretsReference = await secretsManager.encryptSecretsUrls([gistUrl])
    //       break

    //     case Location.DONHosted:
    //       const { version } = await secretsManager.uploadEncryptedSecretsToDON({
    //         encryptedSecretsHexstring: encryptedSecrets.encryptedSecrets,
    //         gatewayUrls: networks[network.name]["gatewayUrls"],
    //         slotId,
    //         minutesUntilExpiration: 5,
    //       })
    //       encryptedSecretsReference = await secretsManager.buildDONHostedEncryptedSecretsReference({
    //         slotId,
    //         version,
    //       })
    //       break

    //     default:
    //       throw Error("Invalid secretsLocation in request config")
    //   }
    // } else {
    //   requestConfig.secretsLocation = Location.Remote // Default to Remote if no secrets are used
    // }
    console.log(subscriptionId, callbackGasLimit, requestConfig.source, requestConfig.secretsLocation,encryptedSecretsReference)
    requestConfig.secretsLocation = Location.DONHosted;
    
      const requestTx = await consumerContract.setRequest(
        subscriptionId,
        callbackGasLimit,
        requestConfig.source,
        requestConfig.secretsLocation,
        encryptedSecretsReference,
        overrides
      )

      });