import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NumberFormat from 'react-number-format';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { SlideProps } from './types';
import { ScoreChart } from '../ScoreChart';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';
import { FormattedMessage } from 'react-intl';

const Slide5 = ({ handleNextStep, currentTip }: SlideProps) => {
  const correctAnswer = 11000;
  const previousTips = [8300, 9500, 15000];
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
            id="app.tipeval"
            defaultMessage="Your tip: "
            description="Tipeval"
          />{' '}
          <NumberFormat
            value={currentTip}
            displayType={'text'}
            thousandSeparator={' '}
          />{' '}
          <FormattedMessage
            id="app.kgunit"
            defaultMessage="kg"
            description="kgunit"
          />
        </Typography>
      </TutorialHeader>
      <Box width="100%" height="200px">
        {typeof currentTip !== 'undefined' && (
          <ScoreChart
            currentTip={currentTip}
            correctAnswer={correctAnswer}
            previousTips={previousTips}
          />
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
          id="app.tutorial.slide.chart"
          defaultMessage="In this chart you can see "
          description="Tut5 chart"
        />{' '}
        <Typography
          component="span"
          color="accent.main"
          fontSize={{
            xs: 16,
            sm: 20,
            md: 24,
          }}
        >
          <FormattedMessage
            id="app.tutorial.slide.answer"
            defaultMessage="your answer"
            description="Tut5 answer"
          />
        </Typography>
        ,{' '}
        <Typography
          component="span"
          color="primary.main"
          fontSize={{
            xs: 16,
            sm: 20,
            md: 24,
          }}
        >
          <FormattedMessage
            id="app.tutorial.slide.prevtips"
            defaultMessage="previous tips"
            description="Tut5 prevtips"
          />
        </Typography>{' '}
        <FormattedMessage
          id="app.tutorial.slide.and"
          defaultMessage="and"
          description="Tut5 and"
        />
        {' '}
        <Typography
          component="span"
          sx={{ color: 'white' }}
          fontSize={{
            xs: 16,
            sm: 20,
            md: 24,
          }}
        >
          <FormattedMessage
            id="app.tutorial.slide.correct"
            defaultMessage="the correct answer."
            description="Tut5 correct answer"
          />
        </Typography>
      </Typography>
      <Box mt="auto" display="flex" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Box>
    </Container>
  );
};

export { Slide5 };
