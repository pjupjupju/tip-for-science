import React from 'react';
import { Box } from 'rebass';
import { slideList } from './slideList';
import { Tutorial } from './Tutorial';

const About = () => {
  return (
    <Box width="100%" height="100%">
      <Tutorial slideList={slideList} />
    </Box>
  );
};

export { About };