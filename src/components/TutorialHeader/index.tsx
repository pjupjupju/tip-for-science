import Box from '@mui/material/Box';
import React, { ReactNode } from 'react';

interface TutorialHeaderProps {
  centerVertically?: boolean;
  children: ReactNode;
}

const TutorialHeader = ({
  children,
  centerVertically = true,
}: TutorialHeaderProps) => (
  <Box
    sx={{
      display: 'flex',
      minHeight: '80px',
      width: '100%',
      justifyContent: 'center',
      ...(centerVertically && { alignItems: 'center' }),
    }}
  >
    {children}
  </Box>
);

export { TutorialHeader };
