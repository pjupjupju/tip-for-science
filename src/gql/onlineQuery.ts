import { gql } from '@apollo/client';

export const OnlineStatsQueryName = 'OnlineStatsQuery';

export const ONLINE_STATS_QUERY = gql`
  query ${OnlineStatsQueryName} {
    getOnlineStats {
      online
    }
  }
`;
