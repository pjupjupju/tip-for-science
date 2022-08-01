import React, { FC } from 'react';
import { Box, Flex } from 'rebass';

export interface CommonTutorialProps {
  step: number;
  length: number;
  handleNextStep: Function;
  currentTip?: number;
  onSubmit: (value: number) => void;
}
interface TutorialSlideProps extends CommonTutorialProps {
  stepper?: FC<CommonTutorialProps>;
  content: FC<CommonTutorialProps>;
}

export const TutorialSlide = ({
  stepper: StepperComponent,
  // step,
  content: Content,
  ...contentProps
}: TutorialSlideProps) => {
  return (
    <Flex flexDirection="column" alignItems="center" width="100%" height="100%">
      <Content {...contentProps} />
      {StepperComponent && (
        <Box p={2}>
          <StepperComponent {...contentProps} />
        </Box>
      )}
    </Flex>
  );
};
