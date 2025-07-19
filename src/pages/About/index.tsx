import React from 'react';
import Helmet from 'react-helmet';
import Box from '@mui/material/Box';
import { slideList } from './slideList';
import { Tutorial } from './Tutorial';

const About = () => {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Helmet title="Tutorial" />
      <Tutorial slideList={slideList} />
    </Box>
  );
};

export { About };
