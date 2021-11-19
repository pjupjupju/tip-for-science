import React from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { UserScoreCurve } from '../../components/UserScoreCurve';
import { Button, Heading, Flex } from 'rebass';
import { MY_USER_STATS_QUERY } from '../../gql';
import { BackButton, Container, Spinner } from '../../components';

const Stats = () => {
  const history = useHistory();

  const { loading, data } = useQuery(MY_USER_STATS_QUERY);

  const handleClickBack = () => {
    history.push('/');
  };

  if (loading) {
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
        <Heading color="lightgray" my="3">Stats</Heading>
        <Heading color="secondary" fontSize={[2, 3, 4]} mb="2">
          Your progress
        </Heading>
        <UserScoreCurve stats={stats} />
        <BackButton>domů</BackButton>
      </Flex>
    </Container>
  );
};

export { Stats };
