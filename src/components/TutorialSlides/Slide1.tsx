import React from 'react';
import { Box, Button, Flex, Image, Text } from 'rebass';
import washington from './../../assets/slide1_washington.jpg';
import elephant from './../../assets/slide1_elephant.jpg';
import moon from './../../assets/slide1_moon.jpg';
import { SlideProps } from './types';
import { Container } from '../Container';

const Slide1 = ({ handleNextStep }: SlideProps) => {
  // obsah () se pak muze smazat, je to tu pro hloupe lidi
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Container>
      <Flex height="calc(20vh)" width="100%" justifyContent="center">
        <Image
          src={elephant}
          sx={{
            width: 'calc(20vh)',
          }}
        />
        <Image
          src={washington}
          sx={{
            width: 'calc(20vh)',
          }}
        />
        <Image
          src={moon}
          sx={{
            width: 'calc(20vh)',
          }}
        />
      </Flex>
      <Box p="4">
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
          mb="4"
        >
          Zajímalo by vás, kolik vážil nejtěžší slon v historii?
        </Text>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
          mb="4"
        >
          Jak velká je hlava George Washingtona v sousoší Mount Rushmore?
        </Text>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
        >
          Jak rychle se pohybuje Jupiter?
        </Text>
        <Button onClick={handleClickNext}>Další</Button>
      </Box>
    </Container>
  );
};

export { Slide1 };
