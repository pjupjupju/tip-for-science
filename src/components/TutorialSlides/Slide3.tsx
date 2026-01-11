import React, { KeyboardEvent, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import elephant from './../../assets/elephantTut.jpg';
import { TutorialHeader } from '../TutorialHeader';
import { Container } from '../Container';
import { SlideProps } from './types';
import { SubmitButton } from '../SubmitButton';
import { FormattedMessage, useIntl } from 'react-intl';

const Slide3 = ({ onSubmit }: SlideProps) => {
  const intl = useIntl();
  const inputRef = useRef<HTMLInputElement>(null);

  const question = intl.formatMessage({
    id: 'app.tutorial.slide.elephant',
    defaultMessage: 'How much did the heaviest elephant weight?',
    description: 'Tut3 eleph',
  });
  const unit = intl.formatMessage({
    id: 'app.unitkg',
    defaultMessage: 'kg',
    description: 'unit kg',
  });
  const placeholder = intl.formatMessage({
    id: 'app.yourtip',
    defaultMessage: 'your tip',
    description: 'Yourtip placeholder',
  });

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
        <Typography
          fontSize={{
            xs: 24,
            sm: 28,
            md: 32,
          }}
          color="text.secondary"
          textAlign="center"
          p={2}
        >
          {' '}
          {question}
        </Typography>
      </TutorialHeader>
      <Box // TODO: image is not centered the same way as the submit panel, small screen results in button out of screen
        component="img"
        src={elephant}
        alt="elephant"
        sx={{
          maxWidth: '100%',
          alignSelf: 'center',
          objectFit: 'contain',
        }}
      />{' '}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="baseline"
        flexWrap="wrap"
        p={2}
        mt={3}
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

export { Slide3 };
