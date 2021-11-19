import React from 'react';
import { Button, ButtonProps, Flex } from 'rebass';
import { Link } from 'react-router-dom';

const BackButtonComponent = ({ children, ...props }: ButtonProps) => (
  <Button {...props} as="a" mb={3}>
    {children}
  </Button>
);

const BackButton = ({ children }: { children: string }) => (
  <Flex mt="auto">
    <Link component={BackButtonComponent} to="/">
      {children}
    </Link>
  </Flex>
);

export { BackButton };
