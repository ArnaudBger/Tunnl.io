import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
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
} from "../generated/InfluencerMarketingContract/InfluencerMarketingContract"

export function createContentAcceptedEvent(dealId: BigInt): ContentAccepted {
  let contentAcceptedEvent = changetype<ContentAccepted>(newMockEvent())

  contentAcceptedEvent.parameters = new Array()

  contentAcceptedEvent.parameters.push(
    new ethereum.EventParam("dealId", ethereum.Value.fromUnsignedBigInt(dealId))
  )

  return contentAcceptedEvent
}

export function createContentDisputedEvent(dealId: BigInt): ContentDisputed {
  let contentDisputedEvent = changetype<ContentDisputed>(newMockEvent())

  contentDisputedEvent.parameters = new Array()

  contentDisputedEvent.parameters.push(
    new ethereum.EventParam("dealId", ethereum.Value.fromUnsignedBigInt(dealId))
  )

  return contentDisputedEvent
}

export function createContentPostedEvent(
  dealId: BigInt,
  postURL: string
): ContentPosted {
  let contentPostedEvent = changetype<ContentPosted>(newMockEvent())

  contentPostedEvent.parameters = new Array()

  contentPostedEvent.parameters.push(
    new ethereum.EventParam("dealId", ethereum.Value.fromUnsignedBigInt(dealId))
  )
  contentPostedEvent.parameters.push(
    new ethereum.EventParam("postURL", ethereum.Value.fromString(postURL))
  )

  return contentPostedEvent
}

export function createDealCompletedEvent(
  dealId: BigInt,
  influencerAmount: BigInt,
  brandAmount: BigInt,
  treasuryAmount: BigInt
): DealCompleted {
  let dealCompletedEvent = changetype<DealCompleted>(newMockEvent())

  dealCompletedEvent.parameters = new Array()

  dealCompletedEvent.parameters.push(
    new ethereum.EventParam("dealId", ethereum.Value.fromUnsignedBigInt(dealId))
  )
  dealCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "influencerAmount",
      ethereum.Value.fromUnsignedBigInt(influencerAmount)
    )
  )
  dealCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "brandAmount",
      ethereum.Value.fromUnsignedBigInt(brandAmount)
    )
  )
  dealCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "treasuryAmount",
      ethereum.Value.fromUnsignedBigInt(treasuryAmount)
    )
  )

  return dealCompletedEvent
}

export function createDealCreatedEvent(
  dealId: BigInt,
  param1: ethereum.Tuple,
  param2: ethereum.Tuple,
  param3: ethereum.Tuple
): DealCreated {
  let dealCreatedEvent = changetype<DealCreated>(newMockEvent())

  dealCreatedEvent.parameters = new Array()

  dealCreatedEvent.parameters.push(
    new ethereum.EventParam("dealId", ethereum.Value.fromUnsignedBigInt(dealId))
  )
  dealCreatedEvent.parameters.push(
    new ethereum.EventParam("param1", ethereum.Value.fromTuple(param1))
  )
  dealCreatedEvent.parameters.push(
    new ethereum.EventParam("param2", ethereum.Value.fromTuple(param2))
  )
  dealCreatedEvent.parameters.push(
    new ethereum.EventParam("param3", ethereum.Value.fromTuple(param3))
  )

  return dealCreatedEvent
}

export function createDealSignedEvent(dealId: BigInt): DealSigned {
  let dealSignedEvent = changetype<DealSigned>(newMockEvent())

  dealSignedEvent.parameters = new Array()

  dealSignedEvent.parameters.push(
    new ethereum.EventParam("dealId", ethereum.Value.fromUnsignedBigInt(dealId))
  )

  return dealSignedEvent
}

export function createDepositRefundedEvent(dealId: BigInt): DepositRefunded {
  let depositRefundedEvent = changetype<DepositRefunded>(newMockEvent())

  depositRefundedEvent.parameters = new Array()

  depositRefundedEvent.parameters.push(
    new ethereum.EventParam("dealId", ethereum.Value.fromUnsignedBigInt(dealId))
  )

  return depositRefundedEvent
}

export function createDisputedContentVerifiedEvent(
  dealId: BigInt,
  isAccepted: boolean,
  influencerAmount: BigInt,
  brandAmount: BigInt,
  treasuryAmount: BigInt
): DisputedContentVerified {
  let disputedContentVerifiedEvent = changetype<DisputedContentVerified>(
    newMockEvent()
  )

  disputedContentVerifiedEvent.parameters = new Array()

  disputedContentVerifiedEvent.parameters.push(
    new ethereum.EventParam("dealId", ethereum.Value.fromUnsignedBigInt(dealId))
  )
  disputedContentVerifiedEvent.parameters.push(
    new ethereum.EventParam(
      "isAccepted",
      ethereum.Value.fromBoolean(isAccepted)
    )
  )
  disputedContentVerifiedEvent.parameters.push(
    new ethereum.EventParam(
      "influencerAmount",
      ethereum.Value.fromUnsignedBigInt(influencerAmount)
    )
  )
  disputedContentVerifiedEvent.parameters.push(
    new ethereum.EventParam(
      "brandAmount",
      ethereum.Value.fromUnsignedBigInt(brandAmount)
    )
  )
  disputedContentVerifiedEvent.parameters.push(
    new ethereum.EventParam(
      "treasuryAmount",
      ethereum.Value.fromUnsignedBigInt(treasuryAmount)
    )
  )

  return disputedContentVerifiedEvent
}

export function createOCRResponseEvent(
  requestId: Bytes,
  result: Bytes,
  err: Bytes
): OCRResponse {
  let ocrResponseEvent = changetype<OCRResponse>(newMockEvent())

  ocrResponseEvent.parameters = new Array()

  ocrResponseEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  ocrResponseEvent.parameters.push(
    new ethereum.EventParam("result", ethereum.Value.fromBytes(result))
  )
  ocrResponseEvent.parameters.push(
    new ethereum.EventParam("err", ethereum.Value.fromBytes(err))
  )

  return ocrResponseEvent
}

export function createOwnershipTransferRequestedEvent(
  from: Address,
  to: Address
): OwnershipTransferRequested {
  let ownershipTransferRequestedEvent = changetype<OwnershipTransferRequested>(
    newMockEvent()
  )

  ownershipTransferRequestedEvent.parameters = new Array()

  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferRequestedEvent
}

export function createOwnershipTransferredEvent(
  from: Address,
  to: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferredEvent
}

export function createRequestFulfilledEvent(id: Bytes): RequestFulfilled {
  let requestFulfilledEvent = changetype<RequestFulfilled>(newMockEvent())

  requestFulfilledEvent.parameters = new Array()

  requestFulfilledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return requestFulfilledEvent
}

export function createRequestSentEvent(id: Bytes): RequestSent {
  let requestSentEvent = changetype<RequestSent>(newMockEvent())

  requestSentEvent.parameters = new Array()

  requestSentEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return requestSentEvent
}
