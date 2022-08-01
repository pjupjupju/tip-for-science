import React, { KeyboardEvent } from 'react';
import { Flex, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import elephant from './../../assets/elephantTut.jpg';
import { TutorialHeader } from '../TutorialHeader';
import { Container } from '../Container';
import { SlideProps } from './types';
import { SubmitButton } from '../SubmitButton';
import { getTutorialImageStyle } from '../commonStyleSheets';

const inputStyles = {
  '::placeholder': {
    color: 'white',
  },
  color: 'white',
  flex: 1,
  mx: 3,
};

const imageStyle = getTutorialImageStyle(elephant);

const labelStyle = {
  flexGrow: 0,
  flexShrink: 0,
  width: 'auto',
  color: 'white',
};

const question = 'Kolik vážil nejtěžší slon?';
const image = elephant;
const unit = 'kg';

const Slide3 = ({ onSubmit }: SlideProps) => {
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    console.log(event.key);
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
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" p={2}>
          {question}
        </Text>
      </TutorialHeader>
      <Image src={image} sx={imageStyle} />
      <Flex justifyContent="center" alignItems="baseline" p={2} marginTop={3}>
        <Label htmlFor="tip" sx={labelStyle}>
          tip:
        </Label>
        <Input
          id="tip"
          name="tip"
          type="number"
          pattern="[1-9]"
          inputMode="numeric"
          placeholder="tvůj tip"
          sx={inputStyles}
          onKeyDown={handleSubmit}
        />
        <Text color="white" mr={4}>
          {unit}
        </Text>{' '}
        <SubmitButton />
      </Flex>
    </Container>
  );
};

export { Slide3 };
