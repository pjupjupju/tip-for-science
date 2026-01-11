import React, { KeyboardEvent, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import { PreviousTips } from '../Game/PreviousTips';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { SlideProps } from './types';
import { SubmitButton } from '../SubmitButton';
import { FormattedMessage, useIntl } from 'react-intl';
import washington from './../../assets/washingtonTut.jpg';
import { tutorialText } from './styles';

const imageStyle = {
  maxWidth: '100%',
  alignSelf: 'center',
  objectFit: 'contain',
};

const previousTips = [28, 105];

const Slide9 = ({ onSubmit = () => {} }: SlideProps) => {
  const intl = useIntl();
  const question = intl.formatMessage({
    id: 'app.tutorial.slide.washingtonq',
    defaultMessage: "How tall is George Washington's head in the Mt. Rushmore?",
    description: 'Tut9 washington question',
  });
  const unit = intl.formatMessage({
    id: 'app.tutorial.slide.meter',
    defaultMessage: 'm',
    description: 'Tut9 meter',
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

  return (
    <Container>
      <TutorialHeader>
        <Typography sx={tutorialText} p={3}>
          {' '}
          <FormattedMessage
            id="app.tutorial.slide.previousp"
            defaultMessage="Now you also have the previous tips available as a potential hint:"
            description="Tut9 previousp"
          />
          <br />
          {question}
        </Typography>
      </TutorialHeader>
      <Box
        component="img"
        src={washington}
        alt="George Washington"
        sx={imageStyle}
      />
      <PreviousTips previousTips={previousTips} />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="baseline"
        flexWrap="wrap"
        p={1}
        mt={1}
        width="100%"
        maxWidth="960px"
        mx="auto"
        boxSizing="border-box"
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
        </Typography>

        <SubmitButton onClick={handleClickSubmit} />
      </Box>
    </Container>
  );
};

export { Slide9 };
