import React from 'react';
import { Button, Text } from 'rebass';
import { Container } from '../Container';
import { SlideProps } from './types';

const Slide11 = ({ handleNextStep }: SlideProps) => {
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Container>
      <Text
        fontSize={[3, 4, 5]}
        color="secondary"
        textAlign="center"
        mb="4"
        mt="4"
      >
        Vypilovali jsme sociální přenos téměř k dokonalosti.
      </Text>
      <Text
        fontSize={[3, 4, 5]}
        color="secondary"
        textAlign="center"
        mb="4"
      >
        Učíme se jeden od druhého, tvoříme, píšeme básně, inspirovaní tvůrci a
        básníky minulosti.
      </Text>
      <Text
        fontSize={[3, 4, 5]}
        color="secondary"
        textAlign="center"
        mb="4"
      >
        Využíváme výhod tzv. kulturní dědičnosti.
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

export { Slide11 };
