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
      <Box p="4">
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" mb="4">
          Tato hra je modelem evoluce.
        </Text>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" mb="4">
          Tvé tipy a tipy ostatních hráčů tvoří populace. V rámci nich
          jednotlivé tipy bojují o přežití, hledají partnery, množí se.
        </Text>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" mb="4">
          Ty, které přežijí, se mohou jako "předchozí tip" zobrazit právě tobě.
        </Text>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center">
          A tvůj tip, pokud přežije, může vidět někdo další.
        </Text>
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
