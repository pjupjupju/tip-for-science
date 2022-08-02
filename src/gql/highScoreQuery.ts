import { gql } from '@apollo/client';

export const HighScoreQueryName = 'HighScoreQuery';

export const HIGH_SCORE_QUERY = gql`
  query ${HighScoreQueryName} {
    getHighScore {
      score
      slug
    }
  }
`;
