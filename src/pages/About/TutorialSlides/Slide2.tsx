import React from 'react';
import { Flex, Image } from 'rebass';
import washington from './../../../assets/slide1_washington.jpg';

const Slide2 = () => {
  return (
    <Flex flexDirection="column">
      <Image
        src={washington}
        sx={{
          width: ['100%', '50%'],
          borderRadius: 8,
        }}
      />
    </Flex>
  );
};

export { Slide2 };