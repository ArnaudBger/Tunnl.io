import {
  ContentAccepted as ContentAcceptedEvent,
  ContentDisputed as ContentDisputedEvent,
  ContentPosted as ContentPostedEvent,
  DealCompleted as DealCompletedEvent,
  DealCreated as DealCreatedEvent,
  DealSigned as DealSignedEvent,
  DepositRefunded as DepositRefundedEvent,
  DisputedContentVerified as DisputedContentVerifiedEvent,
} from "../generated/InfluencerMarketingContract/InfluencerMarketingContract"
import {
  Deal,
  User,
  ContentAccepted,
  ContentDisputed,
  ContentPosted,
  DealCompleted,
  DealCreated,
  DealSigned,
  DepositRefunded,
  DisputedContentVerified,
} from "../generated/schema"


export function handleDealCreated(event: DealCreatedEvent): void {
  let entity = new Deal(event.params.dealId.toString())

  // Load the user entity associated with the brand address
  let brandAddress = event.params.param1.brand.toHexString();
  let brandUser = User.load(brandAddress);

  if (brandUser == null) {
    brandUser = new User(brandAddress);
    brandUser.save();
  }

  // Load the user entity associated with the influencer address
  let influencerAddress = event.params.param1.influencer.toHexString();
  let influencerUser = User.load(influencerAddress);

  if (influencerUser == null) {
    influencerUser = new User(influencerAddress);
    influencerUser.save();
  }

  entity.brand = brandAddress;
  entity.influencer = influencerAddress;
  entity.brandDeposit = event.params.param1.brandDeposit;
  entity.status = event.params.param1.status;
  entity.timeToPost = event.params.param2.timeToPost;
  entity.timeToVerify = event.params.param2.timeToVerify;
  entity.timeToPerform = event.params.param2.timeToPerform;
  entity.postDeadline = event.params.param2.postDeadline;
  entity.verifyDeadline = event.params.param2.verifyDeadline;
  entity.performDeadline = event.params.param2.performDeadline;
  entity.postURL = event.params.param3.postURL;
  entity.impressionsTarget = event.params.param3.impressionsTarget;
  entity.expectedContentHash = event.params.param3.expectedContentHash;

  entity.save();
}

export function handleDealSigned(event: DealSignedEvent): void {
  let entity = new DealSigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  // Load the Deal entity associated with the dealId from the event
  let dealID = event.params.dealId.toString()

  let deal = Deal.load(dealID);
  if (!deal) {
    // If the deal is not found, it might indicate a logical error or missing data
    // You might want to handle this case, possibly by logging or creating a new Deal entity
    return;
  }
  entity.deal = dealID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContentPosted(event: ContentPostedEvent): void {
  let entity = new ContentPosted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

   // Load the Deal entity associated with the dealId from the event
  let dealID = event.params.dealId.toString()
  
  let deal = Deal.load(dealID);
  if (!deal) {
    // If the deal is not found, it might indicate a logical error or missing data
    // You might want to handle this case, possibly by logging or creating a new Deal entity
    return;
  }
  entity.deal = dealID


  entity.postURL = event.params.postURL
  
  //Update the deal entity on postURL
  deal.postURL = event.params.postURL

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  deal.save()
}

export function handleContentAccepted(event: ContentAcceptedEvent): void {
  let entity = new ContentAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
   // Load the Deal entity associated with the dealId from the event
   let dealID = event.params.dealId.toString()
  
   let deal = Deal.load(dealID);
   if (!deal) {
     // If the deal is not found, it might indicate a logical error or missing data
     // You might want to handle this case, possibly by logging or creating a new Deal entity
     return;
   }
   entity.deal = dealID
 

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContentDisputed(event: ContentDisputedEvent): void {
  let entity = new ContentDisputed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
   // Load the Deal entity associated with the dealId from the event
   let dealID = event.params.dealId.toString()
  
   let deal = Deal.load(dealID);
   if (!deal) {
     // If the deal is not found, it might indicate a logical error or missing data
     // You might want to handle this case, possibly by logging or creating a new Deal entity
     return;
   }
   entity.deal = dealID
 

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDealCompleted(event: DealCompletedEvent): void {
  let entity = new DealCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
   // Load the Deal entity associated with the dealId from the event
   let dealID = event.params.dealId.toString()
  
   let deal = Deal.load(dealID);
   if (!deal) {
     // If the deal is not found, it might indicate a logical error or missing data
     // You might want to handle this case, possibly by logging or creating a new Deal entity
     return;
   }
   entity.deal = dealID
 

  entity.influencerAmount = event.params.influencerAmount
  entity.brandAmount = event.params.brandAmount
  entity.treasuryAmount = event.params.treasuryAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  //Update deal status
  deal.status = 0
}


export function handleDepositRefunded(event: DepositRefundedEvent): void {
  let entity = new DepositRefunded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  // Load the Deal entity associated with the dealId from the event
  let dealID = event.params.dealId.toString()
  
  let deal = Deal.load(dealID);
   if (!deal) {
     // If the deal is not found, it might indicate a logical error or missing data
     // You might want to handle this case, possibly by logging or creating a new Deal entity
     return;
   }
  entity.deal = dealID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  //Update deal status
  deal.status = 2
}

export function handleDisputedContentVerified(
  event: DisputedContentVerifiedEvent
): void {
  let entity = new DisputedContentVerified(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  // Load the Deal entity associated with the dealId from the event
  let dealID = event.params.dealId.toString()
  
  let deal = Deal.load(dealID);
  if (!deal) {
    // If the deal is not found, it might indicate a logical error or missing data
    // You might want to handle this case, possibly by logging or creating a new Deal entity
    return;
   }
   entity.deal = dealID
 

  entity.isAccepted = event.params.isAccepted
  entity.influencerAmount = event.params.influencerAmount
  entity.brandAmount = event.params.brandAmount
  entity.treasuryAmount = event.params.treasuryAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
