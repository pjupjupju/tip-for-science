import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Container } from '..';

interface NoMoreQuestionsProps {
  score: Number;
}

const NoMoreQuestions = ({ score }: NoMoreQuestionsProps) => {
  const navigate = useNavigate();
  const handleClickHome = () => {
    navigate('/');
  };
  const handleClickSettings = () => {
    navigate('/profile/settings');
  };

  return (
    <Container>
      <Box
        p={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
      >
        <Typography
          fontSize={24}
          fontWeight={500}
          textAlign="center"
          my={2}
          color="text.secondary"
        >
          <FormattedMessage
            id="app.game.lastquestion"
            defaultMessage="This was the last question (for now)."
            description="Last question"
          />
          <br />
          <FormattedMessage
            id="app.stats.menu.score"
            defaultMessage="Your score:"
            description="Score text"
          />{' '}
        </Typography>
        <Typography
          color="accent.main"
          component="span"
          fontSize={36}
          fontWeight={700}
        >
          {score.toString()}
        </Typography>

        <Typography
          fontWeight={500}
          textAlign="center"
          my={5}
          color="text.secondary"
        >
          <FormattedMessage
            id="app.game.morequestions"
            defaultMessage="When more questions become available, we'll let you know at your registration email."
            description="More questions"
          />
          <br />
          <FormattedMessage
            id="app.game.checkmail"
            defaultMessage="You can check or update it in the Settings."
            description="mail settings"
          />{' '}
        </Typography>
        <Box display="flex" justifyContent="space-between" width="100%" mt={6}>
          <Button
            onClick={handleClickHome}
            sx={{ flex: 2, mr: 1, backgroundColor: '#414141' }}
            variant="contained"
          >
            <FormattedMessage
              id="app.home"
              defaultMessage="Home"
              description="Home button"
            />
          </Button>
          <Button
            onClick={handleClickSettings}
            sx={{ flex: 2 }}
            color="primary"
            variant="contained"
          >
            <FormattedMessage
              id="app.stats.menu.settings"
              defaultMessage="Settings"
              description="Settings link"
            />
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export { NoMoreQuestions };
