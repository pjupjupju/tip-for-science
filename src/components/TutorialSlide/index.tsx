import React, { ReactNode } from 'react';
import { Box, Flex } from 'rebass';

interface TutorialSlideProps {
  step: number;
  handleNextStep: Function;
  currentTip?: number;
  handleSubmitTip: Function;
  stepper: ReactNode;
  content: ReactNode;
}

export const TutorialSlide = ({
  stepper: StepperComponent,
  // step,
  content: Content,
}: TutorialSlideProps) => {
  return (
    <Flex flexDirection="column" alignItems="center" width="100%" height="100%">
      {Content}
      <Box mb="auto">{StepperComponent}</Box>
    </Flex>
  );
};
