import React, { KeyboardEvent } from 'react';
import { Box, Flex, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import elephant from './../../assets/slide1_elephant.jpg';

interface Slide3Props {
  onSubmit: (value: number) => void;
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

const question = 'Kolik vážil nejtěžší slon evaaaa?';
const image = elephant;
const unit = 'kg';

const Slide3 = ({ onSubmit }: Slide3Props) => {
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit(Number(event.currentTarget.value));
    }
  };

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

export { Slide3 };
