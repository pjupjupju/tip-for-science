import React from 'react';
import { Box, Text, Flex } from 'rebass';
import { getTutorialImageStyle } from '../commonStyleSheets';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import elephant from './../../assets/elephantTut.jpg';
import { SlideProps } from './types';
import { FormattedMessage } from 'react-intl';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';

const imageStyle = getTutorialImageStyle(elephant);

const Slide2 = ({ handleNextStep }: SlideProps) => {
  return (
    <Container>
      <TutorialHeader>
        <Text
          fontSize={[3, 4, 5]}
          color="secondary"
          textAlign="center"
          px={3}
          py={4}
        >
          <FormattedMessage
            id="app.tutorial.slide.guess"
            defaultMessage="Fear not, the correct answers will soon be revealed! But first, why not take a guess..."
            description="Tut2 guess"
          />
        </Text>
      </TutorialHeader>
      <Box sx={imageStyle} />
      <Text
        fontSize={[3, 4, 4]}
        color="secondary"
        textAlign="center"
        py={4}
        px={3}
      >
        <FormattedMessage
          id="app.tutorial.slide.ffeleph"
          defaultMessage="The largest known elephant was shot dead in 1956 in Angola. Let's say the previous players of Tip for Science guessed that this colossal creature weighed"
          description="Tut2 ffeleph"
        />{' '}
        <Text color="primary" as="span">
          8 300
        </Text>
        ,{' '}
        <Text color="primary" as="span">
          9 500
        </Text>
        ,{' '}
        <FormattedMessage
          id="app.tutorial.slide.or"
          defaultMessage="or"
          description="Tut2 or"
        />{' '}
        <Text color="primary" as="span">
          15 000{' '}
        </Text>
        <FormattedMessage
          id="app.tutorial.slide.elekg"
          defaultMessage="kg"
          description="Tut2 kg"
        />
        .
      </Text>
      <Flex mt="auto" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Flex>
    </Container>
  );
};

export { Slide2 };
