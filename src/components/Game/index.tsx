import React, { useState } from 'react';
import { Box, Flex, Heading, Image } from 'rebass';
import { Label, Input } from '@rebass/forms'


interface Settings {
  question: string;
  image: string;
  previousTips: number[];
  correctAnswer: number;
  timeLimit: number;
}

interface GameProps {
  onFinish: Function;
  onSubmit: Function;
  settings: Settings;
}

const Game = ({ settings: { question, image } }: GameProps) => {
  const [submitted] = useState(false);
  return !submitted? (
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
      <Image src={image} />
      <Flex>
  <Label htmlFor='tip'>Tip:</Label>
  <Input
    id='tip'
    name='tip'
    type='number'
    placeholder='váš tip'
  />
</Flex>
    </Flex>
  ):null;
};

export { Game };
