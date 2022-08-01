import React from 'react';
import { useQuery } from '@apollo/client';
import { UserScoreCurve } from '../../components/UserScoreCurve';
import { Heading, Flex } from 'rebass';
import { MY_SCORE_QUERY, MY_USER_STATS_QUERY } from '../../gql';
import { BackButton, Container, Spinner } from '../../components';

const Profile = () => {
  const { loading, data } = useQuery(MY_USER_STATS_QUERY);
  const { loading: scoreLoading, data: getMyScoreData } = useQuery(
    MY_SCORE_QUERY
  );

  if (loading || scoreLoading) {
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

  return (
    <Container>
      <Flex flexDirection="column" height="100%">
        <Heading color="secondary" fontSize={[2, 3, 4]} my="4">
          Tvoje skóre: {getMyScoreData.getMyScore}
        </Heading>
        <Heading color="secondary" fontSize={[2, 3, 4]} mb="2">
          Vývoj tvého skóre:
        </Heading>
        <UserScoreCurve stats={stats} />
        <BackButton>domů</BackButton>
      </Flex>
    </Container>
  );
};

export { Profile };
