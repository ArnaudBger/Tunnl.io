import { gql } from '@apollo/client';

export const GET_TOTAL_EARNED_BY_INFLUENCER= gql`
  query GetDealsByBrand($influencerId: ID!) {
    user(id: $influencerId) {
    totalAmountEarned
    }
  }
`;