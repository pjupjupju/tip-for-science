import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Flex, Box, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import jupiter from './../../assets/jupiterTut.jpg';
import { PreviousTips } from '../Game';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { SlideProps } from './types';
import { SubmitButton } from '../SubmitButton';
import { getTutorialImageStyle } from '../commonStyleSheets';

const imageStyle = getTutorialImageStyle(jupiter);

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

const question = 'Jak rychle se otáčí Jupiter? A pozor, běží ti čas!';
const unit = 'km/h';
const previousTips = [80000, 1000, 500, 20000];
const timeLimit = 10;

const Slide13 = ({ onSubmit }: SlideProps) => {
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
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
      <Box sx={imageStyle} />
      <PreviousTips previousTips={previousTips} unit={unit} />
      <Flex justifyContent="center" alignItems="baseline" p={2}>
        <Label htmlFor="tip" sx={labelStyle}>
          tip:
        </Label>
        <Input
          id="tip"
          name="tip"
          type="number"
          placeholder="tvůj tip"
          sx={inputStyles}
          onKeyDown={handleSubmit}
        />
        <Text color="white" mr={2}>
          {unit}
        </Text>{' '}
        <SubmitButton />
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
            Vypršel ti čas! Tentokrát ale ještě můžeš zadat odpověď zde:
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
