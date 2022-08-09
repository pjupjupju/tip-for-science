import React from 'react';
import { Button, Text, Box, Flex } from 'rebass';
import { Container } from '../Container';
import { SlideProps } from './types';
import { useHistory } from 'react-router';

const Slide7 = ({ handleNextStep }: SlideProps) => {
  const history = useHistory();
  const handleClickHome = () => {
    history.push('/');
  };
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
      <Flex mt="auto" justifyContent="space-between" width="100%">
        <Button
          onClick={handleClickHome}
          backgroundColor={'#414141'}
          sx={{ flex: 1 }}
          mr="1"
        >
          Domů
        </Button>
        <Button onClick={handleClickNext} sx={{ flex: 5 }}>
          Další
        </Button>
      </Flex>
    </Container>
  );
};

export { Slide7 };
