import { Flex } from 'rebass';
import React, { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  isRelative?: boolean;
}

const relativePositionStyles = { position: 'relative' };

const Container = ({ children, isRelative = false }: ContainerProps) => (
  <Flex
    maxWidth={['100%', '100%', '700px']}
    height="100%"
    mx="auto"
    width="100%"
    flexDirection="column"
    sx={isRelative ? relativePositionStyles : undefined}
  >
    {children}
  </Flex>
);

export { Container };
