import React from 'react';
import { Box, Button, Flex, Image, Text } from 'rebass';
import elephant from './../../assets/slide1_elephant.jpg';
import chart from './../../assets/slide5_graf.jpg';
import { SlideProps } from './types';

const imageStyle = {
  height: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide14 = ({ handleNextStep }: SlideProps) => {
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Flex flexDirection="column">
      <Box height="80px">
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={3}
        >
          flibžion za sekundu? to je úplně přesně!
        </Text>
      </Box>
      <Image src={elephant} sx={imageStyle} />

      <Image src={chart} sx={imageStyle} />
      <Button onClick={handleClickNext}>Další</Button>
    </Flex>
  );
};

export { Slide14 };
