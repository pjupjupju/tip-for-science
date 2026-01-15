import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

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
  content: Content,
  ...contentProps
}: TutorialSlideProps) => {
  return (
    <Stack direction="column" alignItems="center" width="100%" height="100%">
      <Content {...contentProps} />
      {StepperComponent && (
        <Box p={1}>
          <StepperComponent {...contentProps} />
        </Box>
      )}
    </Stack>
  );
};
