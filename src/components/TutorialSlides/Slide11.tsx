import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container } from '../Container';
import { SlideProps } from './types';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';
import { FormattedMessage } from 'react-intl';

const Slide11 = ({ handleNextStep }: SlideProps) => {
  return (
    <Container>
      <Box p="4" my="auto">
        <Typography
          fontSize={{
            xs: 24,
            sm: 28,
            md: 32,
          }}
          color="text.secondary"
          textAlign="center"
          mb={4}
          mt={4}
        >
          <FormattedMessage
            id="app.tutorial.slide.perfected"
            defaultMessage="We have almost perfected social transmission."
            description="Tut11 perfected"
          />
        </Typography>
        <Typography
          fontSize={{
            xs: 24,
            sm: 28,
            md: 32,
          }}
          color="text.secondary"
          textAlign="center"
          mb={4}
        >
          <FormattedMessage
            id="app.tutorial.slide.poets"
            defaultMessage="We learn from each other - we create, build, paint, write poems - inspired by painters, inventors, scientists and poets of the past."
            description="Tut11 poets"
          />
        </Typography>
        <Typography
          fontSize={{
            xs: 24,
            sm: 28,
            md: 32,
          }}
          color="text.secondary"
          textAlign="center"
          mb={4}
        >
          {' '}
          <FormattedMessage
            id="app.tutorial.slide.inheritance"
            defaultMessage="We take advantage of the cultural inheritance."
            description="Tut11 inheritance"
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

export { Slide11 };
