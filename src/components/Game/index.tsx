import React, { useState, KeyboardEvent } from 'react';
import { Box, Flex, Heading, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';

interface Settings {
  question: string;
  image: string;
  previousTips: number[];
  correctAnswer: number;
  timeLimit: number;
  unit: string;
}

interface GameProps {
  onFinish: Function;
  onSubmit: Function;
  settings: Settings;
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
  height: 'calc(30vh)',
  width: 'calc(30vh)',
  alignSelf: 'center',
};

const labelStyle = {
  flexGrow: 0,
  flexShrink: 0,
  width: 'auto',
  color: 'white',
};

const previousTipStyle = {
  background: "pink",
  mr: 1,
  p: 1,
}

const Game = ({
  settings: { question, image, previousTips, unit },
}: GameProps) => {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setSubmitted(true);
    }
  };
  return !submitted ? (
    <Flex flexDirection="column">
      <Box>
        <Heading
          textAlign="center"
          color="lightgray"
          fontFamily="Impact"
          fontSize={80}
        >
          {question}
        </Heading>
      </Box>
      <Image src={image} sx={imageStyle} />
      {previousTips != null && previousTips.length !== 0 && (
        <>
          <Text textAlign="center" color="pink" mb={1}>Předchozí tipy: </Text>
          <Flex justifyContent="center" mb={1}>
            {previousTips.map((previousTip) => (
              <Text sx={previousTipStyle}>{previousTip}</Text>
            ))}
          </Flex>
        </>
      )}
      <Flex justifyContent="center" alignItems="center">
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
  ) : (
    <Flex flexDirection="column">
      <Box>
        <Heading
          textAlign="center"
          color="lightgray"
          fontFamily="Impact"
          fontSize={40}
        >
          Total score:
        </Heading>
      </Box>
      <Image src={image} sx={imageStyle} />
      <Flex justifyContent="center" alignItems="center">
        <Text color="white">Tady bude graf a pod tím nějaký fun fact.</Text>
      </Flex>
    </Flex>
  );
};

export { Game };
