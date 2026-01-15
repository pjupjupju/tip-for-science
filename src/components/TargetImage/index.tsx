import React from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import target from '../../assets/target.svg';

const float = keyframes`
  0% { transform: translate(0, 0px); }
  50% { transform: translate(0, 15px); }
  100% { transform: translate(0, 0px); }
`;

const TargetImage = () => (
  <Box
    component="img"
    src={target}
    alt="target animation"
    sx={{
      position: 'absolute',
      opacity: 0.05,
      left: ['-50px', '-10%', '10%'],
      top: ['10%', '10%', '5%'],
      width: ['75%', '75%', '50%'],
      maxWidth: '960px',
      zIndex: -1,
      animation: `${float} 10s ease-in-out infinite`,
    }}
  />
);

export { TargetImage };
