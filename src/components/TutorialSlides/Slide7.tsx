import React from 'react';
import { Text, Box, Flex } from 'rebass';
import { Container } from '../Container';
import { SlideProps } from './types';
import { NextButton } from './NextButton';
import { HomeButton } from './HomeButton';

const Slide7 = ({ handleNextStep }: SlideProps) => {
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
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center">
          ...a občas žádný tip neuvidíš.
        </Text>
      </Box>
      <Flex mt="auto" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Flex>
    </Container>
  );
};

export { Slide7 };
