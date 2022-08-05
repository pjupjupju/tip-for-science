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
  funfact: string;
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

const funfact =
  'Ottův slovník naučný má {correct} dílů. Ve své době to byl nejkvalitnější encyklopedický počin v češtině. Celosvětově snad druhý po Encyclopædií Britannice. V roce 2011 ho v počtu hesel překonala česká Wikipedie.';
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
        src="https://tfsstorage.s3.eu-central-1.amazonaws.com/img/adopt.jpg"
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
        <Text color="white" mr={4}>
          {unit}
        </Text>
        <SubmitButton onClick={handleClickSubmit} timeLimit={timeLimit} />
      </Flex>{' '}
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
      <Image
        src="https://tfsstorage.s3.eu-central-1.amazonaws.com/img/adopt.jpg"
        sx={imageStyle}
      />
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
              <Text textAlign="center" color="secondary" fontSize={3}>
                {getScoreSentence(zeroScoreSentence)}
              </Text>
            )}
            {questionScore !== null &&
              questionScore > 0 &&
              questionScore < 0.4 && (
                <Text textAlign="center" color="secondary" fontSize={3}>
                  {getScoreSentence(lowScoreSentence)}
                </Text>
              )}
            {questionScore !== null &&
              questionScore >= 0.4 &&
              questionScore < 0.8 && (
                <Text textAlign="center" color="secondary" fontSize={3}>
                  {getScoreSentence(highScoreSentence)}
                </Text>
              )}
            {questionScore !== null &&
              questionScore >= 0.8 &&
              questionScore < 0.95 && (
                <Text textAlign="center" color="secondary" fontSize={3}>
                  {getScoreSentence(topScoreSentence)}
                </Text>
              )}
            <Text textAlign="center" color="secondary" fontSize={3}>
              {funfact}
            </Text>
          </>
        ) : (
          <GameOverScreen onContinue={onFinish} />
        )}
      </Flex>
      <Flex justifyContent="space-between" mt={['auto', 'auto', 1]}>
        <Button onClick={handleClickHome}>Domů</Button>
        <Button onClick={handleClickFinish}>Pokračovat</Button>
      </Flex>
    </Container>
  );
};

export { Game, GameOverScreen, TooCloseDialog, PreviousTips };
