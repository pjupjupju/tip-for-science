import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Flex, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import washington from './../../assets/game_washington.jpg';
import { PreviousTips } from '../Game';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { SlideProps } from './types';

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

const imageStyle = {
  minHeight: '210px',
  width: '100%',
  alignSelf: 'center',
};

const labelStyle = {
  flexGrow: 0,
  flexShrink: 0,
  width: 'auto',
  color: 'white',
};

const question = 'Jak rychle se pohybuje jupiter? Pozor, běží ti čas!';
const image = washington;
const unit = 'km/h';
const previousTips = [80000, 1000, 500, 20000];
const timeLimit = 10;

const Slide13 = ({ onSubmit }: SlideProps) => {
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit(Number(event.currentTarget.value));
    }
  };
  const timeoutRef = useRef<number>();

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
    <Container>
      <TutorialHeader>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={3}
        >
          {question}
        </Text>
      </TutorialHeader>
      <Image src={image} sx={imageStyle} />
      <PreviousTips previousTips={previousTips} unit={unit} />
      <Flex justifyContent="center" alignItems="center" p={2}>
        <Label htmlFor="tip" sx={labelStyle}>
          tip:
        </Label>
        <Input
          id="tip"
          name="tip"
          type="number"
          placeholder="váš tip"
          sx={inputStyles}
          onKeyDown={handleSubmit}
        />
        <Text color="white">{unit}</Text>
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
          <Text fontWeight={500} textAlign="center" my={1} color="primary">
            Vypršel ti čas! Tentokrát ale ještě můžeš zadat odpověď zde:
          </Text>
          <Input
            id="tip2"
            name="tip"
            type="number"
            placeholder="váš tip"
            sx={inputStyles2}
            onKeyDown={handleSubmit}
          />
        </Flex>
      )}
    </Container>
  );
};

export { Slide13 };
