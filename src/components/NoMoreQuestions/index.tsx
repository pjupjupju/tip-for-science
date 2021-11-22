import { Button, Flex, Heading, Text } from 'rebass';
import React from 'react';
import { Container } from '..';

interface NoMoreQuestionsProps {
  score: Number;
}

const NoMoreQuestions = ({ score }: NoMoreQuestionsProps) => (
  <Container>
    <Flex
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Heading my={4} color="primary" fontSize={4}>
        Toto byla prozatím poslední otázka.
        <br />
        Tvoje skóre:{' '}
        <Text color="turquoise" as="span">
          {score}
        </Text>
      </Heading>
      <Heading mb={3} color="white" fontSize={2}>
        Když doplníme další otázky, dámě ti vědět na tvůj registrační mail.
      </Heading>
      <Button>back</Button>
    </Flex>
  </Container>
);

export { NoMoreQuestions };
