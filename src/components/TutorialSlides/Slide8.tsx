import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container } from '../Container';
import { SlideProps } from './types';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';
import { FormattedMessage } from 'react-intl';
import { tutorialText } from './styles';

const Slide8 = ({ handleNextStep }: SlideProps) => {
  return (
    <Container>
      <Box p="4" my="auto">
        <Typography sx={tutorialText} mb={4}>
          <FormattedMessage
            id="app.tutorial.slide.indispensable"
            defaultMessage="In this game, you are the indispensable driving force of inheritance!"
            description="Tut8 indispensable"
          />
        </Typography>
      </Box>
      <Box mt="auto" display="flex" justifyContent="space-between" width="100%">
        {' '}
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Box>
    </Container>
  );
};

export { Slide8 };
