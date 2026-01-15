import { useQuery } from '@apollo/client';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { HomeButton, Spinner } from '..';
import { AUTH_QUERY } from '../../gql';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { FormattedMessage } from 'react-intl';
import { tutorialText } from './styles';
import logo from './../../assets/logoskoly.png';

const headerTextStyles = { ...tutorialText, p: 1 };
const mainTextStyles = {
  ...tutorialText,
  px: 3,
  py: 2,
  fontSize: { xs: 12, sm: 16, md: 20 },
};

const Slide15 = () => {
  const { loading, data } = useQuery(AUTH_QUERY, {
    fetchPolicy: 'cache-first',
  });

  const isLoggedIn = !!data?.viewer?.user;
  const isAdmin = data?.viewer?.user?.role === 'admin';

  const navigate = useNavigate();
  const handleClickPlay = () => {
    navigate('/play');
  };
  const handleClickSignUp = () => {
    navigate('/signup');
  };

  return (
    <Container>
      <TutorialHeader>
        <Typography sx={headerTextStyles}>
          <FormattedMessage
            id="app.tutorial.slide.ready"
            defaultMessage="That's it! You're now ready to play for real!"
            description="Tut15 ready"
          />
        </Typography>
      </TutorialHeader>

      <Box
        component="img"
        src={logo}
        alt="logo"
        sx={{
          minHeight: '210px',
          maxHeight: '350px',
          width: 'auto',
          alignSelf: 'center',
          px: { xs: 4, md: 6 },
          py: 3,
        }}
      />

      <Typography sx={mainTextStyles}>
        <FormattedMessage
          id="app.tutorial.slide.byeb"
          defaultMessage="Tip for Science was created by evolutionary biologists {lineBreak}
            from Charles University."
          description="Tut15 by EB"
          values={{ lineBreak: <br /> }}
        />
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        width="100%"
        mt="auto"
        justifyContent="center"
        alignItems="center"
      >
        <HomeButton />

        {loading && <Spinner />}

        {!loading && isLoggedIn && !isAdmin && (
          <Button
            onClick={handleClickPlay}
            variant="contained"
            sx={{ flex: 3 }}
          >
            <FormattedMessage
              id="app.tutorial.slide.play"
              defaultMessage="Play"
              description="Tut15 play"
            />
          </Button>
        )}

        {!loading && !isLoggedIn && (
          <Button
            onClick={handleClickSignUp}
            variant="contained"
            sx={{ flex: 3 }}
          >
            <FormattedMessage
              id="app.tutorial.slide.signin"
              defaultMessage="Sign in"
              description="Tut15 signin"
            />
          </Button>
        )}
      </Stack>
    </Container>
  );
};

export { Slide15 };
