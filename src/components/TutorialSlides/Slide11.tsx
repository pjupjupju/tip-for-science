import React from 'react';
import { Text, Box, Flex } from 'rebass';
import { Container } from '../Container';
import { SlideProps } from './types';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';
import { FormattedMessage } from 'react-intl';

const Slide11 = ({ handleNextStep }: SlideProps) => {
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
            id="app.tutorial.slide.perfected"
            defaultMessage="We have almost perfected social transmission."
            description="Tut11 perfected"
          />
        </Text>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" mb="4">
          <FormattedMessage
            id="app.tutorial.slide.poets"
            defaultMessage="We learn from each other - we create, build, paint, write poems - inspired by painters, inventors, scientists and poets of the past."
            description="Tut11 poets"
          />
        </Text>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" mb="4">
          <FormattedMessage
            id="app.tutorial.slide.inheritance"
            defaultMessage="We take advantage of the cultural inheritance."
            description="Tut11 inheritance"
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

export { Slide11 };
