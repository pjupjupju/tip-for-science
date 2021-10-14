import React, { FC, useReducer } from 'react';
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

type TutorialState = {
  currentTip?: number;
  step: number;
  length: number;
};

enum ActionType {
  TUTORIAL_INIT = 'TUTORIAL_INIT',
  TIP_SUBMIT = 'TIP_SUBMIT',
  NEXT_STEP = 'NEXT_STEP',
}
interface TutorialGameAction {
  type: ActionType;
  payload?: any;
}

const initState = {
  step: 0,
};

const tutorialReducer = (state: TutorialState, action: TutorialGameAction) => {
  switch (action.type) {
    case 'TUTORIAL_INIT':
      return { ...state, currentTip: undefined, step: 0 };
    case 'TIP_SUBMIT':
      return {
        ...state,
        currentTip: action.payload?.tip,
        step: state.step + 1 < state.length ? state.step + 1 : state.step,
      };
    case 'NEXT_STEP':
      return {
        ...state,
        step: state.step + 1 < state.length ? state.step + 1 : state.step,
      };
    default:
      return state;
  }
};

const Tutorial = ({ slideList }: TutorialProps) => {
  const [{ currentTip, step }, dispatch] = useReducer(tutorialReducer, {
    ...initState,
    length: slideList.length,
  });

  const handleNextStep = () => {
    dispatch({ type: ActionType.NEXT_STEP });
  };

  const handleSubmitTip = (tip: number) => {
    dispatch({ type: ActionType.TIP_SUBMIT, payload: { tip } });
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
          currentTip={currentTip}
        />
      </Box>
    </Flex>
  );
};

export { Tutorial };
