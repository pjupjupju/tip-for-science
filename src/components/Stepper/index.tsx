import React from 'react';
import { Box, Flex } from 'rebass';
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
  backgroundColor: 'secondary',
};

const Dot = ({ isActive }: { isActive: boolean }) => (
  <Box as="li" sx={isActive ? activeDotStyles : dotStyles} />
);

export const Stepper = ({
  step = 0,
  length,
}: Pick<CommonTutorialProps, 'step' | 'length'>) => {
  const items = new Array(length).fill(0);
  return (
    <Flex justifyContent="center" my={2} p={1}>
      {items.map((_, index) => (
        <Dot key={`dot-index-${index}`} isActive={step === index} />
      ))}
    </Flex>
  );
};
