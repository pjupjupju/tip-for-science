import React from 'react';
import { Box, Button, Flex, Text } from 'rebass';
import { SlideProps } from './types';

const Slide12 = ({ handleNextStep }: SlideProps) => {
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Flex flexDirection="column">
      <Box p="4">
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
          mb="4"
        >
          Tato hra je jeden velký experiment v rámci kulturní evoluce. Zajímá
          nás, jak tento druh extrémně spolupracujících opic nalezne optimální
          strategii, když bude mít k dispozici pouze skupinovou inteligenci.
        </Text>
      </Box>
      <Button onClick={handleClickNext}>Další</Button>
    </Flex>
  );
};

export { Slide12 };
