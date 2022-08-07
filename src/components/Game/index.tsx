import React, { KeyboardEvent, useRef } from 'react';
import { Box, Button, Flex, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { TooCloseDialog } from './TooCloseDialog';
import { GameOverScreen } from './GameOverScreen';
import { PreviousTips } from './PreviousTips';
import { Container } from '../Container';
import { SubmitButton } from '../SubmitButton';
import { ScoreChart } from '../ScoreChart';
import {
  getScore,
  getScoreSentence,
  topScoreSentence,
  highScoreSentence,
  lowScoreSentence,
  zeroScoreSentence,
} from '../../helpers';
import { FunFact } from './FunFact';

export interface Settings {
  question: string;
  image: string;
  previousTips?: number[];
  correctAnswer: number;
  timeLimit?: number;
  unit: string;
  fact: string;
}

interface GameProps {
  isKnewItDialogOpen: boolean;
  isSubmitted: boolean;
  onFinish: Function;
  onHome: Function;
  onIsTooClose: Function;
  onSubmit?: (tip: number, knewIt?: boolean) => void;
  settings: Settings;
  currentTip?: number;
  score: number;
}

const inputStyles = {
  '::placeholder': {
    color: 'white',
  },
  color: 'white',
  flex: 1,
  mx: 3,
};

const imageStyle = {
  maxWidth: '80%',
  alignSelf: 'center',
  objectFit: 'contain',
};

const labelStyle = {
  flexGrow: 0,
  flexShrink: 0,
  width: 'auto',
  color: 'white',
};

const isTooClose = (score: number): boolean => score >= 95;

const Game = ({
  settings: {
    question,
    image,
    fact,
    previousTips,
    unit,
    timeLimit,
    correctAnswer,
  },
  isKnewItDialogOpen,
  isSubmitted,
  onHome,
  onSubmit,
  onFinish,
  onIsTooClose,
  currentTip,
  score,
}: GameProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const questionScore =
    typeof currentTip !== 'undefined'
      ? getScore(currentTip, correctAnswer)
      : null;

  const handleClickFinish = () => {
    onFinish();
  };
  const handleClickHome = () => {
    onHome();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      ![
        'Shift',
        'ArrowLeft',
        'ArrowRight',
        'Backspace',
        'Enter',
        '.',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
      ].includes(event.key)
    ) {
      event.preventDefault();
    }

    if (event.key === 'Enter' && onSubmit) {
      const anticipatedScore = getScore(
        Number(event.currentTarget.value),
        correctAnswer
      );

      if (anticipatedScore !== null && isTooClose(anticipatedScore)) {
        onIsTooClose();
      } else {
        onSubmit(Number(event.currentTarget.value));
      }
    }
  };

  const handleClickSubmit = () => {
    if (inputRef.current && onSubmit) {
      const anticipatedScore = getScore(
        Number(inputRef.current.value),
        correctAnswer
      );

      if (anticipatedScore !== null && isTooClose(anticipatedScore)) {
        onIsTooClose();
      } else {
        onSubmit(Number(inputRef.current.value));
      }
    }
  };

  const handleTooCloseDialogClick = (knewIt: boolean) => () => {
    onSubmit(Number(inputRef.current.value), knewIt);
  };

  return !isSubmitted ? (
    <Container>
      <Box minHeight="80px">
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={3}
        >
          {question}
        </Text>
      </Box>
      <Image src={image} sx={imageStyle} />
      <PreviousTips previousTips={previousTips} unit={unit} />
      <Flex justifyContent="center" alignItems="center" p={2}>
        <Label htmlFor="tip" sx={labelStyle}>
          tip:
        </Label>
        <Input
          ref={inputRef}
          id="tip"
          name="tip"
          type="number"
          placeholder="tvůj tip"
          sx={inputStyles}
          onKeyDown={handleKeyDown}
        />
        <Text color="white" mr={4}>
          {unit}
        </Text>
        <SubmitButton onClick={handleClickSubmit} timeLimit={timeLimit} />
      </Flex>{' '}
      {isKnewItDialogOpen && (
        <TooCloseDialog
          onGuessed={handleTooCloseDialogClick(false)}
          onKnewIt={handleTooCloseDialogClick(true)}
        />
      )}
    </Container>
  ) : (
    <Container>
      <Box minHeight="60px">
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={[1, 2, 3]}
        >
          Skóre: {score.toFixed(2)}
        </Text>
      </Box>
      <Image src={image} sx={imageStyle} />
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        flexGrow={1}
        flexShrink={1}
      >
        {typeof currentTip !== 'undefined' ? (
          <>
            <Box width="100%" height="200px">
              <ScoreChart
                currentTip={currentTip}
                correctAnswer={correctAnswer}
                previousTips={previousTips}
              />
            </Box>
            <Flex
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              flexGrow={1}
              flexShrink={1}
            >
              <Text textAlign="center" color="graphScore" fontSize={3} mb={3}>
                {questionScore === 0 && getScoreSentence(zeroScoreSentence)}
                {questionScore !== null &&
                  questionScore > 0 &&
                  questionScore < 40 &&
                  getScoreSentence(lowScoreSentence)}
                {questionScore !== null &&
                  questionScore >= 40 &&
                  questionScore < 80 &&
                  getScoreSentence(highScoreSentence)}
                {questionScore !== null &&
                  questionScore >= 80 &&
                  questionScore < 95 &&
                  getScoreSentence(topScoreSentence)}
              </Text>
              <FunFact correctAnswer={correctAnswer} fact={fact} />
            </Flex>
          </>
        ) : (
          <GameOverScreen onContinue={onFinish} />
        )}
      </Flex>
      <Flex
        justifyContent="space-between"
        mt={['auto', 'auto', 1]}
        mb={[0, 0, 4]}
      >
        <Button
          sx={{ flex: 1 }}
          mr="1"
          backgroundColor="neutralFade"
          onClick={handleClickHome}
        >
          Domů
        </Button>
        <Button sx={{ flex: 5 }} onClick={handleClickFinish}>
          Pokračovat ▶
        </Button>
      </Flex>
    </Container>
  );
};

export { Game, GameOverScreen, TooCloseDialog, PreviousTips };
