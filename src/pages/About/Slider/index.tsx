import React, { useState } from 'react';
import { Box, Button, Flex } from 'rebass';

import { Slide1, Slide2, Slide3 } from '../TutorialSlides';


const slideList = [<Slide1 />, <Slide2 />, <Slide3 />];

const Slider = () => {
  const [value, setValue] = useState(0);
  const handleClickNext = () => {
    setValue(value + 1 === slideList.length ? 0 : value + 1);
  };
  const handleClickPrev = () => {
    setValue(value === 0 ? slideList.length - 1 : value - 1);
  };

  return (
    <Flex
      flexDirection="column"
      justifyContent="flex-end"
      height="100%"
      width="100%"
    >
      <Box
        sx={{
          flexGrow: 1,
          flexShrink: 0,
        }}
      >
        {slideList[value]}
      </Box>
      <Button
        onClick={handleClickNext}
        sx={{
          flexGrow: 0,
          flexShrink: 0,
        }}
      >
        next ({(value + 1 === slideList.length ? 0 : value + 1) + 1}/
        {slideList.length})
      </Button>

      <Button
        onClick={handleClickPrev}
        sx={{
          flexGrow: 0,
          flexShrink: 0,
        }}
      >
        previous ({(value === 0 ? slideList.length - 1 : value - 1) + 1}/
        {slideList.length})
      </Button>
    </Flex>
  );
};

export { Slider };
