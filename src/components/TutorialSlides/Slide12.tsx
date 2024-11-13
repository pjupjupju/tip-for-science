import React from 'react';
import { Text, Box, Flex } from 'rebass';
import { Container } from '../Container';
import { SlideProps } from './types';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';
import { FormattedMessage } from 'react-intl';

const Slide12 = ({ handleNextStep }: SlideProps) => {
  return (
    <Container>
      <Box p="4" my="auto">
        <Text
          fontSize={[3, 4, 5]}
          color="secondary"
          textAlign="center"
          mb="4"
          mt="4"
        >
          <FormattedMessage
            id="app.tutorial.slide.apes"
            defaultMessage="This game is one big experiment in cultural evolution. Interested
            us how this species of extremely cooperative apes finds the optimum
            strategy when only group intelligence is available."
            description="Tut12 apes"
          />
        </Text>
      </Box>
      <Flex mt="auto" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Flex>
    </Container>
  );
};

export { Slide12 };
