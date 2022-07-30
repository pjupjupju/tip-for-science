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

export interface Settings {
  question: string;
  image: string;
  previousTips?: number[];
  correctAnswer: number;
  timeLimit?: number;
  unit: string;
}

interface GameProps {
  isSubmitted: boolean;
  onFinish: Function;
  onHome: Function;
  onSubmit?: (tip: number) => void;
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
  height: '210px',
  width: '100%',
  alignSelf: 'center',
};

const labelStyle = {
  flexGrow: 0,
  flexShrink: 0,
  width: 'auto',
  color: 'white',
};

const isTooClose = (score: number): boolean => score >= 0.95;

const Game = ({
  settings: { question, image, previousTips, unit, timeLimit, correctAnswer },
  isSubmitted,
  onHome,
  onSubmit,
  onFinish,
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

  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSubmit) {
      onSubmit(Number(event.currentTarget.value));
    }
  };

  const handleClickSubmit = () => {
    if (inputRef.current && onSubmit) {
      onSubmit(Number(inputRef.current.value));
    }
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
      <Image
        src="https://i.pinimg.com/originals/2d/9e/f7/2d9ef737d99df359187644338af83118.png"
        sx={imageStyle}
      />
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
          onKeyDown={handleSubmit}
        />
        <Text color="white">{unit}</Text>
      </Flex>{' '}
      <Flex py={2} justifyContent="flex-end">
        <SubmitButton onClick={handleClickSubmit} timeLimit={timeLimit} />
      </Flex>
    </Container>
  ) : (
    <Container>
      <Box minHeight="80px">
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={3}
        >
          Score: {score.toFixed(3)}
        </Text>
      </Box>
      <Image src={image} sx={imageStyle} />
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        {typeof currentTip !== 'undefined' ? (
          <>
            <Box width="100%" height="200px">
              <ScoreChart
                currentTip={currentTip}
                correctAnswer={correctAnswer}
                previousTips={previousTips}
              />
            </Box>
            {questionScore !== null && isTooClose(questionScore) && (
              <TooCloseDialog
                onGuessed={() => {
                  console.log('Tip marked as guessed.');
                }}
                onKnewIt={() => {
                  console.log('Tip marked as knew-answer.');
                }}
              />
            )}
            {questionScore === 0 && (
              <Text textAlign="center" color="white">
                {getScoreSentence(zeroScoreSentence)}
              </Text>
            )}
            {questionScore !== null &&
              questionScore > 0 &&
              questionScore < 0.4 && (
                <Text textAlign="center" color="white">
                  {getScoreSentence(lowScoreSentence)}
                </Text>
              )}
            {questionScore !== null &&
              questionScore >= 0.4 &&
              questionScore < 0.8 && (
                <Text textAlign="center" color="white">
                  {getScoreSentence(highScoreSentence)}
                </Text>
              )}
            {questionScore !== null &&
              questionScore >= 0.8 &&
              questionScore < 0.95 && (
                <Text textAlign="center" color="white">
                  {getScoreSentence(topScoreSentence)}
                </Text>
              )}
          </>
        ) : (
          <GameOverScreen />
        )}
      </Flex>
      <Flex justifyContent="space-between" mt={['auto', 'auto', 3]}>
        <Button onClick={handleClickHome}>Domů</Button>
        <Button onClick={handleClickFinish}>Pokračovat</Button>
      </Flex>
    </Container>
  );
};

export { Game, GameOverScreen, TooCloseDialog, PreviousTips };
