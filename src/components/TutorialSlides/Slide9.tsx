import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Box, Flex, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import washington from './../../assets/game_washington.jpg';
import { PreviousTips } from '../Game/PreviousTips';

interface Slide9Props {
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

const inputStyles2 = {
  '::placeholder': {
    color: '#000',
  },
  color: '#000',
  background: 'white',
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

const question =
  'Nyní vidíš i dvě předchozí odpovědi na otázku jak vysoká je hlava George Washingtona v sousoší Mt. Rushmore. ';
const image = washington;
const unit = 'm';
const previousTips = [28, 105];

const Slide9 = ({ onSubmit = () => {} }: Slide9Props) => {
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    onSubmit(Number(event.currentTarget.value));
  };

  const timeoutRef = useRef<number>();

  const [timeLimitEnded, setTimeLimitEnded] = useState(false);
  useEffect(() => {
    if (timeoutRef.current == null) {
      timeoutRef.current = setTimeout(() => {
        setTimeLimitEnded(true);
      }, 3 * 1000);
    }
    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }
    };
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
      <PreviousTips previousTips={previousTips} />
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
    </Flex>
  );
};

export { Slide9 };
