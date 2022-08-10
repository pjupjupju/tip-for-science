import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Text, Flex } from 'rebass';
import { Container } from '../Container';
import { SlideProps } from './types';

const Slide8 = ({ handleNextStep }: SlideProps) => {
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
          V této hře jsi nepostradatelnou hybnou silou dědičnosti!
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

export { Slide8 };
