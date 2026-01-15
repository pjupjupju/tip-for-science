import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Container } from '../Container';
import { TranslucentBox } from '../TranslucentBox';
import { FormattedMessage } from 'react-intl';

const TooCloseDialog = ({
  onGuessed,
  onKnewIt,
}: {
  onGuessed: Function;
  onKnewIt: Function;
}) => {
  const handleClickGuessed = () => {
    onGuessed();
  };
  const handleClickKnewIt = () => {
    onKnewIt();
  };

  return (
    <TranslucentBox>
      <Container>
        <Box
          p={3}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
          zIndex={3}
        >
          <Typography
            variant="body1"
            fontWeight={500}
            textAlign="center"
            color="white"
            my={3}
          >
            <FormattedMessage
              id="app.game.tooclose"
              defaultMessage="Wow! That was REALLY close! Did you actually know the correct answer, or did you just make an amazing guess?"
              description="Too close"
            />
            <br />
            <FormattedMessage
              id="app.game.closedontworry"
              defaultMessage="Don't worry, this won't affect your score, but it helps us with data analysis. :)"
              description="Don't worry"
            />
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            mt={2}
          >
            <Button variant="contained" onClick={handleClickGuessed}>
              <FormattedMessage
                id="app.game.guessed"
                defaultMessage="I guessed"
                description="Guessed"
              />
            </Button>
            <Button variant="contained" onClick={handleClickKnewIt}>
              <FormattedMessage
                id="app.game.knew"
                defaultMessage="I knew"
                description="Knew"
              />
            </Button>
          </Box>
        </Box>
      </Container>
    </TranslucentBox>
  );
};

export { TooCloseDialog };
