import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box, { BoxProps } from '@mui/material/Box';

const buttonStyles = { mb: 3 };

const BackButton = ({
  children,
  pushDown = true,
  ...props
}: BoxProps & { pushDown?: boolean }) => (
  <Box sx={{ mt: pushDown ? 'auto' : undefined }} {...props}>
    <Button variant="contained" sx={buttonStyles} to="/" component={Link}>
      {children}
    </Button>
  </Box>
);

export { BackButton };
