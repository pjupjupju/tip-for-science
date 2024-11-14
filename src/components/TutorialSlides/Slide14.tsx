import React from 'react';
import { Text, Box, Flex } from 'rebass';
import NumberFormat from 'react-number-format';
import { Container } from '../Container';
import { ScoreChart } from '../ScoreChart';
import { TutorialHeader } from '../TutorialHeader';
import { getTutorialImageStyle } from '../commonStyleSheets';
import jupiter from './../../assets/jupiterTut.jpg';
import { SlideProps } from './types';
import { getScore } from '../../helpers';
import { FunFact } from './../Game/FunFact';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';
import { useIntl } from 'react-intl';
import ScoreMessage from '../ScoreMessage';

const imageStyle = getTutorialImageStyle(jupiter);

const Slide14 = ({ handleNextStep, currentTip }: SlideProps) => {
  const intl = useIntl();
  const fact = intl.formatMessage({
    id: 'app.tutorial.slide.ffjupiter',
    defaultMessage: `This gas giant rotates at a speed of {correct} km/h at the equator. 
    One day on Jupiter lasts just under 10 hours, and it completes an orbit around the Sun in approximately 12 Earth years.`,
    description: 'Tut14 ffjupiter',
  });
  const unit = intl.formatMessage({
    id: 'app.unitkmh',
    defaultMessage: `km/h`,
    description: 'unit km/h',
  });
  const correctAnswer = 45583;
  const previousTips = [80000, 1000, 500, 20000];
  const questionScore = getScore(
    typeof currentTip === 'undefined' ? 0 : currentTip,
    45583
  );
  return (
    <Container>
      <TutorialHeader>
        <Text fontSize={[3, 4, 5]} color="accent" textAlign="center" p={3}>
          <NumberFormat
            value={currentTip}
            displayType={'text'}
            thousandSeparator={' '}
          />{' '}
          {unit}?{' '}
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
      <Box width="100%" height="200px">
        {typeof currentTip !== 'undefined' && (
          <ScoreChart
            currentTip={currentTip}
            correctAnswer={correctAnswer}
            previousTips={previousTips}
          />
        )}
      </Box>
      <FunFact correctAnswer={correctAnswer} fact={fact} />
      <Flex mt="auto" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Flex>
    </Container>
  );
};

export { Slide14 };
