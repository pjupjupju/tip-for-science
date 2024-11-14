import React, { ReactNode } from 'react';
import { Container as BaseContainer, Stack } from '@mui/material';

interface ContainerProps {
  children: ReactNode;
  isRelative?: boolean;
}

const relativePositionStyles = { position: 'relative' };
const getStyles = (isRelative: boolean) => ({
  ...(isRelative ? relativePositionStyles : {}),
  height: '100%',
  width: '100%',
  mx: 'auto',
  '&.MuiContainer-maxWidthMd': {
    maxWidth: '700px',
    padding: 0,
  },
  p: 0,
});

const stackStyles = {
  width: '100%',
  height: '100%',
};

const Container = ({ children, isRelative = false }: ContainerProps) => (
  <BaseContainer maxWidth="md" sx={getStyles(isRelative)}>
    <Stack p={0} sx={stackStyles}>
      {children}
    </Stack>
  </BaseContainer>
);

export { Container };
