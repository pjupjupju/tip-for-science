import React from 'react';
import { Text, Box, Flex } from 'rebass';
import { Container } from '../Container';
import { SlideProps } from './types';
import { NextButton } from './NextButton';
import { HomeButton } from './HomeButton';
import { FormattedMessage } from 'react-intl';

const Slide7 = ({ handleNextStep }: SlideProps) => {
  return (
    <Container>
      <Box p="4" my="auto">
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" mb="4">
          <FormattedMessage
            id="app.tutorial.slide.evolution"
            defaultMessage="This game is a model of evolution."
            description="Tut7 evolution"
          />
        </Text>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" mb="4">
          <FormattedMessage
            id="app.tutorial.slide.population"
            defaultMessage="Your tips and other players' tips make up the population. Within them, individual tips fight for survival, look for partners, and reproduce."
            description="Tut7 population"
          />
        </Text>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" mb="4">
          <FormattedMessage
            id="app.tutorial.slide.survive"
            defaultMessage="The ones that survive can be shown to you as a previous tip."
            description="Tut7 survive"
          />
        </Text>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center">
          <FormattedMessage
            id="app.tutorial.slide.shown"
            defaultMessage="And your tip can be seen by someone else."
            description="Tut7 shown"
          />
        </Text>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center">
          <FormattedMessage
            id="app.tutorial.slide.notshown"
            defaultMessage="...and sometimes you won't see any tip."
            description="Tut7 notshown"
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

export { Slide7 };
