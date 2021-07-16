import { Flex } from 'rebass';
import React, { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => (
  <Flex
    maxWidth={['100%', '100%', '700px']}
    height={['100%', '100%', 'auto']}
    mx="auto"
    flexDirection="column"
  >
    {children}
  </Flex>
);

export { Container };
