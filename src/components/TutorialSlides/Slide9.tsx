import React, { KeyboardEvent } from 'react';
import { Flex, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import washington from './../../assets/game_washington.jpg';
import { PreviousTips } from '../Game/PreviousTips';
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

const question =
  'Jak vysoká je hlava George Washingtona v sousoší Mt. Rushmore?';
const image = washington;
const unit = 'm';
const previousTips = [28, 105];

const Slide9 = ({ onSubmit = () => {} }: SlideProps) => {
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit(Number(event.currentTarget.value));
    }
  };

  return (
    <Container>
      <TutorialHeader>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" p={3}>
          Nyní máš k dispozici i předchozí tipy.
          <br />
          {question}
        </Text>
      </TutorialHeader>
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
    </Container>
  );
};

export { Slide9 };
