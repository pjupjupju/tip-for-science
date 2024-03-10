import React from 'react';
import { Text, Box, Flex } from 'rebass';
import { Container } from '../Container';
import { SlideProps } from './types';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';

const Slide12 = ({ handleNextStep }: SlideProps) => {
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
      <Flex mt="auto" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Flex>
    </Container>
  );
};

export { Slide12 };
