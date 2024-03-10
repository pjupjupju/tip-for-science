import React from 'react';
import { Box, Text, Flex } from 'rebass';
import NumberFormat from 'react-number-format';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { SlideProps } from './types';
import { ScoreChart } from '../ScoreChart';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';

const Slide5 = ({ handleNextStep, currentTip }: SlideProps) => {
  const correctAnswer = 11000;
  const previousTips = [8300, 9500, 15000];
  return (
    <Container>
      <TutorialHeader>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" p={3}>
          Tvůj tip:{' '}
          <NumberFormat
            value={currentTip}
            displayType={'text'}
            thousandSeparator={' '}
          />{' '}
          kg
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
        Na tomto grafu můžeš vidět{' '}
        <Text color="accent" as="span">
          svou odpověď
        </Text>
        ,{' '}
        <Text color="primary" as="span">
          uvedené nápovědy
        </Text>{' '}
        a 
        <Text color="white" as="span">
          správnou odpověď.
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
