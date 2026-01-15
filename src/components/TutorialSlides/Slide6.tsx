import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getScore } from '../../helpers';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { SlideProps } from './types';
import { ScoreChart } from '../ScoreChart';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';
import { FormattedMessage } from 'react-intl';

const Slide6 = ({ handleNextStep, currentTip }: SlideProps) => {
  const correctAnswer = 11000;
  return (
    <Container>
      <TutorialHeader>
        <Typography
          fontSize={{
            xs: 24,
            sm: 28,
            md: 32,
          }}
          color="text.secondary"
          textAlign="center"
          p={3}
        >
          {' '}
          <FormattedMessage
            id="app.tutorial.slide.youdget"
            defaultMessage="For your answer you would get"
            description="Tut6 you'd get"
          />{' '}
          <Typography
            component="span"
            sx={{ color: 'accent.main' }}
            fontSize={{
              xs: 24,
              sm: 28,
              md: 32,
            }}
          >
            {typeof currentTip !== 'undefined'
              ? getScore(currentTip, 11000).toFixed(2)
              : 0}
          </Typography>{' '}
          <FormattedMessage
            id="app.tutorial.slide.points"
            defaultMessage="points."
            description="Tut6 points"
          />
        </Typography>
      </TutorialHeader>
      <Box width="100%" height="200px">
        {typeof currentTip !== 'undefined' && (
          <ScoreChart currentTip={currentTip} correctAnswer={correctAnswer} />
        )}
      </Box>
      <Typography
        fontSize={{
          xs: 16,
          sm: 20,
          md: 24,
        }}
        color="text.secondary"
        textAlign="center"
        py={4}
        px={3}
      >
        <FormattedMessage
          id="app.tutorial.slide.whenpoints"
          defaultMessage="You get points if you hit between 50 - 200% of the value of the correct answer."
          description="Tut6 whenpoints"
        />
      </Typography>
      <Box mt="auto" display="flex" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Box>
    </Container>
  );
};

export { Slide6 };
