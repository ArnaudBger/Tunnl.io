import { gql } from '@apollo/client';

export const GET_DEALS_QUERY = gql`
  query Getdeals {
    deals {
            brand {
                id
            }
            influencer {
                id
            }
            id
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
`;