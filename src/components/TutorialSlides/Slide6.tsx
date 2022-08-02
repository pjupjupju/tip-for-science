import React from 'react';
import { Button, Text, Box } from 'rebass';
import { getScore } from '../../helpers';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { SlideProps } from './types';
import { ScoreChart } from '../ScoreChart';

const Slide6 = ({ handleNextStep, currentTip }: SlideProps) => {
  const correctAnswer = 11000;
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Container>
      <TutorialHeader>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" p={3}>
          Za svou odpověď bys dostal*a{' '}
          <Text color="accent" as="span">
            {' '}
            {typeof currentTip !== 'undefined'
              ? getScore(currentTip, 11000).toFixed(2)
              : 0}{' '}
          </Text>
          bodu.
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
        Body získáš, pokud se trefíš mezi 50 - 200 % hodnoty správné odpovědi.
      </Text>
      <Button mt="auto" onClick={handleClickNext}>
        Další
      </Button>
    </Container>
  );
};

export { Slide6 };
