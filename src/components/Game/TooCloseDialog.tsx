import React from 'react';
import { Button, Flex, Text, Box } from 'rebass';
import { Container } from '../Container';

const translucentBox = {
  background: 'rgba(0,0,0,0.85)',
  position: 'absolute',
  top: 0,
  left: 0,
};

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
    <Box width="100%" height="100%" sx={translucentBox}>
      <Container>
        <Flex
          p={3}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Text fontWeight={500} textAlign="center" my={3} color="white">
            Wow! To bylo FAKT blízko! Věděl*a jsi správnou odpověď, nebo se ti
            opravdu podařilo takhle dobře tipnout?
            <br />
            Neboj, tvé skóre to neovlivní, ale pomůže nám to při vyhodnocování
            dat :)
          </Text>
          <Flex justifyContent="space-between" width="100%">
            <Button onClick={handleClickGuessed}>Tipnul*a jsem</Button>
            <Button onClick={handleClickKnewIt}> Věděl*a jsem</Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export { TooCloseDialog };
