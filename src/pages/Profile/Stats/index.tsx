import React from 'react';
import { useQuery } from '@apollo/client';
import { UserScoreCurve } from '../../../components/UserScoreCurve';
import { Heading, Flex, Text, Box } from 'rebass';

import {
  HIGH_SCORE_QUERY,
  MY_SCORE_QUERY,
  MY_USER_STATS_QUERY,
} from '../../../gql';
import { Spinner } from '../../../components';
import { User } from '../../../types';

const Stats = ({ user }: { user: User | null }) => {
  const { loading, data } = useQuery(MY_USER_STATS_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });
  const { loading: highScoreLoading, data: highScoreData } =
    useQuery(HIGH_SCORE_QUERY);
  const { loading: scoreLoading, data: getMyScoreData } = useQuery(
    MY_SCORE_QUERY,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
    }
  );

  if (loading || scoreLoading || highScoreLoading) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
        p="3"
      >
        <Spinner />
      </Flex>
    );
  }
  const stats = data.getUserStats.days.map(
    (d: { day: string; score: number }) => ({
      x: d.day,
      y: d.score,
    })
  );

  const highScore = highScoreData.getHighScore;

  return (
    <>
      <Heading color="secondary" fontSize={[2, 3, 4]} my="4" mx="3">
        Tvoje skóre: {getMyScoreData.getMyScore}
      </Heading>
      <Heading color="secondary" fontSize={[2, 3, 4]} mb="2" mx="3">
        Vývoj tvého skóre:
      </Heading>
      <Box sx={{ flexGrow: 1, maxHeight: 400 }}>
        {stats.length > 0 ? (
          <UserScoreCurve stats={stats} />
        ) : (
          <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Text color="white" textAlign="center">
              Zatím tady nic není. Až začneš hrát, objeví se tady graf tvého
              postupu.
            </Text>
          </Flex>
        )}
      </Box>
      <Heading color="secondary" fontSize={[2, 3, 4]} mb="2" mx="3">
        Top skóre:
      </Heading>
      {highScore &&
        highScore.map(
          (player: { score: number; slug: string }, index: number) => (
            <Text color="secondary">
              <Text fontWeight="bold" as="span" color="accent" ml="5">
                {index + 1}.
              </Text>{' '}
              <Text
                as="span"
                fontWeight={player.slug === user.slug ? 'bold' : 'normal'}
              >
                {player.slug}
              </Text>
              :{' '}
              <Text
                as="span"
                color="accent"
                fontWeight={player.slug === user.slug ? 'bold' : 'normal'}
              >
                {player.score.toFixed(2)}
              </Text>
            </Text>
          )
        )}
    </>
  );
};

export { Stats };
