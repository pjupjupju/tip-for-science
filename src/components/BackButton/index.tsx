import React from 'react';
import { Flex, FlexProps } from 'rebass';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const buttonStyles = { mb: 3 };

const BackButton = ({
  children,
  pushDown = true,
  ...props
}: FlexProps & { pushDown?: boolean }) => {
  const pushDownProps = pushDown ? { mt: 'auto' } : {};

  return (
    <Flex {...pushDownProps} {...props}>
      <Button variant="contained" sx={buttonStyles} to="/" component={Link}>
        {children}
      </Button>
    </Flex>
  );
};

export { BackButton };
