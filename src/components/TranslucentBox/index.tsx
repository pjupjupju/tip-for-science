import React, { ReactNode } from 'react';
import { Box } from 'rebass';

interface TranslucentBoxProps {
  children: ReactNode;
}

const translucentBoxStyle = {
  background: 'rgba(0,0,0,0.85)',
  position: 'absolute',
  top: 0,
  left: 0,
};

const TranslucentBox = ({ children }: TranslucentBoxProps) => (
  <Box width="100%" height="100%" sx={translucentBoxStyle}>
    {children}
  </Box>
);

export { TranslucentBox };
