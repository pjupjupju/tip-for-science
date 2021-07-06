import React, { FC, useState } from 'react';
import { Box, Flex } from 'rebass';
import {
  TutorialSlide,
  CommonTutorialProps,
} from '../../../components/TutorialSlide';

interface SlideSettings {
  content: FC<CommonTutorialProps>;
  stepper?: FC<CommonTutorialProps>;
}

interface TutorialProps {
  slideList: SlideSettings[];
}

const Tutorial = ({ slideList }: TutorialProps) => {
  const [step, setStep] = useState(0);
  const handleNextStep = () => {
    setStep(step + 1 < slideList.length ? step + 1 : 0);
  };
  const handleSubmitTip = (tip: number) => {
    console.log('submitted:', tip);
  };

  return (
    <Flex
      flexDirection="column"
      justifyContent="flex-end"
      height="100%"
      width="100%"
    >
      <Box
        sx={{
          flexGrow: 1,
          flexShrink: 0,
        }}
      >
        <TutorialSlide
          {...slideList[step]}
          step={step}
          handleNextStep={handleNextStep}
          onSubmit={handleSubmitTip}
          length={slideList.length}
        />
      </Box>
    </Flex>
  );
};

export { Tutorial };
