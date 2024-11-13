import React from 'react';
import { Text, Box, Flex } from 'rebass';
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
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" p={3}>
          <FormattedMessage
            id="app.tutorial.slide.youdget"
            defaultMessage="For your answer you would get "
            description="Tut6 you'd get"
          />
          <Text color="accent" as="span">
            {' '}
            {typeof currentTip !== 'undefined'
              ? getScore(currentTip, 11000).toFixed(2)
              : 0}{' '}
          </Text>
          <FormattedMessage
            id="app.tutorial.slide.points"
            defaultMessage="points."
            description="Tut6 points"
          />
        </Text>
      </TutorialHeader>
      <Box width="100%" height="200px">
        {typeof currentTip !== 'undefined' && (
          <ScoreChart currentTip={currentTip} correctAnswer={correctAnswer} />
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
          id="app.tutorial.slide.whenpoints"
          defaultMessage="You get points if you hit between 50 - 200% of the value of the correct answer."
          description="Tut6 whenpoints"
        />
      </Text>
      <Flex mt="auto" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Flex>
    </Container>
  );
};

export { Slide6 };
