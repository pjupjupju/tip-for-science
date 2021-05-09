import React from 'react';
import { Box, Text } from 'rebass';

const GameOverScreen = () => (
  <Box>
    <Text>
      Game Over!{' '}
      <span role="img" aria-label="emoji with dead face">
        😵
      </span>
    </Text>
  </Box>
);

export { GameOverScreen };
