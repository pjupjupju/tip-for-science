import React from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Button, Flex } from 'rebass';
import { UserScoreCurve } from '../../components/UserScoreCurve';
import { Button, Heading, Flex, Text } from 'rebass';
import { MY_USER_STATS_QUERY } from '../../gql';
import { Spinner } from '../../components';

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

  return (
    <Flex flexDirection="column" height="100%">
        <Heading color="lightgray">Stats</Heading>
        <Text color="white">{JSON.stringify(
            data.getUserStats.days.map((d: { day: string; score: number }) => ({
                x: d.day,
                y: d.score,
            }))
        )}
        </Text>
      <UserScoreCurve />
      <Flex mt="auto">
        <Button onClick={handleClickBack}>zpět</Button>
      </Flex>
    </Flex>
  );
};

export { Stats };
