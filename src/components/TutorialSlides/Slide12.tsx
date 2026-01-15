import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container } from '../Container';
import { SlideProps } from './types';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';
import { FormattedMessage } from 'react-intl';
import { tutorialText } from './styles';

const Slide12 = ({ handleNextStep }: SlideProps) => {
  return (
    <Container>
      <Box p="4" my="auto">
        <Typography sx={tutorialText} mb={4} mt={4}>
          <FormattedMessage
            id="app.tutorial.slide.apes"
            defaultMessage="This game is one big experiment in cultural evolution. We are interested in how extremely cooperative apes find the best strategy
using only group intelligence."
            description="Tut12 apes"
          />
        </Typography>
      </Box>
      <Box mt="auto" display="flex" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Box>
    </Container>
  );
};

export { Slide12 };
