import React from 'react';
import { Button, Box, Text } from 'rebass';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { SlideProps } from './types';
import { ScoreChart } from '../ScoreChart';

const Slide5 = ({ handleNextStep, currentTip }: SlideProps) => {
  const correctAnswer = 11000;
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Container>
      <TutorialHeader>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={3}
        >
          {currentTip} kg? těsně vedle!
        </Text>
      </TutorialHeader>
      <Box width="100%" height="200px">
        {typeof currentTip !== 'undefined' && (
          <ScoreChart currentTip={currentTip} correctAnswer={correctAnswer} />
        )}
      </Box>
      <Text
        fontSize={[3, 4, 5]}
        fontWeight="bold"
        color="secondary"
        textAlign="center"
        py={4}
        px={3}
      >
        Na tomto skvělém přehledném grafu je tvá odpověď, uvedené nápovědy a
        správná odpověď.
      </Text>
      <Button
        mt="auto"
        sx={{ position: ['initial', 'initial', 'relative'], top: '-30px' }}
        onClick={handleClickNext}
      >
        Další
      </Button>
    </Container>
  );
};

export { Slide5 };
