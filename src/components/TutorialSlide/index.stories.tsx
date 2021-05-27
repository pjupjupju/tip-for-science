import React, { useState } from 'react';
import { Box, Button, Text } from 'rebass';
import { TutorialSlide } from './';
import { Stepper } from '../Stepper';
import { action } from '@storybook/addon-actions';

const length = 10;
export default { title: 'component/TutorialSlide', component: TutorialSlide };
export const Default = () => (
  <TutorialSlide
    stepper={<Stepper length={length} step={1} />}
    step={1}
    handleNextStep={action('handle-next-step')}
    handleSubmitTip={action('submit-tip')}
    content={
      <Box>
        <Text color="secondary">this is slide number 1</Text>
      </Box>
    }
  />
);

export const WithSteps = () => {
  const [step, setStep] = useState(0);
  return (
    <TutorialSlide
      stepper={<Stepper length={length} step={step} />}
      step={step}
      handleNextStep={setStep}
      handleSubmitTip={action('submit-tip')}
      content={
        <Box>
          <Text color="secondary">this is slide number {step + 1}</Text>
          <Button
            onClick={() => {
              setStep(step === length - 1 ? 0 : step + 1);
            }}
          >
            Next
          </Button>
        </Box>
      }
    />
  );
};

Default.storyName = 'Static TutorialSlide';
WithSteps.storyName = 'TutorialSlide with steps';
