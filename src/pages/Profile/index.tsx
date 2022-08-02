import React from 'react';
import { useQuery } from '@apollo/client';
import { UserScoreCurve } from '../../components/UserScoreCurve';
import { Heading, Flex, Text, Box } from 'rebass';
import {
  HIGH_SCORE_QUERY,
  MY_SCORE_QUERY,
  MY_USER_STATS_QUERY,
} from '../../gql';
import { BackButton, Container, Spinner } from '../../components';

const Profile = () => {
  const { loading, data } = useQuery(MY_USER_STATS_QUERY);
  const { loading: highScoreLoading, data: highScoreData } =
    useQuery(HIGH_SCORE_QUERY);
  const { loading: scoreLoading, data: getMyScoreData } =
    useQuery(MY_SCORE_QUERY);

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
    <Container>
      <Flex flexDirection="column" height="100%">
        <Heading color="secondary" fontSize={[2, 3, 4]} my="4">
          Tvoje skóre: {getMyScoreData.getMyScore}
        </Heading>
        <Heading color="secondary" fontSize={[2, 3, 4]} mb="2">
          Vývoj tvého skóre:
        </Heading>
        <Box sx={{ flexGrow: 1, maxHeight: 400 }}>
          <UserScoreCurve stats={stats} />
        </Box>
        <Heading color="secondary" fontSize={[2, 3, 4]} mb="2">
          Top skóre:
        </Heading>
        {highScore &&
          highScore.map((player, index) => (
            <Text color="secondary">
              <Text fontWeight="bold" as="span" color="accent">
                {index + 1}.
              </Text>{' '}
              {player.slug}:{' '}
              <Text as="span" color="accent">
                {player.score.toFixed(2)}
              </Text>
            </Text>
          ))}
        <BackButton>domů</BackButton>
      </Flex>
    </Container>
  );
};

export { Profile };
