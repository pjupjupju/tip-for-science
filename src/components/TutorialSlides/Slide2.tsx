import React from 'react';
import { Box, Flex, Image, Text } from 'rebass';
import elephant from './../../assets/slide1_elephant.jpg';
import { SlideProps } from './types';

const imageStyle = {
  height: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide2 = (props: SlideProps) => {
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
          Nebojte, správné odpovědi se brzy dozvíte! Nejdřív ale zkuste hádat...
        </Text>
      </Box>
      <Image src={elephant} sx={imageStyle} />
      <Text
        fontSize={[3, 4, 5]}
        fontWeight="bold"
        color="secondary"
        textAlign="center"
        py={4}
        px={3}
      >
        Největší známý slon byl zastřelen v roce 1956 v Angole. Předchozí hráči
        Tip for Science hádali, že toto obrovské zvíře vážilo{' '}
        <Text color="primary" as="span">
          8 300
        </Text>
        ,{' '}
        <Text color="primary" as="span">
          9500
        </Text>
        , nebo
        <Text color="primary" as="span">
          15 000{' '}
        </Text>
        kg.
      </Text>
    </Flex>
  );
};

export { Slide2 };
