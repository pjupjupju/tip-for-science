import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Flex, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import jupiter from './../../assets/jupiterTut.jpg';
import { PreviousTips } from '../Game';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { SlideProps } from './types';
import { SubmitButton } from '../SubmitButton';
import { FormattedMessage, useIntl } from 'react-intl';

const imageStyle = {
  maxWidth: '100%',
  alignSelf: 'center',
  objectFit: 'contain',
};

const inputStyles = {
  '::placeholder': {
    color: 'white',
  },
  color: 'white',
  flex: 1,
  mx: 3,
};

const inputStyles2 = {
  '::placeholder': {
    color: '#000',
  },
  color: '#000',
  background: 'white',
};

const labelStyle = {
  flexGrow: 0,
  flexShrink: 0,
  width: 'auto',
  color: 'white',
};

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
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" p={3}>
          {question}
        </Text>
      </TutorialHeader>
      <Image src={jupiter} sx={imageStyle} />
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
          id="tip"
          name="tip"
          type="number"
          placeholder={placeholder}
          sx={inputStyles}
          onKeyDown={handleSubmit}
          ref={inputRef}
        />
        <Text color="white" mr={2}>
          {unit}
        </Text>{' '}
        <SubmitButton onClick={handleClickSubmit} timeLimit={timeLimit} />
      </Flex>
      {timeLimitEnded && (
        <Flex
          p={3}
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
          <Text fontWeight={500} textAlign="center" my={1} color="white">
            <FormattedMessage
              id="app.tutorial.slide.timesup"
              defaultMessage="Time’s up! But this time, you can still submit your answer here:"
              description="Tut13 times up"
            />
          </Text>
          <Input
            id="tip2"
            name="tip"
            type="number"
            placeholder="tvůj tip"
            sx={inputStyles2}
            onKeyDown={handleSubmit}
          />
        </Flex>
      )}
    </Container>
  );
};

export { Slide13 };
