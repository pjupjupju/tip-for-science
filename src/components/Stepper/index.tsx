import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { CommonTutorialProps } from '../TutorialSlide';

const dotStyles = {
  padding: 0,
  width: '14px',
  height: '14px',
  backgroundColor: 'white',
  border: 'none',
  borderRadius: '50%',
  margin: '0 3px',
  display: 'inline-block',
};

const activeDotStyles = {
  ...dotStyles,
  transform: 'scale(1.2)',
  transformOrigin: 'center',
  backgroundColor: 'dimmed.main',
};

const Dot = ({ isActive }: { isActive: boolean }) => (
  <Box component="li" sx={isActive ? activeDotStyles : dotStyles} />
);

export const Stepper = ({
  step = 0,
  length,
}: Pick<CommonTutorialProps, 'step' | 'length'>) => {
  const items = new Array(length).fill(0);
  return (
    <Stack direction="row" spacing={1} justifyContent="center" my={1} p={0.5}>
      {items.map((_, index) => (
        <Dot key={`dot-index-${index}`} isActive={step === index} />
      ))}
    </Stack>
  );
};
