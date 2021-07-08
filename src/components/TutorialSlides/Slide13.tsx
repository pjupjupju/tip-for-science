import React, { KeyboardEvent, useEffect, useRef } from 'react';
import { Box, Flex, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import washington from './../../assets/game_washington.jpg';
import { PreviousTips } from '../Game';

interface Slide13Props {
  onSubmit?: (value: number) => void;
  currentTip?: number;
  step: number;
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
  height: '210px',
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

const Slide13 = ({ onSubmit = () => {} }: Slide13Props) => {
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    onSubmit(Number(event.currentTarget.value));
  };
  const timeoutRef = useRef<number>();
  
  useEffect(() => {    
      timeoutRef.current = setTimeout(() => {
        onSubmit(0);
      }, timeLimit * 1000);
  });

  return (
    <Flex flexDirection="column" height="100%">
      <Box height="80px">
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
    </Flex>
  );
};

export { Slide13 };
