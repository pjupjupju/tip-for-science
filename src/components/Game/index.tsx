import React, { KeyboardEvent, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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

const questionFontSizes = { xs: 18, sm: 24, md: 28 };
const scoreMessageFontSizes = { xs: 18, sm: 18, md: 22 };

const imageStyles = {
  maxWidth: '100%',
  alignSelf: 'center',
  objectFit: 'contain',
};

const scoreStyles = {
  fontSize: { xs: 18, sm: 20, md: 24 },
  p: { xs: 1, sm: 2, md: 3 },
};

const inputStyles = {
  color: 'white',
  flex: 1,
  minWidth: '120px',
  borderRadius: 0,
  input: {
    padding: '8px 12px',
    height: '23px',
    color: 'white',
    '&::placeholder': {
      color: 'white',
      opacity: 0.8,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
  },
  '&.Mui-focused': {
    boxShadow: 'none',
  },
};

const labelStyles = {
  flexGrow: 0,
  flexShrink: 0,
  width: 'auto',
  color: 'white',
};

const homeButtonStyles = {
  flex: 1,
  borderRadius: { xs: 0, sm: 1 },
};
const continueButtonStyles = { flex: 5, borderRadius: { xs: 0, sm: 1 } };

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
          <Typography
            fontSize={questionFontSizes}
            fontWeight="bold"
            color="text.secondary"
            textAlign="center"
            p={3}
          >
            {question}
          </Typography>
        </Stack>
        <Box
          component="img"
          src={image}
          alt={`Question: ${question}, image.`}
          sx={imageStyles}
        />
        <PreviousTips previousTips={previousTips} unit={unit} />
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          p={2}
          gap={2}
        >
          <InputLabel htmlFor="tip" sx={labelStyles}>
            <FormattedMessage
              id="app.tip"
              defaultMessage="tip:"
              description="Tip"
            />
          </InputLabel>
          <OutlinedInput
            id="tip"
            name="tip"
            type="number"
            inputRef={inputRef}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            sx={inputStyles}
            autoFocus
          />
          {!!unit && unit !== '' && (
            <Typography color="white" ml={-1} mr={2}>
              {unit}
            </Typography>
          )}
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
          <Typography
            {...scoreStyles}
            fontWeight="bold"
            color="text.secondary"
            textAlign="center"
          >
            <FormattedMessage
              id="app.game.score"
              defaultMessage="Score:"
              description="Score"
            />{' '}
            {score.toFixed(2)}
          </Typography>
        </Stack>
        <Box
          component="img"
          src={image}
          alt={`Question: ${question}, image.`}
          sx={imageStyles}
        />
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
                <Typography
                  textAlign="center"
                  color="expressive"
                  fontSize={scoreMessageFontSizes}
                  mb={3}
                >
                  {questionScore === 0 && (
                    <ScoreMessage question={question} scoreType="score.zero" />
                  )}
                  {questionScore !== null &&
                    questionScore > 0 &&
                    questionScore < 40 && (
                      <ScoreMessage question={question} scoreType="score.low" />
                    )}
                  {questionScore !== null &&
                    questionScore >= 40 &&
                    questionScore < 80 && (
                      <ScoreMessage
                        question={question}
                        scoreType="score.high"
                      />
                    )}
                  {questionScore !== null &&
                    questionScore >= 80 &&
                    questionScore < 95 && (
                      <ScoreMessage question={question} scoreType="score.top" />
                    )}
                </Typography>
                <FunFact correctAnswer={correctAnswer} fact={fact} />
              </Stack>
            </>
          ) : (
            <GameOverScreen onContinue={onFinish} />
          )}
        </Stack>
      </Stack>
      <Stack
        gap={1}
        direction="row"
        justifyContent="space-between"
        {...actionsContainerStyles}
      >
        <Button
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
        </Button>
        <Button
          variant="contained"
          sx={continueButtonStyles}
          onClick={handleClickFinish}
        >
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
