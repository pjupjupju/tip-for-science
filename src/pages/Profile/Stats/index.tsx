import React, { ReactNode } from 'react';
import { useQuery } from '@apollo/client';
import { UserScoreCurve } from '../../../components/UserScoreCurve';
import { Heading, Flex, Text, Box, Link } from 'rebass';
import { Link as RouterLink } from 'react-router-dom';

import {
  HIGH_SCORE_QUERY,
  MY_SCORE_QUERY,
  MY_USER_STATS_QUERY,
} from '../../../gql';
import { BackButton, Container, Spinner } from '../../../components';

const NavbarLink = ({
  children,
  ...rest
}: {
  children: ReactNode;
  [key: string]: any;
}) => (
  <Link variant="nav" as={RouterLink} {...rest}>
    {children}
  </Link>
);

const Stats = () => {
  const { loading, data } = useQuery(MY_USER_STATS_QUERY);
  const { loading: highScoreLoading, data: highScoreData } = useQuery(
    HIGH_SCORE_QUERY
  );
  const { loading: scoreLoading, data: getMyScoreData } = useQuery(
    MY_SCORE_QUERY
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
    <Container>
      <Flex flexDirection="column" height="100%">
        <Flex px={2} color="white" bg="secondary" alignItems="center">
          <Text p={2} fontWeight="bold">
            Profil
          </Text>
          <Box mx="auto" />
          <NavbarLink to="/profile/stats" color="black">
            Stats
          </NavbarLink>
          <NavbarLink to="/profile/settings">Nastavení</NavbarLink>
          <NavbarLink to="/">Domů</NavbarLink>
        </Flex>
        <Heading color="secondary" fontSize={[2, 3, 4]} my="4" mx="3">
          Tvoje skóre: {getMyScoreData.getMyScore}
        </Heading>
        <Heading color="secondary" fontSize={[2, 3, 4]} mb="2" mx="3">
          Vývoj tvého skóre:
        </Heading>
        <Box sx={{ flexGrow: 1, maxHeight: 400 }}>
          <UserScoreCurve stats={stats} />
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
                {player.slug}:{' '}
                <Text as="span" color="accent">
                  {player.score.toFixed(2)}
                </Text>
              </Text>
            )
          )}
      </Flex>
    </Container>
  );
};

export { Stats };
