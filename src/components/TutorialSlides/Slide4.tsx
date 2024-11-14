import React from 'react';
import { Box, Text, Flex } from 'rebass';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import elephant from './../../assets/elephantTut.jpg';
import { SlideProps } from './types';
import { getScore } from '../../helpers';
import { getTutorialImageStyle } from '../commonStyleSheets';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';
import { FormattedMessage, useIntl } from 'react-intl';
import ScoreMessage from '../ScoreMessage';

const imageStyle = getTutorialImageStyle(elephant);

const Slide4 = ({ handleNextStep, currentTip }: SlideProps) => {
  const intl = useIntl();
  const unit = intl.formatMessage({
    id: 'app.unitkg',
    defaultMessage: 'kg',
    description: 'unit kg',
  });
  const questionScore = getScore(
    typeof currentTip === 'undefined' ? 0 : currentTip,
    10886
  );
  return (
    <Container>
      <TutorialHeader>
        <Text fontSize={[3, 4, 5]} color="accent" textAlign="center" p={2}>
          {currentTip} {unit}?{' '}
          <Text color="secondary" as="span">
            {questionScore === 0 && <ScoreMessage scoreType="score.zero" />}
            {questionScore !== null &&
              questionScore > 0 &&
              questionScore < 40 && <ScoreMessage scoreType="score.low" />}
            {questionScore !== null &&
              questionScore >= 40 &&
              questionScore < 80 && <ScoreMessage scoreType="score.high" />}
            {questionScore !== null &&
              questionScore >= 80 &&
              questionScore < 95 && <ScoreMessage scoreType="score.top" />}
          </Text>
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
          id="app.tutorial.slide.elemale"
          defaultMessage="The largest male elephant on record weighed "
          description="Tut4 elemale"
        />{' '}
        <Text color="white" as="span">
          10 886
        </Text>{' '}
        <FormattedMessage
          id="app.tutorial.slide.withers"
          defaultMessage="kg and his withers height was 3,96 meters. That made him a meter higher than an average african elephant!"
          description="Tut4 withers"
        />
      </Text>
      <Flex mt="auto" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Flex>
    </Container>
  );
};

export { Slide4 };
