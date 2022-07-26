import React from 'react';
import { Box, Button, Text } from 'rebass';
import { Container } from '../Container';
import { SlideProps } from './types';

const Slide8 = ({ handleNextStep }: SlideProps) => {
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Container>
      <Box p="4" my="auto">
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" mb="4">
          V této hře jsi nepostradatelnou hybnou silou dědičnosti!
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

export { Slide8 };
