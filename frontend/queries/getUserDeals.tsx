import { gql } from '@apollo/client';

export const GET_DEALS_BY_INFLUENCER= gql`
  query GetDealsByBrand($influencerId: ID!) {
    user(id: $influencerId) {
      dealsAsInfluencer {
        id
        brand {
          id
        }
        influencer {
          id
        }
        brandDeposit
        expectedContentHash
        impressionsTarget
        postDeadline
        timeToPerform
        timeToPost
        timeToVerify
        verifyDeadline
        status
        performDeadline
        contentAccepted {
          blockTimestamp
          transactionHash
        }
        contentDisputed {
          transactionHash
          blockTimestamp
        }
        contentPosted {
          blockTimestamp
          postURL
          transactionHash
        }
        dealCompleted {
          influencerAmount
          treasuryAmount
          brandAmount
          transactionHash
          blockTimestamp
        }
        dealSigned {
          blockTimestamp
          transactionHash
        }
        depositRefunded {
          transactionHash
          blockTimestamp
        }
        disputedContentVerified {
          transactionHash
          influencerAmount
          treasuryAmount
          blockTimestamp
          brandAmount
        }
      }
    }
  }
`;

export const calculateDealStage = (deal) => {
    // Check if the deal is completed
    if (deal.status === 'Completed') {
        return 'Completed';
    }

    // Check if the deal is signed
    if (Object.keys(deal.dealSigned).length === 0) {
        return 'SIGNING';
    }

    // Check if the content is posted
    if (Object.keys(deal.contentPosted).length === 0) {
        return 'POSTING';
    }

    // Check if the content is verified (accepted or disputed)
    if (Object.keys(deal.contentAccepted).length === 0 && Object.keys(deal.contentDisputed).length === 0) {
        return 'VERIFICATION';
    }

    // Check if the dispute content is verified (accepted or disputed)
    if (!(Object.keys(deal.contentDisputed).length === 0) && Object.keys(deal.disputedContentVerified).length === 0) {
        return 'DISPUTE VERIFICATION';
    }

    // If all above checks are passed, the deal is in the performance stage
    return 'PERFORMANCE';
};