import React from 'react';
import { Box, Text } from 'rebass';

const GameOverScreen = () => (
  <Box>
    <Text color="secondary" textAlign="center" px={3} my={3} fontWeight="bold">
      Game Over!{' '}
      <span role="img" aria-label="emoji with dead face">
        😵
      </span>
    </Text>
  </Box>
);

export { GameOverScreen };
