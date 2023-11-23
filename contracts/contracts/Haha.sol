// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Placeholder for Chainlink interfaces, assuming they are imported here
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract InfluencerMarketingContract {
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
        uint256 postDeadLine;
        uint256 verifyDeadLine;
        uint256 performDeadLine;
        DealStatus status;
        bytes32 expectedContentHash;
        bytes32 actualContentHash;
    }

    address public owner;

     // Define a new role for Haha Labs' administrator
    address public hahaLabsAdmin;

    // Define the hahaLabsTreasury
    address public hahaLabsTreasury;

    mapping(uint256 => Deal) public deals;
    mapping(address => uint256) public reputationScores;
    mapping(address => uint256) public dealsPerAddress;

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
    
    constructor() {
        owner = msg.sender;
        hahaLabsAdmin = msg.sender; // Initially set to the contract creator
    }

    // Function to set or change Haha Labs' admin
    function setHahaLabsAdmin(address _newAdmin) external {
        require(msg.sender == owner, "Only owner can set Haha Labs' admin");
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

            uint256 influencerAmount = deal.brandDeposit * 30 / 100; // 30% to the influencer
            uint256 brandRefundAmount = deal.brandDeposit * 65 / 100; // 65% refunded to the brand
            uint256 hahaLabsFee = deal.brandDeposit * 5 / 100; // 5% as verification fee

            // Ensure the total amount does not exceed the brand deposit
            require(influencerAmount + brandRefundAmount + hahaLabsFee == deal.brandDeposit, "Total transfer amount exceeds deposit");

            // Transfer funds
            payable(deal.influencer).transfer(influencerAmount);
            payable(deal.brand).transfer(brandRefundAmount);
            payable(hahaLabsTreasury).transfer(hahaLabsFee);

            // Emit the event after transfers
            emit DisputedContentVerified(
                _dealId,
                true,
                influencerAmount,
                brandRefundAmount,
                hahaLabsFee
            );

        } else {
            // Content not verified, potentially refund the brand
            deal.isDisputed = false;
            // Transfers back the brand deposit to the brand
            payable(deal.brand).transfer(refundAmount);

            emit DisputedContentVerified(
                _dealId,
                false,
                0, // No amount for influencer
                deal.brandDeposit, // Full refund to brand
                0 // No amount for hahaLabs
            );
        }

        event DisputedContentVerified(
        uint256 indexed dealId, 
        bool isAccepted, 
        uint256 influencerAmount,
        uint256 brandAmount,
        uint256 hahaLabsAmount
    );

        // Mark the deal as Failed
        deal.status = DealStatus.failed;

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
        uint256 _likesTarget
    ) external payable {
        require(msg.value == _brandDeposit, "Incorrect deposit amount");

        deals[nextDealId] = Deal({
            brand: msg.sender,
            influencer: _influencer,
            brandDeposit: _brandDeposit,
            postDeadLine: 0,
            verifyDeadLine: 0,
            performDeadLine: 0,
            timeToPost: _timeToPost,
            postURL: "",
            timeToVerify: _timeToVerify,
            timeToPerform: _timeToPerform,
            targetType: _targetType,
            impressionsTarget: _impressionsTarget,
            likesTarget: _likesTarget,
            isAccepted: false,
            isDisputed: false,
            influencerSigned: false
            status: DealStatus.Active;

        });

        emit DealCreated(nextDealId, msg.sender, _influencer);
        nextDealId++;
    }

    // Influencer signs the deal and deposits security amount
    function signDeal(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.influencer, "Only the designated influencer can sign the deal");
        require(!deal.influencerSigned, "Deal already signed");
        deal.postDeadLine = block.timestamp + deal.timeToPost,
        deal.influencerSigned = true;
        emit DealSigned(_dealId, msg.sender);
    }

    // Influencer posts the content
    function postContent(uint256 _dealId, string memory _postURL) external {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.influencer, "Only influencer can post content");
        require(block.timestamp <= deal.postDeadline, "Posting period has expired");
        require(deal.influencerSigned, "Influencer must sign the deal first");
        deal.verifyDeadLine = block.timestamp + timeToVerify;
        deal.postURL = _postURL;
        emit ContentPosted(_dealId, _postURL);
    }

    // Brand accepts the content
    function acceptContent(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.brand, "Only brand can accept content");
        require(block.timestamp <= deal.verifyDeadline, "Verification period has expired");
        deal.isAccepted = true;
        deal.performDeadLine =  block.timestamp + deal.timeToPerform;
        emit ContentAccepted(_dealId);
    }

    // Brand dispute the content
    function disputeContent(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.brand, "Only brand can dispute content);
        require(block.timestamp <= deal.verifyDeadline, "Verification period has expired");
        deal.isDisputed = true;
        deal.performDeadLine = block.timestamp + deal.timeToPerform;
        emit ContentDisputed(_dealId);
    }

    function claimDeposit(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        // Ensure only the brand involved in the deal can claim the deposit
        require(msg.sender == deal.brand, "Only the brand can claim the deposit");

        // Check if the content was posted and if the postDeadLine has elapsed 
        require((deal.postURL == "" && block.timestamp >= deal.postDeadline) , "Content not posted by the influencer and posting deadline has passed");

        // Calculate the amount to be refunded
        uint256 refundAmount = deal.brandDeposit;
        
        // Ensure there's a deposit to refund
        require(refundAmount > 0, "No deposit to refund");

        // Transfer the deposit back to the brand
        payable(deal.brand).transfer(refundAmount);

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
        payable(deal.brand).transfer(refundAmount);

        emit DepositRefunded(_dealId, msg.sender, refundAmount);

        // Mark the deal as Failed
        deal.status = DealStatus.Failed;
    }   

       // Placeholder function for Chainlink Oracle to check post performance
    function checkPerformance(uint256 _dealId) external {
        // Implement Chainlink Oracle integration
        // Logic to validate performance against targets and calculate payouts
    }


}
