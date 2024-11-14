import React, { KeyboardEvent, useRef } from 'react';
import { Box, Button, Flex, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { TooCloseDialog } from './TooCloseDialog';
import { GameOverScreen } from './GameOverScreen';
import { PreviousTips } from './PreviousTips';
import { Container } from '../Container';
import { SubmitButton } from '../SubmitButton';
import { ScoreChart } from '../ScoreChart';
import { getScore } from '../../helpers';
import { FunFact } from './FunFact';
import ScoreMessage from '../ScoreMessage';
import { FormattedMessage, useIntl } from 'react-intl';

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

const headerStyles = {
  minHeight: 60,
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0,
  flexGrow: 0,
};

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
  const intl = useIntl();
  const placeholder = intl.formatMessage({
    id: 'app.yourtip',
    defaultMessage: 'your tip',
    description: 'Yourtip placeholder',
  });

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
      <Flex sx={headerStyles}>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={3}
        >
          {question}
        </Text>
      </Flex>
      <Image src={image} sx={imageStyle} />
      <PreviousTips previousTips={previousTips} unit={unit} />
      <Flex justifyContent="center" alignItems="center" p={2}>
        <Label htmlFor="tip" sx={labelStyle}>
          <FormattedMessage
            id="app.tip"
            defaultMessage="tip:"
            description="Tip"
          />
        </Label>
        <Input
          ref={inputRef}
          id="tip"
          name="tip"
          type="number"
          placeholder={placeholder}
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
      <Flex sx={headerStyles}>
        <Text
          fontSize={[3, 4, 4]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={[1, 2, 3]}
        >
          <FormattedMessage
            id="app.game.score"
            defaultMessage="Score:"
            description="Score"
          />{' '}
          {score.toFixed(2)}
        </Text>
      </Flex>
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
              <Text
                textAlign="center"
                color="graphScore"
                fontSize={[2, 3, 3]}
                mb={3}
              >
                {questionScore === 0 && <ScoreMessage scoreType="score.zero" />}
                {questionScore !== null &&
                  questionScore > 0 &&
                  questionScore < 40 && <ScoreMessage scoreType="score.low" />}
                {questionScore !== null &&
                  questionScore >= 40 &&
                  questionScore < 80 && <ScoreMessage scoreType="score.high" />}
                {questionScore !== null &&
                  questionScore >= 80 &&
                  questionScore < 95 && <ScoreMessage scoreType="score.top" />}
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
          <FormattedMessage
            id="app.home"
            defaultMessage="Home"
            description="Home button"
          />
        </Button>
        <Button sx={{ flex: 5 }} onClick={handleClickFinish}>
          <FormattedMessage
            id="app.game.continue"
            defaultMessage="Continue"
            description="Continue"
          />
        </Button>
      </Flex>
    </Container>
  );
};

export { Game, GameOverScreen, TooCloseDialog, PreviousTips };
