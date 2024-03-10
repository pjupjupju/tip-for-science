import React from 'react';
import { Text, Box, Flex } from 'rebass';
import NumberFormat from 'react-number-format';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import washington from './../../assets/washingtonTut.jpg';
import { ScoreChart } from '../ScoreChart';
import { SlideProps } from './types';
import {
  getScore,
  getScoreSentence,
  topScoreSentence,
  highScoreSentence,
  lowScoreSentence,
  zeroScoreSentence,
} from '../../helpers';
import { getTutorialImageStyle } from '../commonStyleSheets';
import { FunFact } from './../Game/FunFact';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';

const imageStyle = getTutorialImageStyle(washington);

const fact =
  'Washingtonova hlava měří {correct} metrů. Prvotní plán sousoší měl zobrazit významné postavy amerického Západu včetně původních obyvatel. Prezidenti nakonec byli zobrazeni, aby sousoší mělo "širší význam".';

const Slide10 = ({ handleNextStep, currentTip }: SlideProps) => {
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
          metrů?{' '}
          <Text color="secondary" as="span">
            {questionScore === 0 && getScoreSentence(zeroScoreSentence)}
            {questionScore !== null &&
              questionScore > 0 &&
              questionScore < 40 &&
              getScoreSentence(lowScoreSentence)}
            {questionScore !== null &&
              questionScore >= 40 &&
              questionScore < 80 &&
              getScoreSentence(highScoreSentence)}
            {questionScore !== null &&
              questionScore >= 80 &&
              questionScore < 95 &&
              getScoreSentence(topScoreSentence)}
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
