import React from 'react';
import { Box, Text, Flex } from 'rebass';
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
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" p={3}>
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
        </Text>
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
      <Text
        fontSize={[3, 4, 4]}
        color="secondary"
        textAlign="center"
        py={4}
        px={3}
      >
        <FormattedMessage
          id="app.tutorial.slide.chart"
          defaultMessage="In this chart you can see "
          description="Tut5 chart"
        />{' '}
        <Text color="accent" as="span">
          <FormattedMessage
            id="app.tutorial.slide.answer"
            defaultMessage="your answer"
            description="Tut5 answer"
          />
        </Text>
        ,{' '}
        <Text color="primary" as="span">
          <FormattedMessage
            id="app.tutorial.slide.prevtips"
            defaultMessage="previous tips"
            description="Tut5 prevtips"
          />
        </Text>{' '}
        <FormattedMessage
          id="app.tutorial.slide.and"
          defaultMessage="and"
          description="Tut5 and"
        />
        {' '}
        <Text color="white" as="span">
          <FormattedMessage
            id="app.tutorial.slide.correct"
            defaultMessage="the correct answer."
            description="Tut5 correct answer"
          />
        </Text>
      </Text>
      <Flex mt="auto" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Flex>
    </Container>
  );
};

export { Slide5 };
