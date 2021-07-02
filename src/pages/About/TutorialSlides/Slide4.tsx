import React from 'react';
import { Game } from '../../../components';
import { Box, Flex, Image, Text } from 'rebass';
import slune from '../../../assets/slide2_elephant.jpg';

const imageStyle = {
  height: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide4 = () => {
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
          CURRENT TIP kg? *těsně vedle!*
        </Text>
      </Box>
      <Image src={slune} sx={imageStyle} />
      <Text
        fontSize={[3, 4, 5]}
        fontWeight="bold"
        color="secondary"
        textAlign="center"
        py={4}
        px={3}
      >
        Největší samec slona, jehož váhu se podařilo zaznamenat, vážil zhruba 11
        000 kg a v kohoutku měřil 3,96 metru. Byl tedy téměř o metr vyšší než
        průměrný slon africký.
      </Text>
    </Flex>
  );
};

export { Slide4 };
