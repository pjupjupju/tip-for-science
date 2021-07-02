import React from 'react';
import { Box, Flex, Image, Text } from 'rebass';
import elephant from './../../assets/slide1_elephant.jpg';
import chart from './../../assets/slide5_graf.jpg';
import { SlideProps } from './types';

const imageStyle = {
  height: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide10 = (props: SlideProps) => {
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
          děvať? těsně vedle.
        </Text>
      </Box>
      <Image src={elephant} sx={imageStyle} />
      <Image src={chart} sx={imageStyle} />
    </Flex>
  );
};

export { Slide10 };
