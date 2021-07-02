import React from 'react';
import { Box, Flex, Image, Text } from 'rebass';
import logo from './../../assets/logoskoly.png';
import { SlideProps } from './types';

const imageStyle = {
  height: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide15 = (props: SlideProps) => {
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
          To je vše, nyní jsi připraven na hru naostro!
        </Text>
      </Box>
      <Image src={logo} sx={imageStyle} />
      <Text
        fontSize={[3, 4, 5]}
        fontWeight="bold"
        color="secondary"
        textAlign="center"
        p={3}
      >
        Tip for Science bylo vytvořeno evolučními biology z Univerzity Karlovy.
      </Text>
    </Flex>
  );
};

export { Slide15 };
