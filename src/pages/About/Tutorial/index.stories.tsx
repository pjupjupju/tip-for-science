import React from 'react';
import Box from '@mui/material/Button';
import Button from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Tutorial } from './';
import { Stepper } from '../../../components/Stepper';

const StorySlide1 = ({ step, handleNextStep, length }: any) => (
  <Box>
    <Typography color="secondary">
      this is slide number {step + 1} of {length}
    </Typography>
    <Button onClick={handleNextStep}>Next</Button>
  </Box>
);
const StorySlide2 = ({ step, handleNextStep, length }: any) => (
  <Box>
    <Typography color="secondary">
      this is slide number {step + 1} of {length}
    </Typography>
    <Button onClick={handleNextStep}>Next</Button>
  </Box>
);
const list = [
  { stepper: Stepper, content: StorySlide1 },
  { content: StorySlide2 },
];

export default { title: 'component/Tutorial', component: Tutorial };
export const Default = () => <Tutorial slideList={list} />;

Default.storyName = 'Tutorial with 2 steps';
