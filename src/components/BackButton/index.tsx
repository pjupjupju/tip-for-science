import React from 'react';
import { Flex, FlexProps } from 'rebass';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

const buttonStyles = { mb: 3 };

const BackButton = ({
  children,
  pushDown = true,
  ...props
}: FlexProps & { pushDown?: boolean }) => {
  const pushDownProps = pushDown ? { mt: 'auto' } : {};

  return (
    <Flex {...pushDownProps} {...props}>
      <Button sx={buttonStyles} to="/" component={Link}>
        {children}
      </Button>
    </Flex>
  );
};

export { BackButton };
