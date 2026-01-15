import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface TranslucentBoxProps {
  children: ReactNode;
}

const translucentBoxStyle = {
  background: 'rgba(0,0,0,0.85)',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
};

const TranslucentBox = ({ children }: TranslucentBoxProps) => (
  <Box sx={translucentBoxStyle}>{children}</Box>
);

export { TranslucentBox };
