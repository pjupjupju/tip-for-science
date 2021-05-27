import { gql } from '@apollo/client';

export const MY_SCORE_QUERY = gql`
  query MyScoreQuery {
    getMyScore
  }
`;
