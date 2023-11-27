import {
  ContentAccepted as ContentAcceptedEvent,
  ContentDisputed as ContentDisputedEvent,
  ContentPosted as ContentPostedEvent,
  DealCompleted as DealCompletedEvent,
  DealCreated as DealCreatedEvent,
  DealSigned as DealSignedEvent,
  DepositRefunded as DepositRefundedEvent,
  DisputedContentVerified as DisputedContentVerifiedEvent,
  OCRResponse as OCRResponseEvent,
  OwnershipTransferRequested as OwnershipTransferRequestedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RequestFulfilled as RequestFulfilledEvent,
  RequestSent as RequestSentEvent
} from "../generated/InfluencerMarketingContract/InfluencerMarketingContract"
import {
  ContentAccepted,
  ContentDisputed,
  ContentPosted,
  DealCompleted,
  DealCreated,
  DealSigned,
  DepositRefunded,
  DisputedContentVerified,
  OCRResponse,
  OwnershipTransferRequested,
  OwnershipTransferred,
  RequestFulfilled,
  RequestSent
} from "../generated/schema"

export function handleContentAccepted(event: ContentAcceptedEvent): void {
  let entity = new ContentAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.dealId = event.params.dealId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContentDisputed(event: ContentDisputedEvent): void {
  let entity = new ContentDisputed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.dealId = event.params.dealId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContentPosted(event: ContentPostedEvent): void {
  let entity = new ContentPosted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.dealId = event.params.dealId
  entity.postURL = event.params.postURL

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDealCompleted(event: DealCompletedEvent): void {
  let entity = new DealCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.dealId = event.params.dealId
  entity.influencerAmount = event.params.influencerAmount
  entity.brandAmount = event.params.brandAmount
  entity.treasuryAmount = event.params.treasuryAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDealCreated(event: DealCreatedEvent): void {
  let entity = new DealCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.dealId = event.params.dealId
  entity.param1_brand = event.params.param1.brand
  entity.param1_influencer = event.params.param1.influencer
  entity.param1_brandDeposit = event.params.param1.brandDeposit
  entity.param1_status = event.params.param1.status
  entity.param2_timeToPost = event.params.param2.timeToPost
  entity.param2_timeToVerify = event.params.param2.timeToVerify
  entity.param2_timeToPerform = event.params.param2.timeToPerform
  entity.param2_postDeadline = event.params.param2.postDeadline
  entity.param2_verifyDeadline = event.params.param2.verifyDeadline
  entity.param2_performDeadline = event.params.param2.performDeadline
  entity.param3_postURL = event.params.param3.postURL
  entity.param3_impressionsTarget = event.params.param3.impressionsTarget
  entity.param3_isAccepted = event.params.param3.isAccepted
  entity.param3_isDisputed = event.params.param3.isDisputed
  entity.param3_influencerSigned = event.params.param3.influencerSigned
  entity.param3_expectedContentHash = event.params.param3.expectedContentHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDealSigned(event: DealSignedEvent): void {
  let entity = new DealSigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.dealId = event.params.dealId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDepositRefunded(event: DepositRefundedEvent): void {
  let entity = new DepositRefunded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.dealId = event.params.dealId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDisputedContentVerified(
  event: DisputedContentVerifiedEvent
): void {
  let entity = new DisputedContentVerified(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.dealId = event.params.dealId
  entity.isAccepted = event.params.isAccepted
  entity.influencerAmount = event.params.influencerAmount
  entity.brandAmount = event.params.brandAmount
  entity.treasuryAmount = event.params.treasuryAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOCRResponse(event: OCRResponseEvent): void {
  let entity = new OCRResponse(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId
  entity.result = event.params.result
  entity.err = event.params.err

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferRequested(
  event: OwnershipTransferRequestedEvent
): void {
  let entity = new OwnershipTransferRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRequestFulfilled(event: RequestFulfilledEvent): void {
  let entity = new RequestFulfilled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.InfluencerMarketingContract_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRequestSent(event: RequestSentEvent): void {
  let entity = new RequestSent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.InfluencerMarketingContract_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
