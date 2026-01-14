import React, { KeyboardEvent, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Image, Text } from 'rebass';
import Box from '@mui/material/Box';
import NewButton from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Label, Input } from '@rebass/forms';

import { TooCloseDialog } from './TooCloseDialog';
import { GameOverScreen } from './GameOverScreen';
import { PreviousTips } from './PreviousTips';
import { Container, containerXpadding } from '../Container';
import { SubmitButton } from '../SubmitButton';
import { ScoreChart } from '../ScoreChart';
import { getScore } from '../../helpers';
import { FunFact } from './FunFact';
import ScoreMessage from '../ScoreMessage';

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

const actionsContainerStyles = {
  marginTop: { xs: 'auto', sm: 'auto', md: 1 },
  marginBottom: { xs: 0, sm: 0, md: 4 },
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

const homeButtonStyles = { flex: 1, marginRight: 1, borderRadius: 0 };

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
    <Container noPadding>
      <Stack width="100%" gap={1} px={containerXpadding} boxSizing="border-box">
        <Stack
          minHeight={60}
          width="100%"
          justifyContent="center"
          alignItems="center"
          flexShrink={0}
          flexGrow={0}
        >
          <Text
            fontSize={[3, 4, 5]}
            fontWeight="bold"
            color="secondary"
            textAlign="center"
            p={3}
          >
            {question}
          </Text>
        </Stack>
        <Image src={image} sx={imageStyle} />
        <PreviousTips previousTips={previousTips} unit={unit} />
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          p={2}
        >
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
        </Stack>{' '}
      </Stack>
      {isKnewItDialogOpen && (
        <TooCloseDialog
          onGuessed={handleTooCloseDialogClick(false)}
          onKnewIt={handleTooCloseDialogClick(true)}
        />
      )}
    </Container>
  ) : (
    <Container noPadding>
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="column"
        flexGrow={1}
        flexShrink={1}
        gap={1}
        width="100%"
        px={containerXpadding}
        boxSizing="border-box"
      >
        <Stack
          minHeight={60}
          width="100%"
          justifyContent="center"
          alignItems="center"
          flexShrink={0}
          flexGrow={0}
        >
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
        </Stack>
        <Image src={image} sx={imageStyle} />
        <Stack
          justifyContent="center"
          alignItems="center"
          direction="column"
          flexGrow={1}
          flexShrink={1}
          width="100%"
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
              <Stack
                justifyContent="center"
                alignItems="center"
                direction="column"
                flexGrow={1}
                flexShrink={1}
              >
                <Text
                  textAlign="center"
                  color="graphScore"
                  fontSize={[2, 3, 3]}
                  mb={3}
                >
                  {questionScore === 0 && (
                    <ScoreMessage scoreType="score.zero" />
                  )}
                  {questionScore !== null &&
                    questionScore > 0 &&
                    questionScore < 40 && (
                      <ScoreMessage scoreType="score.low" />
                    )}
                  {questionScore !== null &&
                    questionScore >= 40 &&
                    questionScore < 80 && (
                      <ScoreMessage scoreType="score.high" />
                    )}
                  {questionScore !== null &&
                    questionScore >= 80 &&
                    questionScore < 95 && (
                      <ScoreMessage scoreType="score.top" />
                    )}
                </Text>
                <FunFact correctAnswer={correctAnswer} fact={fact} />
              </Stack>
            </>
          ) : (
            <GameOverScreen onContinue={onFinish} />
          )}
        </Stack>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        {...actionsContainerStyles}
      >
        <NewButton
          variant="contained"
          onClick={handleClickHome}
          color="secondary"
          sx={homeButtonStyles}
        >
          <FormattedMessage
            id="app.home"
            defaultMessage="Home"
            description="Home button"
          />
        </NewButton>
        <Button sx={{ flex: 5 }} onClick={handleClickFinish}>
          <FormattedMessage
            id="app.game.continue"
            defaultMessage="Continue"
            description="Continue"
          />
        </Button>
      </Stack>
    </Container>
  );
};

export { Game, GameOverScreen, TooCloseDialog, PreviousTips };
