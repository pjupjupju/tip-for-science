import React, { ReactNode } from 'react';
import BaseContainer from '@mui/material/Container';
import Stack from '@mui/material/Stack';

export interface ContainerProps {
  children: ReactNode;
  isRelative?: boolean;
  noPadding?: boolean;
}

const containerXpadding = { xs: 2, sm: 3 };
const relativePositionStyles = { position: 'relative' };
const getStyles = (isRelative: boolean, noPadding: boolean) => ({
  ...(isRelative ? relativePositionStyles : {}),
  height: '100%',
  width: '100%',
  mx: 'auto',
  p: noPadding ? '0 !important' : containerXpadding,
  boxSizing: 'border-box',
  '&.MuiContainer-maxWidthMd': {
    maxWidth: '700px',
  },
});

const stackStyles = {
  width: '100%',
  height: '100%',
};

const Container = ({ children, isRelative = false, noPadding = false }: ContainerProps) => (
  <BaseContainer maxWidth="md" sx={getStyles(isRelative, noPadding)}>
    <Stack p={0} sx={stackStyles}>
      {children}
    </Stack>
  </BaseContainer>
);

export { Container, containerXpadding };
