import React from 'react';
import { Box, Flex, Image, Text } from 'rebass';
import wildchart from './../../assets/slide5_graf.jpg';
import { SlideProps } from './types';

const imageStyle = {
  height: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide5 = (props: SlideProps) => {
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
          bžilion kg? těsně vedle!
        </Text>
      </Box>
      <Image src={wildchart} sx={imageStyle} />
      <Text
        fontSize={[3, 4, 5]}
        fontWeight="bold"
        color="secondary"
        textAlign="center"
        py={4}
        px={3}
      >
        Na tomto skvělém přehledném grafu je tvá odpověď, uvedené nápovědy a
        správná odpověď.
      </Text>
    </Flex>
  );
};

export { Slide5 };
