import React from 'react';
import { Container } from '../Container';
import { SlideProps } from './types';
import { NextButton } from './NextButton';
import { HomeButton } from './HomeButton';
import { FormattedMessage } from 'react-intl';
import { tutorialText } from './styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Slide7 = ({ handleNextStep }: SlideProps) => {
  return (
    <Container>
      <Box p="4" my="auto">
        <Typography sx={tutorialText} mb={4}>
          {' '}
          <FormattedMessage
            id="app.tutorial.slide.evolution"
            defaultMessage="This game is a model of evolution."
            description="Tut7 evolution"
          />
        </Typography>
        <Typography sx={tutorialText} mb={4}>
          {' '}
          <FormattedMessage
            id="app.tutorial.slide.population"
            defaultMessage="Your tips and other players' tips make up the population. Within them, individual tips fight for survival, look for partners, and reproduce."
            description="Tut7 population"
          />
        </Typography>
        <Typography sx={tutorialText} mb={4}>
          {' '}
          <FormattedMessage
            id="app.tutorial.slide.survive"
            defaultMessage="The ones that survive can be shown to you as a previous tip."
            description="Tut7 survive"
          />
        </Typography>
        <Typography sx={tutorialText} mb={4}>
          {' '}
          <FormattedMessage
            id="app.tutorial.slide.shown"
            defaultMessage="And your tip can be seen by someone else."
            description="Tut7 shown"
          />
        </Typography>
        <Typography sx={tutorialText} mb={4}>
          {' '}
          <FormattedMessage
            id="app.tutorial.slide.notshown"
            defaultMessage="...and sometimes you won't see any tip."
            description="Tut7 notshown"
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

export { Slide7 };
