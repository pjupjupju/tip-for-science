import React from 'react';
import { Button, Text, Box } from 'rebass';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { SlideProps } from './types';
import { ScoreChart } from '../ScoreChart';

const Slide7 = ({ handleNextStep }: SlideProps) => {
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
          Tady můžeš vidět celý graf toho, jak funguje distribuce bodů:
        </Text>
      </TutorialHeader>
      <Box width="100%" height="200px">
        <ScoreChart currentTip={50} correctAnswer={100} />
      </Box>
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

export { Slide7 };
