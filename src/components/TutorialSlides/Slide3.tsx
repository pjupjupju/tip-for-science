import React, { KeyboardEvent } from 'react';
import { Flex, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import elephant from './../../assets/slide1_elephant.jpg';
import { TutorialHeader } from '../TutorialHeader';
import { Container } from '../Container';
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

const question = 'Kolik vážil nejtěžší slon?';
const image = elephant;
const unit = 'kg';

const Slide3 = ({ onSubmit }: SlideProps) => {
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit(Number(event.currentTarget.value));
    }
  };

  return (
    <Container>
      <TutorialHeader>
        <Text
          fontSize={[3, 4, 5]}
          color="secondary"
          textAlign="center"
          p={2}
        >
          {question}
        </Text>
      </TutorialHeader>
      <Image src={image} sx={imageStyle} />
      <Flex justifyContent="center" alignItems="center" p={2}>
        <Label htmlFor="tip" sx={labelStyle}>
          tip:
        </Label>
        <Input
          id="tip" 
          name="tip"
          type="number" 
          placeholder="váš tip" //shlm: přidat submit tlačítko
          sx={inputStyles}
          onKeyDown={handleSubmit}
        />
        <Text color="white">{unit}</Text>
      </Flex> 
    </Container>
  );
};

export { Slide3 };
