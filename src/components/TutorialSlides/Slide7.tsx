import React from 'react';
import { Button, Text, Box } from 'rebass';
import { Container } from '../Container';
import { SlideProps } from './types';

const Slide7 = ({ handleNextStep }: SlideProps) => {
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Container>
      <Box p="4" my="auto">
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" mb="4">
          Tato hra je modelem evoluce.
        </Text>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" mb="4">
          Tvé tipy a tipy ostatních hráčů tvoří populace. V rámci nich
          jednotlivé tipy bojují o přežití, hledají partnery, množí se.
        </Text>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" mb="4">
          Ty, které přežijí, se mohou jako "předchozí tip" zobrazit právě tobě.
        </Text>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center">
          A tvůj tip může vidět někdo další.
        </Text>
      </Box>
      <Button mt="auto" onClick={handleClickNext}>
        Další
      </Button>
    </Container>
  );
};

export { Slide7 };
