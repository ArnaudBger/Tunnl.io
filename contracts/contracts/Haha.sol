// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Placeholder for Chainlink interfaces, assuming they are imported here
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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

    // State variables for Chainlink Automation
    uint256 public s_updateInterval;
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

    enum TargetType { Impressions, Likes, Both }
    enum DealStatus { Done, Active, Failed }


    struct Deal {
        address brand;
        address influencer;
        uint256 brandDeposit;
        uint256 timeToPost;
        string postURL;
        uint256 timeToVerify;
        uint256 timeToPerform;
        TargetType targetType;
        uint256 impressionsTarget;
        uint256 likesTarget;
        bool isAccepted;
        bool isDisputed;
        bool influencerSigned;
        uint256 postDeadline;
        uint256 verifyDeadline;
        uint256 performDeadline;
        DealStatus status;
        bytes32 expectedContentHash;
    }

    // Define a new role for Haha Labs' administrator
    address public hahaLabsAdmin;

    // Define the hahaLabsTreasury
    address public hahaLabsTreasury;

    mapping(uint256 => Deal) public deals;
    mapping(address => uint256) public reputationScores;
    mapping(address => uint256) public dealsPerAddress;
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

    constructor(address router, bytes32 _donId, address _tokenAddress) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        donId = _donId;
        hahaLabsAdmin = msg.sender; // Initially set to the contract creator
        s_lastUpkeepTimeStamp = 0;
        stableCoinAddress = _tokenAddress;
    }

    // CHAINLINK AUTOMATED FUNCTIONS RELATED FUNCTIONS //


  /**
   * @notice Sets the bytes representing the CBOR-encoded FunctionsRequest.Request that is sent when performUpkeep is called

   * @param _subscriptionId The Functions billing subscription ID used to pay for Functions requests
   * @param _fulfillGasLimit Maximum amount of gas used to call the client contract's `handleOracleFulfillment` function
   * @param _updateInterval Time interval at which Chainlink Automation should call performUpkeep
   * @param requestCBOR Bytes representing the CBOR-encoded FunctionsRequest.Request
   */
  function setRequest(
    uint64 _subscriptionId,
    uint32 _fulfillGasLimit,
    uint256 _updateInterval,
    bytes calldata requestCBOR
  ) external onlyOwner {
    s_updateInterval = _updateInterval;
    s_subscriptionId = _subscriptionId;
    s_fulfillGasLimit = _fulfillGasLimit;
    s_requestCBOR = requestCBOR;
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
    uint256 currentBucket = getCurrentBucket(); // A function to determine the current bucket based on `block.timestamp`
    uint256[] storage dealsToCheck = dealsInBucket[currentBucket];

    for (uint256 i = 0; i < dealsToCheck.length; i++) {
        uint256 dealId = dealsToCheck[i];
        // Assuming dealPerformanceTimes stores the exact timestamp
        if (block.timestamp >= deals[dealId].performDeadline) {
            return (true, abi.encode(dealId));
        }
    }

        return (false, bytes(""));
    }

  /**
   * @notice Called by Automation to trigger a Functions request
   *
   * The function's argument is unused in this example, but there is an option to have Automation pass custom data
   * returned by checkUpkeep (See Chainlink Automation documentation)
   */
  function performUpkeep(bytes calldata) external override {
    (bool upkeepNeeded, ) = checkUpkeep("");
    require(upkeepNeeded, "Time interval not met");
    s_lastUpkeepTimeStamp = block.timestamp;
    s_upkeepCounter = s_upkeepCounter + 1;

    bytes32 requestId = _sendRequest(s_requestCBOR, s_subscriptionId, s_fulfillGasLimit, donId);
    s_lastRequestId = requestId;
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
    s_lastResponse = response;
    s_lastError = err;
    s_responseCounter = s_responseCounter + 1;
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
    function setHahaLabsAdmin(address _newAdmin) external onlyOwner {
        hahaLabsAdmin = _newAdmin;
    }

    // Function for Haha Labs to verify disputed content
    function verifyDisputedContent(uint256 _dealId, bool _isAccepted) external {
        require(msg.sender == hahaLabsAdmin, "Only Haha Labs' admin can verify content");
        Deal storage deal = deals[_dealId];
        require(deal.isDisputed, "Content is not disputed");

        if (_isAccepted) {
            // Content verified, update deal status
            deal.isAccepted = true;
            deal.isDisputed = false;

            uint256 influencerAmount = deal.brandDeposit * 95 / 100; // 95% to the influencer
            uint256 hahaLabsFee = deal.brandDeposit * 5 / 100; // 5% as verification fee

            // Ensure the total amount does not exceed the brand deposit
            require(influencerAmount + hahaLabsFee == deal.brandDeposit, "Total transfer amount exceeds deposit");

            // Transfer funds
            _payAddress(deal.influencer, influencerAmount);
            _payAddress(hahaLabsTreasury, hahaLabsFee);

            // Emit the event after transfers
            emit DisputedContentVerified(
                _dealId,
                true,
                influencerAmount,
                0,
                hahaLabsFee
            );

        } else {
            // Content not verified, potentially refund the brand
            deal.isDisputed = false;
            // Transfers back the brand deposit to the brand
            uint256 refundAmount = deal.brandDeposit;

            _payAddress(deal.brand, refundAmount);

            emit DisputedContentVerified(
                _dealId,
                false,
                0, // No amount for influencer
                deal.brandDeposit, // Full refund to brand
                0 // No amount for hahaLabs
            );
        }

        // Mark the deal as Failed
        deal.status = DealStatus.Failed;

        // Emit appropriate events if necessary
    }

    function createDeal(
        address _influencer,
        uint256 _brandDeposit,
        uint256 _timeToPost,
        uint256 _timeToVerify,
        uint256 _timeToPerform,
        TargetType _targetType,
        uint256 _impressionsTarget,
        uint256 _likesTarget,
        bytes32 _expectedContentHash
    ) external payable {
        IStableCoin token = IStableCoin(stableCoinAddress);
        uint8 stcDecimals = IStableCoin(stableCoinAddress).decimals();

        require(token.transfer(address(this), _brandDeposit * 10 ** stcDecimals), "Tokens transfer failed");

        deals[nextDealId] = Deal({
            brand: msg.sender,
            influencer: _influencer,
            brandDeposit: _brandDeposit,
            postDeadline: 0,
            verifyDeadline: 0,
            performDeadline: 0,
            timeToPost: _timeToPost,
            postURL: "",
            timeToVerify: _timeToVerify,
            timeToPerform: _timeToPerform,
            targetType: _targetType,
            impressionsTarget: _impressionsTarget,
            likesTarget: _likesTarget,
            isAccepted: false,
            isDisputed: false,
            influencerSigned: false,
            status: DealStatus.Active,
            expectedContentHash: _expectedContentHash
        });

        emit DealCreated(nextDealId, msg.sender, _influencer);
        nextDealId++;
    }

    // Influencer signs the deal
    function signDeal(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.influencer, "Only the designated influencer can sign the deal");
        require(!deal.influencerSigned, "Deal already signed");
        deal.postDeadline = block.timestamp + deal.timeToPost;
        deal.influencerSigned = true;
        emit DealSigned(_dealId, msg.sender);
    }

    // Influencer posts the content
    function postContent(uint256 _dealId, string memory _postURL) external {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.influencer, "Only influencer can post content");
        require(block.timestamp <= deal.postDeadline, "Posting period has expired");
        require(deal.influencerSigned, "Influencer must sign the deal first");
        deal.verifyDeadline = block.timestamp + deal.timeToVerify;
        deal.postURL = _postURL;
        emit ContentPosted(_dealId, _postURL);
    }

    // Brand accepts the content
    function acceptContent(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.brand, "Only brand can accept content");
        require(block.timestamp <= deal.postDeadline, "Verification period has expired");
        deal.isAccepted = true;
        deal.performDeadline =  block.timestamp + deal.timeToPerform;

        // Set the performDeadline
        uint256 performDeadline = block.timestamp + deal.timeToPerform;

        // Calculate the bucket
        uint256 bucket = calculateBucket(performDeadline);

        // Add the deal to the bucket
        dealsInBucket[bucket].push(_dealId);

        emit ContentAccepted(_dealId);

    }

    function calculateBucket(uint256 performDeadline) internal pure returns (uint256) {
    uint256 bucketDuration = 1 days; // 24 hours
    uint256 bucketNumber = performDeadline / bucketDuration;
    return bucketNumber;
    }

    // Brand dispute the content
    function disputeContent(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.brand, "Only brand can dispute content");
        require(block.timestamp <= deal.verifyDeadline, "Verification period has expired");
        deal.isDisputed = true;
        deal.performDeadline = block.timestamp + deal.timeToPerform;
        emit ContentDisputed(_dealId);
    }

    function claimDeposit(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        // Ensure only the brand involved in the deal can claim the deposit
        require(msg.sender == deal.brand, "Only the brand can claim the deposit");

        // Check if the content was posted and if the postDeadLine has elapsed 
        require(
        (keccak256(abi.encodePacked(deal.postURL)) == keccak256(abi.encodePacked(""))) && 
        (block.timestamp >= deal.postDeadline),
        "Content not posted by the influencer or posting deadline passed"
        );

        // Calculate the amount to be refunded
        uint256 refundAmount = deal.brandDeposit;
        
        // Ensure there's a deposit to refund
        require(refundAmount > 0, "No deposit to refund");

        // Transfer the deposit back to the brand
        _payAddress(deal.brand, refundAmount);

        // Optionally, update the deal's state

        deal.brandDeposit = 0;
        // Emit an event if necessary
        emit DepositRefunded(_dealId, msg.sender, refundAmount);

        // Mark the deal as Failed
        deal.status = DealStatus.Failed;
    }

    function deleteDeal(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];

        // Ensure only the brand involved in the deal can delete the deal
        require(msg.sender == deal.brand, "Only the brand can claim the deposit");

        // Ensure the influencer hasn't signed the deal
        require(!deal.influencerSigned, "The deal has been signed already");

        // Calculate the amount to be refunded
        uint256 refundAmount = deal.brandDeposit;
        
        // Ensure there's a deposit to refund
        require(refundAmount > 0, "No deposit to refund");
        
        // Transfer the deposit back to the brand
        _payAddress(deal.brand, refundAmount);

        emit DepositRefunded(_dealId, msg.sender, refundAmount);

        // Mark the deal as Failed
        deal.status = DealStatus.Failed;
    }   

    function getCurrentBucket() internal view returns (uint256) {
        uint256 bucketDuration = 1 days;
        uint256 currentBucket = block.timestamp / bucketDuration;
        return currentBucket;
    }

    //Pay the mentionned address with contracts funds
    function _payAddress(address recipient, uint256 amount) internal {
        IStableCoin token = IStableCoin(stableCoinAddress);
        uint8 stcDecimals = IStableCoin(stableCoinAddress).decimals();

        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");

        // Assuming `stableCoin` is your ERC20 token instance
        require(token.transfer(recipient, amount * 10 ** stcDecimals), "Token transfer failed");
}

}
