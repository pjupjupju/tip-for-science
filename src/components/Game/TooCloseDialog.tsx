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
        Wow! To bylo FAKT blízko! Věděl*a jsi správnou odpověď, nebo se ti opravdu podařilo takhle dobře tipnout?
        Neboj, tvé score to neovlivní, ale pomůže nám to při vyhodnocování dat :)
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
