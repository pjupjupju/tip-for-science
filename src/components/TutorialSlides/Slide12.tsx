import React from 'react';
import { Button, Text, Box } from 'rebass';
import { Container } from '../Container';
import { SlideProps } from './types';

const Slide12 = ({ handleNextStep }: SlideProps) => {
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Container>
      <Box p="4" my="auto">
        <Text
          fontSize={[3, 4, 5]}
          color="secondary"
          textAlign="center"
          mb="4"
          mt="4"
        >
          Tato hra je jeden velký experiment v rámci kulturní evoluce. Zajímá
          nás, jak tento druh extrémně spolupracujících opic nalezne optimální
          strategii, když bude mít k dispozici pouze skupinovou inteligenci.
        </Text>
      </Box>
      <Button mt="auto" onClick={handleClickNext}>
        Další
      </Button>
    </Container>
  );
};

export { Slide12 };
