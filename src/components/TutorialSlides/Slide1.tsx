import React from 'react';
import { Image, Text, Flex } from 'rebass';
import washington from './../../assets/washingtonTutF.jpg';
import elephant from './../../assets/elephantTutF.jpg';
import jupiter from './../../assets/jupiterTutF.jpg';
import { SlideProps } from './types';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { FormattedMessage } from 'react-intl';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';

const Slide1 = ({ handleNextStep }: SlideProps) => {
  return (
    <Container>
      <TutorialHeader centerVertically={false}>
        <Text
          fontSize={[3, 4, 5]}
          color="secondary"
          textAlign="center"
          fontWeight="bold"
          mb={4}
          p={4}
        >
          <FormattedMessage
            id="app.tutorial.slide.curious"
            defaultMessage="Are you curious..."
            description="Tut1 curious"
          />
        </Text>
      </TutorialHeader>
      <Flex flexDirection="column" pt={3} pb={4}>
        <Flex justifyContent="center" alignItems="center">
          <Image
            src={elephant}
            sx={{
              width: ['calc(15vh)', 'calc(20vh)'],
              height: ['calc(15vh)', 'calc(20vh)'],
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
          <Text
            fontSize={[3, 4, 4]}
            color="secondary"
            textAlign="center"
            mb={4}
            p={4}
          >
            <FormattedMessage
              id="app.tutorial.slide.eleph"
              defaultMessage="...to find out the weight of the heaviest elephant ever recorded in the annals of history?"
              description="Tut1 elephant"
            />
          </Text>
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <Text
            fontSize={[3, 4, 4]}
            color="secondary"
            textAlign="center"
            mb={4}
            p={4}
          >
            <FormattedMessage
              id="app.tutorial.slide.wash"
              defaultMessage="...about the monumental size of George Washington's head at Mount Rushmore?"
              description="Tut1 washington"
            />
          </Text>
          <Image
            src={washington}
            sx={{
              width: ['calc(15vh)', 'calc(20vh)'],
              height: ['calc(15vh)', 'calc(20vh)'],
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <Image
            src={jupiter}
            sx={{
              width: ['calc(15vh)', 'calc(20vh)'],
              height: ['calc(15vh)', 'calc(20vh)'],
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
          <Text
            fontSize={[3, 4, 4]}
            color="secondary"
            textAlign="center"
            mb={4}
            p={4}
          >
            <FormattedMessage
              id="app.tutorial.slide.jupiter"
              defaultMessage="...how swiftly does Jupiter race across the space?"
              description="Tut1 jupiter"
            />
          </Text>
        </Flex>
      </Flex>
      <Flex mt="auto" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Flex>
    </Container>
  );
};

export { Slide1 };
