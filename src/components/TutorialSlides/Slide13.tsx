import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import jupiter from './../../assets/jupiterTut.jpg';
import { PreviousTips } from '../Game';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { SlideProps } from './types';
import { SubmitButton } from '../SubmitButton';
import { FormattedMessage, useIntl } from 'react-intl';
import { tutorialText } from './styles';

const previousTips = [80000, 1000, 500, 20000];
const timeLimit = 20;

const Slide13 = ({ onSubmit }: SlideProps) => {
  const intl = useIntl();
  const question = intl.formatMessage({
    id: 'app.tutorial.slide.jupiter',
    defaultMessage: `How fast does Jupiter rotate? And hurry up, time is ticking!`,
    description: 'Tut13 jupiter',
  });
  const unit = intl.formatMessage({
    id: 'app.unitkmh',
    defaultMessage: `km/h`,
    description: 'unit km/h',
  });
  const placeholder = intl.formatMessage({
    id: 'app.yourtip',
    defaultMessage: 'your tip',
    description: 'Yourtip placeholder',
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const handleClickSubmit = () => {
    onSubmit(Number(inputRef.current!.value));
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

    if (event.key === 'Enter') {
      onSubmit(Number(event.currentTarget.value));
    }
  };
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const [timeLimitEnded, setTimeLimitEnded] = useState(false);
  useEffect(() => {
    if (timeoutRef.current == null) {
      timeoutRef.current = setTimeout(() => {
        setTimeLimitEnded(true);
      }, timeLimit * 1000);
    }
    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }
    };
  });

  return (
    <Container isRelative={true}>
      <TutorialHeader>
        <Typography
          sx={tutorialText}
          p={3}
        >
          {' '}
          {question}
        </Typography>
      </TutorialHeader>
      <Box
        component="img"
        src={jupiter}
        alt="Jupiter"
        sx={{
          maxWidth: '100%',
          alignSelf: 'center',
          objectFit: 'contain',
        }}
      />
      <PreviousTips previousTips={previousTips} unit={unit} />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={2}
        boxSizing="border-box"
        width="100%"
      >
        <InputLabel
          htmlFor="tip"
          sx={{
            flexGrow: 0,
            flexShrink: 0,
            width: 'auto',
            color: 'white',
            mr: 2,
          }}
        >
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
          placeholder={placeholder}
          inputRef={inputRef}
          onKeyDown={handleSubmit}
          sx={{
            color: 'white',
            mx: 2,
            flex: 1,
            minWidth: '120px',
            input: {
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
          }}
        />
        <Typography color="white" mr={4}>
          {unit}
        </Typography>{' '}
        <SubmitButton onClick={handleClickSubmit} timeLimit={timeLimit} />
      </Box>
      {timeLimitEnded && (
        <Box
          p={3}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            background: 'rgba(0,0,0,0.85)',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          <Typography
            fontWeight={500}
            textAlign="center"
            my={1}
            color="white"
            fontSize={{
              xs: 16,
              sm: 20,
              md: 24,
            }}
          >
            <FormattedMessage
              id="app.tutorial.slide.timesup"
              defaultMessage="Time's up! But this time, you can still submit your answer here:"
              description="Tut13 times up"
            />
          </Typography>
          <OutlinedInput
            id="tip2"
            name="tip2"
            type="number"
            placeholder={placeholder}
            onKeyDown={handleSubmit}
            sx={{
              color: 'black',
              background: 'white',
              mt: 2,
              input: {
                color: '#000',
                '&::placeholder': {
                  color: '#000',
                },
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export { Slide13 };
