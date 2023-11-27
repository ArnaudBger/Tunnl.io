import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import { ContentAccepted } from "../generated/schema"
import { ContentAccepted as ContentAcceptedEvent } from "../generated/InfluencerMarketingContract/InfluencerMarketingContract"
import { handleContentAccepted } from "../src/influencer-marketing-contract"
import { createContentAcceptedEvent } from "./influencer-marketing-contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let dealId = BigInt.fromI32(234)
    let newContentAcceptedEvent = createContentAcceptedEvent(dealId)
    handleContentAccepted(newContentAcceptedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ContentAccepted created and stored", () => {
    assert.entityCount("ContentAccepted", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ContentAccepted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "dealId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
