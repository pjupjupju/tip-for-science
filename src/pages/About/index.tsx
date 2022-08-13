import React from 'react';
import Helmet from 'react-helmet';
import { Box } from 'rebass';
import { slideList } from './slideList';
import { Tutorial } from './Tutorial';

const About = () => {
  return (
    <Box width="100%" height="100%">
      <Helmet title="Tutorial"></Helmet>
      <Tutorial slideList={slideList} />
    </Box>
  );
};

export { About };
