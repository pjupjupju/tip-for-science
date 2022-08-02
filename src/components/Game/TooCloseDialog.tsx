import React from 'react';
import { Button, Flex, Text } from 'rebass';
import { Container } from '../Container';
import { TranslucentBox } from '../TranslucentBox';

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
    <TranslucentBox>
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
    </TranslucentBox>
  );
};

export { TooCloseDialog };
