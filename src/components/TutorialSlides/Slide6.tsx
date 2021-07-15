import React from 'react';
import { Box, Button, Flex, Image, Text } from 'rebass';
import wildchart from './../../assets/slide5_graf.jpg';
import { SlideProps } from './types';

const imageStyle = {
  height: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide6 = ({ handleNextStep }: SlideProps) => {
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
          Za svou odpověď bys dostal/a 0,69 bodu.
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
        Body získáš, pokud se trefíš mezi 50 - 200 % hodnoty správné odpovědi.
      </Text>
      <Button onClick={handleClickNext}>Další</Button>
    </Flex>
  );
};

export { Slide6 };
