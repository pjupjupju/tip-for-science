import React from 'react';
import { Box, Button, Flex, Image, Text } from 'rebass';
import wildchart from './../../assets/slide5_graf.jpg';
import { SlideProps } from './types';

const imageStyle = {
  height: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide7 = ({ handleNextStep }: SlideProps) => {
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
          Tady můžeš vidět celý graf toho, jak funguje distribuce bodů:
        </Text>
      </Box>
      <Image src={wildchart} sx={imageStyle} />
      <Button onClick={handleClickNext}>Další</Button>
    </Flex>
  );
};

export { Slide7 };
