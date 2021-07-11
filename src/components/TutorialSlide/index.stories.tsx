import React, { useState } from 'react';
import { Box, Button, Text } from 'rebass';
import { TutorialSlide } from './';
import { Stepper } from '../Stepper';
import { action } from '@storybook/addon-actions';

const length = 10;
const StorySlide1 = () => (
  <Box>
    <Text color="secondary">this is slide number 1</Text>
  </Box>
);
const StorySlide2 = ({ step, setStep }: any) =>  <Box>
<Text color="secondary">this is slide number {step + 1}</Text>
<Button
  onClick={() => {
    setStep(step === length - 1 ? 0 : step + 1);
  }}
>
  Next
</Button>
</Box>;

export default { title: 'component/TutorialSlide', component: TutorialSlide };
export const Default = () => (
  <TutorialSlide
    stepper={Stepper}
    step={1}
    length={1}
    handleNextStep={action('handle-next-step')}
    onSubmit={action('submit-tip')}
    content={StorySlide1}
  />
);

export const WithSteps = () => {
  const [step, setStep] = useState(0);
  return (
    <TutorialSlide
      stepper={Stepper}
      step={step}
      length={3}
      handleNextStep={setStep}
      onSubmit={action('submit-tip')}
      content={
       StorySlide2
      }
    />
  );
};

Default.storyName = 'Static TutorialSlide';
WithSteps.storyName = 'TutorialSlide with steps';
