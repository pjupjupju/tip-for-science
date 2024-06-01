import React from 'react';
import { Button, ButtonProps, Flex, FlexProps } from 'rebass';
import { Link } from 'react-router-dom';

const BackButtonComponent = ({ children, ...props }: ButtonProps) => (
  <Button {...props} as="a" mb={3}>
    {children}
  </Button>
);

const BackButton = ({
  children,
  pushDown = true,
  ...props
}: FlexProps & { pushDown?: boolean }) => {
  const pushDownProps = pushDown ? { mt: 'auto' } : {};
  return (
    <Flex {...pushDownProps} {...props}>
      <Link to="/">
        {children}
      </Link>
    </Flex>
  );
};

export { BackButton };
