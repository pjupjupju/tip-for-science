import React from 'react';
import { Text, Box, Flex } from 'rebass';
import NumberFormat from 'react-number-format';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import washington from './../../assets/washingtonTut.jpg';
import { ScoreChart } from '../ScoreChart';
import { SlideProps } from './types';
import { getScore } from '../../helpers';
import { getTutorialImageStyle } from '../commonStyleSheets';
import { FunFact } from './../Game/FunFact';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';
import { FormattedMessage, useIntl } from 'react-intl';
import ScoreMessage from '../ScoreMessage';

const imageStyle = getTutorialImageStyle(washington);

const Slide10 = ({ handleNextStep, currentTip }: SlideProps) => {
  const intl = useIntl();
  const fact = intl.formatMessage({
    id: 'app.tutorial.slide.ffwash',
    defaultMessage: `Washington's head measures {correct} meters. The original plan for the sculptures was to depict prominent figures of the American West, including Native Americans. The presidents were eventually depicted to give the statue a "broader meaning".`,
    description: 'Tut10 washington funfact',
  });
  const correctAnswer = 18.29;
  const previousTips = [28, 105];
  const questionScore = getScore(
    typeof currentTip === 'undefined' ? 0 : currentTip,
    18.29
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
          <FormattedMessage
            id="app.tutorial.slide.metersq"
            defaultMessage="meters?"
            description="Tut10 meters?"
          />{' '}
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

export { Slide10 };
