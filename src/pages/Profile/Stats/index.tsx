import React from 'react';
import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';
import {
  HIGH_SCORE_QUERY,
  MY_SCORE_QUERY,
  MY_USER_STATS_QUERY,
} from '../../../gql';
import { UserScoreCurve } from '../../../components/UserScoreCurve';
import { Spinner } from '../../../components';
import { User } from '../../../types';

const headingFontSizes = {
  xs: 16,
  sm: 20,
  md: 24,
};
const chartWrapperStyles = { flexGrow: 1, maxHeight: 400, minHeight: 400 };

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
      <Stack
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
        p={4}
      >
        <Spinner />
      </Stack>
    );
  }

  const stats = data?.getUserStats?.days.map(
    (d: { day: string; score: number }) => ({
      x: d.day,
      y: d.score,
    })
  );

  const highScore = highScoreData?.getHighScore;
  const getMyScore = getMyScoreData?.getMyScore || 0;

  /// TODO (Your score)
  return (
    <Stack direction="column" gap={2} pt={2}>
      <Typography
        color="text.secondary"
        variant="h3"
        fontSize={headingFontSizes}
        mx={2}
      >
        <FormattedMessage
          id="app.stats.menu.score"
          defaultMessage="Your score:"
          description="Score text"
        />{' '}
        <Typography
          fontSize="inherit"
          fontWeight="inherit"
          fontFamily="inherit"
          component="span"
          color="accent"
        >
          {getMyScore}
        </Typography>
      </Typography>
      <Typography
        color="text.secondary"
        variant="h3"
        fontSize={headingFontSizes}
        mx={2}
      >
        <FormattedMessage
          id="app.stats.menu.progress"
          defaultMessage="Your progress:"
          description="Progress text"
        />
      </Typography>
      <Box sx={chartWrapperStyles}>
        {stats.length > 0 ? (
          <UserScoreCurve stats={stats} />
        ) : (
          <Stack
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Typography color="white" textAlign="center">
              <FormattedMessage
                id="app.stats.menu.zero"
                defaultMessage="Nothing to see here (yet). Soon, there will be a chart of your progress!"
                description="Zero score text"
              />
            </Typography>
          </Stack>
        )}
      </Box>
      <Typography
        color="text.secondary"
        variant="h3"
        fontSize={headingFontSizes}
        mx={2}
      >
        <FormattedMessage
          id="app.stats.menu.top"
          defaultMessage="Top scores:"
          description="Top score text"
        />
      </Typography>
      <Stack>
        {highScore &&
          highScore
            .slice(0, 5)
            .map((player: { score: number; slug: string }, index: number) => (
              <Typography key={`player-${player.slug}`} color="text.secondary">
                <Typography
                  fontWeight="bold"
                  component="span"
                  color="accent"
                  ml={5}
                >
                  {/* eslint-disable jsx-a11y/accessible-emoji */}
                  {index === 0 && (
                    <Typography
                      component="span"
                      ml="-24px"
                      aria-label="champion"
                      role="img"
                      position="absolute"
                    >
                      🏆
                    </Typography>
                  )}{' '}
                  {index + 1}.
                </Typography>{' '}
                <Typography
                  component="span"
                  color={
                    player.slug === user.slug ? 'primary' : 'text.secondary'
                  }
                  fontWeight={player.slug === user.slug ? 'bold' : 'normal'}
                >
                  {player.slug}
                </Typography>
                :{' '}
                <Typography
                  component="span"
                  color="accent"
                  fontWeight={player.slug === user.slug ? 'bold' : 'normal'}
                >
                  {player.score.toFixed(2)}
                </Typography>
              </Typography>
            ))}
        {highScore &&
          highScore.slice(0, 5).filter((player) => player.slug === user.slug)
            .length === 0 && (
            <Typography color="text.secondary">
              <Typography
                fontWeight="bold"
                component="span"
                color="accent"
                ml={5}
              >
                {/* eslint-disable jsx-a11y/accessible-emoji */}
                <Typography
                  component="span"
                  ml="-24px"
                  aria-label="champion"
                  role="img"
                  position="absolute"
                >
                  🎮
                </Typography>
              </Typography>{' '}
              <Typography component="span" color="primary" fontWeight="bold">
                {user.slug}
              </Typography>
              :{' '}
              <Typography component="span" color="accent" fontWeight="bold">
                {getMyScore.toFixed(2)}
              </Typography>
            </Typography>
          )}
      </Stack>
    </Stack>
  );
};

export { Stats };
