import { Flex } from 'rebass';
import React, { ReactNode } from 'react';

interface TutorialHeaderProps {
  centerVertically?: boolean;
  children: ReactNode;
}

const verticallyCentered = { alignItems: 'center' };

const TutorialHeader = ({
  children,
  centerVertically = true,
}: TutorialHeaderProps) => (
  <Flex
    minHeight="80px"
    width="100%"
    justifyContent="center"
    {...(centerVertically && verticallyCentered)}
  >
    {children}
  </Flex>
);

export { TutorialHeader };
