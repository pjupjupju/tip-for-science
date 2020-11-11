import React from 'react';
import { Box, Flex, Image, Text } from 'rebass';
import washington from './../../../assets/slide1_washington.jpg';
import elephant from './../../../assets/slide1_elephant.jpg';
import moon from './../../../assets/slide1_moon.jpg';

const Slide1 = () => {
  return (
    <Flex flexDirection="column">
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
          Would you like to know how heavy was the largest elephant that ever
          lived?
        </Text>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
          mb="4"
        >
          How big is the Mount Rushmore's head of George Washington from chin to
          crown?
        </Text>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
        >
          How fast does the planet Jupiter rush though space?
        </Text>
      </Box>
    </Flex>
  );
};

export { Slide1 };
