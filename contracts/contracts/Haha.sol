// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Placeholder for Chainlink interfaces, assuming they are imported here
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IStableCoin is IERC20 {
  function decimals() external returns (uint8);
}

contract InfluencerMarketingContract is FunctionsClient, ConfirmedOwner, AutomationCompatibleInterface {
  using FunctionsRequest for FunctionsRequest.Request;

  //Stable coin contract address
  address public stableCoinAddress; // SimpleStableCoin address for payouts.

  // State variables for Chainlink Functions
  bytes32 public donId;
  bytes public s_requestCBOR;
  uint64 public s_subscriptionId;
  uint32 public s_fulfillGasLimit;
  bytes32 public s_lastRequestId;
  bytes public s_lastResponse;
  bytes public s_lastError;

  // Perform algorithm source code
  string source;
  FunctionsRequest.Location secretsLocation;
  bytes encryptedSecretsReference;

  // State variables for Chainlink Automation
  uint256 public s_lastUpkeepTimeStamp;
  uint256 public s_upkeepCounter;
  uint256 public s_responseCounter;

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

  /**
   * @notice Executes once when a contract is created to initialize state variables
   *
   * @param router The Functions Router contract for the network
   * @param _donId The DON Id for the DON that will execute the Function
   */

  enum DealStatus {
    Done,
    Active,
    Failed
  }

  struct DealBasics {
    address brand;
    address influencer;
    uint256 brandDeposit;
    DealStatus status;
  }

  struct DealDeadlines {
    uint256 timeToPost;
    uint256 timeToVerify;
    uint256 timeToPerform;
    uint256 postDeadline;
    uint256 verifyDeadline;
    uint256 performDeadline;
  }

  struct DealDetails {
    string postURL;
    uint256 impressionsTarget;
    bool isAccepted;
    bool isDisputed;
    bool influencerSigned;
    bytes32 expectedContentHash;
  }

  mapping(uint256 => DealBasics) public dealBasics;
  mapping(uint256 => DealDeadlines) public dealDeadlines;
  mapping(uint256 => DealDetails) public dealDetails;

  // Define a new role for Haha Labs' administrator
  address public hahaLabsVerifier;

  // Define the hahaLabsTreasury
  address public hahaLabsTreasury;

  mapping(uint256 => uint256[]) public dealsInBucket; // Maps a time bucket to a list of deal IDs

  uint256 public nextDealId;

  event DealCreated(uint256 indexed dealId, address indexed brand, address indexed influencer);
  event DealSigned(uint256 indexed dealId, address indexed influencer);
  event ContentPosted(uint256 indexed dealId, string postURL);
  event ContentAccepted(uint256 indexed dealId);
  event ContentDisputed(uint256 indexed dealId);
  event DepositRefunded(uint256 indexed dealId, address indexed brand, uint256 refundAmount);
  event DisputedContentVerified(
    uint256 indexed dealId,
    bool isAccepted,
    uint256 influencerAmount,
    uint256 brandAmount,
    uint256 hahaLabsAmount
  );

  constructor(
    address router,
    bytes32 _donId,
    address _tokenAddress
  ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
    donId = _donId;
    hahaLabsVerifier = msg.sender; // Initially set to the contract creator
    hahaLabsTreasury = msg.sender; // Initially set to the contract creator
    s_lastUpkeepTimeStamp = 0;
    stableCoinAddress = _tokenAddress;
  }

  // CHAINLINK AUTOMATED FUNCTIONS RELATED FUNCTIONS //

  /**
   * @notice Sets the bytes representing the CBOR-encoded FunctionsRequest.Request that is sent when performUpkeep is called

   * @param _subscriptionId The Functions billing subscription ID used to pay for Functions requests
   * @param _fulfillGasLimit Maximum amount of gas used to call the client contract's `handleOracleFulfillment` function
   * @param _source Perform algorithm source code
   * @param _secretsLocation secretsLocation
   * @param _encryptedSecretsReference encryptedSecretsReference


   */

  function setRequest(
    uint64 _subscriptionId,
    uint32 _fulfillGasLimit,
    string calldata _source,
    FunctionsRequest.Location _secretsLocation,
    bytes calldata _encryptedSecretsReference
  ) external onlyOwner {
    s_subscriptionId = _subscriptionId;
    s_fulfillGasLimit = _fulfillGasLimit;
    source = _source;
    secretsLocation = _secretsLocation;
    encryptedSecretsReference = _encryptedSecretsReference;
  }

  /**
   * @notice Used by Automation to check if performUpkeep should be called.
   *
   * The function's argument is unused in this example, but there is an option to have Automation pass custom data
   * that can be used by the checkUpkeep function.
   *
   * Returns a tuple where the first element is a boolean which determines if upkeep is needed and the
   * second element contains custom bytes data which is passed to performUpkeep when it is called by Automation.
   */
  function checkUpkeep(bytes memory) public view override returns (bool upkeepNeeded, bytes memory) {
    uint256 currentBucket = getCurrentBucket();
    uint256[] storage dealsToCheck = dealsInBucket[currentBucket];

    for (uint256 i = 0; i < dealsToCheck.length; i++) {
      uint256 dealId = dealsToCheck[i];
      DealDeadlines storage deadlines = dealDeadlines[dealId];
      if (block.timestamp >= deadlines.performDeadline) {
        return (true, abi.encode(dealId));
      }
    }

    return (false, bytes(""));
  }

  function performUpkeep(bytes calldata performData) external override {
    uint256 dealId = _decodePerformData(performData);
    _validateDealForUpkeep(dealId);
    _executeUpkeep(dealId);
  }

  function _decodePerformData(bytes calldata performData) internal pure returns (uint256) {
    return abi.decode(performData, (uint256));
  }

  function _validateDealForUpkeep(uint256 dealId) internal view {
    DealBasics storage basics = dealBasics[dealId];
    DealDeadlines storage deadlines = dealDeadlines[dealId];
    require(block.timestamp >= deadlines.performDeadline, "The deal provided is not at the performance stage...");
    require(basics.status == DealStatus.Active, "The deal provided is not active");
    (bool upkeepNeeded, ) = checkUpkeep("");
    require(upkeepNeeded, "Condition not met");
  }

  function _executeUpkeep(uint256 dealId) internal {
    s_lastUpkeepTimeStamp = block.timestamp;
    s_upkeepCounter = s_upkeepCounter + 1;

    FunctionsRequest.Request memory req = _prepareRequest(dealId);
    s_lastRequestId = _sendRequest(req.encodeCBOR(), s_subscriptionId, s_fulfillGasLimit, donId);
  }

  function _prepareRequest(uint256 dealId) internal view returns (FunctionsRequest.Request memory) {
    FunctionsRequest.Request memory req;
    req.initializeRequest(FunctionsRequest.Location.Inline, FunctionsRequest.CodeLanguage.JavaScript, source);
    req.secretsLocation = secretsLocation;
    req.encryptedSecretsReference = encryptedSecretsReference;

    DealDetails storage details = dealDetails[dealId];

    string[] memory args = new string[](3);
    args[0] = Strings.toString(dealId);
    args[1] = Strings.toString(details.impressionsTarget);
    args[2] = details.postURL;
    req.setArgs(args);

    return req;
  }

  /**
   * @notice Callback that is invoked once the DON has resolved the request or hit an error
   *
   * @param requestId The request ID, returned by sendRequest()
   * @param response Aggregated response from the user code
   * @param err Aggregated error from the user code or from the execution pipeline
   * Either response or error parameter will be set, but never both
   */
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    require(response.length == 96, "Invalid response length");

    s_lastResponse = response;
    s_lastError = err;
    s_responseCounter = s_responseCounter + 1;

    uint256 dealId;
    uint256 brandPercentage;
    uint256 influencerPercentage;

    // Decoding the response
    (dealId, brandPercentage, influencerPercentage) = abi.decode(response, (uint256, uint256, uint256));

    DealBasics storage basics = dealBasics[dealId];

    uint256 influencerAmount = (basics.brandDeposit * influencerPercentage) / 100;
    uint256 brandAmount = (basics.brandDeposit * brandPercentage) / 100;
    uint256 treasuryAmount = basics.brandDeposit - brandAmount - influencerAmount;

    require(influencerAmount + brandAmount <= basics.brandDeposit, "Total transfer amount exceeds deposit");

    _payAddress(basics.influencer, influencerAmount);
    _payAddress(basics.brand, brandAmount);
    _payAddress(hahaLabsTreasury, treasuryAmount);

    emit OCRResponse(requestId, response, err);
  }

  /**
   * @notice Set the DON ID
   * @param newDonId New DON ID
   */
  function setDonId(bytes32 newDonId) external onlyOwner {
    donId = newDonId;
  }

  // SMART CONTRACT LOGIC //

  // Function to set or change Haha Labs' admin
  function setHahaLabsVerifier(address _newVerifier) external onlyOwner {
    hahaLabsVerifier = _newVerifier;
  }

  // Function to set or change Haha Labs' admin
  function setHahaLabsTreasury(address _newTreasurery) external onlyOwner {
    hahaLabsTreasury = _newTreasurery;
  }

  function verifyDisputedContent(uint256 _dealId, bool _isAccepted) external {
    require(msg.sender == hahaLabsVerifier, "Only Haha Labs' verifier can verify content");

    DealBasics storage basics = dealBasics[_dealId];
    DealDetails storage details = dealDetails[_dealId];

    require(details.isDisputed, "Content is not disputed");

    if (_isAccepted) {
      // Content verified, update deal status
      details.isAccepted = true;
      details.isDisputed = false;

      uint256 influencerAmount = (basics.brandDeposit * 95) / 100; // 95% to the influencer
      uint256 hahaLabsFee = (basics.brandDeposit * 5) / 100; // 5% as verification fee

      // Ensure the total amount does not exceed the brand deposit
      require(influencerAmount + hahaLabsFee <= basics.brandDeposit, "Total transfer amount exceeds deposit");

      // Transfer funds
      _payAddress(basics.influencer, influencerAmount);
      _payAddress(hahaLabsTreasury, hahaLabsFee);

      // Emit the event after transfers
      emit DisputedContentVerified(_dealId, true, influencerAmount, 0, hahaLabsFee);
    } else {
      // Content not verified, potentially refund the brand
      details.isDisputed = false;
      // Transfers back the brand deposit to the brand
      uint256 refundAmount = basics.brandDeposit;

      _payAddress(basics.brand, refundAmount);

      emit DisputedContentVerified(
        _dealId,
        false,
        0, // No amount for influencer
        basics.brandDeposit, // Full refund to brand
        0 // No amount for hahaLabs
      );
    }

    // Mark the deal as Failed
    basics.status = DealStatus.Failed;
  }

  function createDeal(
    address _influencer,
    uint256 _brandDeposit,
    uint256 _timeToPost,
    uint256 _timeToVerify,
    uint256 _timeToPerform,
    uint256 _impressionsTarget,
    bytes32 _expectedContentHash
  ) external payable {
    IStableCoin token = IStableCoin(stableCoinAddress);

    require(token.transferFrom(msg.sender, address(this), _brandDeposit), "Tokens transfer failed");

    dealBasics[nextDealId] = DealBasics({
      brand: msg.sender,
      influencer: _influencer,
      brandDeposit: _brandDeposit,
      status: DealStatus.Active
    });

    dealDeadlines[nextDealId] = DealDeadlines({
      timeToPost: _timeToPost,
      timeToVerify: _timeToVerify,
      timeToPerform: _timeToPerform,
      postDeadline: 0,
      verifyDeadline: 0,
      performDeadline: 0
    });

    dealDetails[nextDealId] = DealDetails({
      postURL: "",
      impressionsTarget: _impressionsTarget,
      isAccepted: false,
      isDisputed: false,
      influencerSigned: false,
      expectedContentHash: _expectedContentHash
    });

    emit DealCreated(nextDealId, msg.sender, _influencer);
    nextDealId++;
  }

  function signDeal(uint256 _dealId) external {
    DealBasics storage basics = dealBasics[_dealId];
    DealDeadlines storage deadlines = dealDeadlines[_dealId];
    DealDetails storage details = dealDetails[_dealId];

    require(basics.status == DealStatus.Active, "The deal was deleted or is already done");
    require(msg.sender == basics.influencer, "Only the designated influencer can sign the deal");
    require(!details.influencerSigned, "Deal already signed");

    deadlines.postDeadline = block.timestamp + deadlines.timeToPost;
    details.influencerSigned = true;

    emit DealSigned(_dealId, msg.sender);
  }

  function postContent(uint256 _dealId, string memory _postURL) external {
    DealBasics storage basics = dealBasics[_dealId];
    DealDeadlines storage deadlines = dealDeadlines[_dealId];
    DealDetails storage details = dealDetails[_dealId];

    require(msg.sender == basics.influencer, "Only influencer can post content");
    require(details.influencerSigned, "Influencer must sign the deal first");
    require(basics.status == DealStatus.Active, "The deal was deleted or is already done");

    deadlines.verifyDeadline = block.timestamp + deadlines.timeToVerify;
    details.postURL = _postURL;

    emit ContentPosted(_dealId, _postURL);
  }

  function acceptContent(uint256 _dealId) external {
    DealBasics storage basics = dealBasics[_dealId];
    DealDeadlines storage deadlines = dealDeadlines[_dealId];
    DealDetails storage details = dealDetails[_dealId];

    require(msg.sender == basics.brand, "Only brand can accept content");
    require(deadlines.verifyDeadline != 0, "Content has not been posted yet");
    require(block.timestamp <= deadlines.verifyDeadline, "Verification period has expired");

    details.isAccepted = true;
    deadlines.performDeadline = block.timestamp + deadlines.timeToPerform;

    uint256 bucket = calculateBucket(deadlines.performDeadline);
    dealsInBucket[bucket].push(_dealId);

    emit ContentAccepted(_dealId);
  }

  function disputeContent(uint256 _dealId) external {
    DealBasics storage basics = dealBasics[_dealId];
    DealDeadlines storage deadlines = dealDeadlines[_dealId];
    DealDetails storage details = dealDetails[_dealId];

    require(msg.sender == basics.brand, "Only brand can dispute content");
    require(deadlines.verifyDeadline != 0, "Content has not been posted yet");
    require(block.timestamp <= deadlines.verifyDeadline, "Verification period has expired");

    details.isDisputed = true;

    emit ContentDisputed(_dealId);
  }

  function claimDeposit(uint256 _dealId) external {
    DealBasics storage basics = dealBasics[_dealId];
    DealDeadlines storage deadlines = dealDeadlines[_dealId];
    DealDetails storage details = dealDetails[_dealId];

    require(msg.sender == basics.brand, "Only the brand can claim the deposit");
    require(
      keccak256(abi.encodePacked(details.postURL)) == keccak256(abi.encodePacked("")) &&
        block.timestamp >= deadlines.postDeadline,
      "Content posted by the influencer before the post deadLine"
    );

    uint256 refundAmount = basics.brandDeposit;
    require(refundAmount > 0, "No deposit to refund");

    _payAddress(basics.brand, refundAmount);
    basics.brandDeposit = 0;
    basics.status = DealStatus.Failed;

    emit DepositRefunded(_dealId, msg.sender, refundAmount);
  }

  function deleteDeal(uint256 _dealId) external {
    DealBasics storage basics = dealBasics[_dealId];
    DealDetails storage details = dealDetails[_dealId];

    require(msg.sender == basics.brand, "Only the brand can delete the deal");
    require(!details.influencerSigned, "The deal has been signed already");

    uint256 refundAmount = basics.brandDeposit;
    require(refundAmount > 0, "No deposit to refund");

    _payAddress(basics.brand, refundAmount);
    basics.status = DealStatus.Failed;

    emit DepositRefunded(_dealId, msg.sender, refundAmount);
  }

  function getCurrentBucket() internal view returns (uint256) {
    uint256 bucketDuration = 1 days;
    uint256 currentBucket = block.timestamp / bucketDuration;
    return currentBucket;
  }

  function calculateBucket(uint256 performDeadline) internal pure returns (uint256) {
    uint256 bucketDuration = 1 days; // 24 hours
    uint256 bucketNumber = performDeadline / bucketDuration;
    return bucketNumber;
  }

  //Pay the mentionned address with contracts funds
  function _payAddress(address recipient, uint256 amount) internal {
    IStableCoin token = IStableCoin(stableCoinAddress);

    require(recipient != address(0), "Invalid recipient address");
    require(amount > 0, "Amount must be greater than zero");

    // Assuming `stableCoin` is your ERC20 token instance
    require(token.transfer(recipient, amount), "Token transfer failed");
  }
}
