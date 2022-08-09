import { gql } from '@apollo/client';

export const SAVE_MUTATION = gql`
  mutation SaveTipMutation(
    $id: String!
    $tip: Float!
    $rId: Int!
    $gId: Int!
    $previousTips: [Float!]!
    $knewAnswer: Boolean
    $msElapsed: Int!
  ) {
    saveTip(
      id: $id
      tip: $tip
      rId: $rId
      gId: $gId
      previousTips: $previousTips
      knewAnswer: $knewAnswer
      msElapsed: $msElapsed
    )
  }
`;
