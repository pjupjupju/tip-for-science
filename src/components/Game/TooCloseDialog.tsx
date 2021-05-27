import React from 'react';
import { Box, Button, Flex, Text } from 'rebass';

const TooCloseDialog = ({
  onGuessed,
  onKnewIt,
}: {
  onGuessed: Function;
  onKnewIt: Function;
}) => {
  const handleClickGuessed = () => {
    onGuessed();
  };
  const handleClickKnewIt = () => {
    onKnewIt();
  };
  return (
    <Box>
      <Text color="secondary" textAlign="center" px={3} my={3} fontWeight="bold">
        Wow! That was close! Did you knew the right answer or did you get lucky?
        This will not affect your score but it will help us to precise our model
        of evolution.
      </Text>
      <Flex justifyContent="space-between">
        <Button onClick={handleClickGuessed} mx={3}>
          I guessed it
        </Button>
        <Button onClick={handleClickKnewIt} mx={3}>
          I knew it!
        </Button>
      </Flex>
    </Box>
  );
};

export { TooCloseDialog };
