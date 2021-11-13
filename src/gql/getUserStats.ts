import { gql } from '@apollo/client';

export const MyUserStatsQueryName = 'MyUserStatsQuery';

export const MY_USER_STATS_QUERY = gql`
  query ${MyUserStatsQueryName} {
    getUserStats {
      days { day, score }
    }
  }
`;
