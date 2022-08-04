import React from 'react';
import { Button, Text, Box } from 'rebass';
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

const imageStyle = {
  flexShrink: 1,
  flexGrow: 1,
  backgroundImage: `url(${washington})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const Slide10 = ({ handleNextStep, currentTip }: SlideProps) => {
  const correctAnswer = 18.29;
  const previousTips = [28, 105];
  const handleClickNext = () => {
    handleNextStep();
  };

  const questionScore = getScore(
    typeof currentTip === 'undefined' ? 0 : currentTip,
    18.29
  );
  return (
    <Container>
      <TutorialHeader>
        <Text fontSize={[3, 4, 5]} color="accent" textAlign="center" p={3}>
          {currentTip} metrů?{' '}
          <Text color="secondary" as="span">
            {questionScore === 0 && getScoreSentence(zeroScoreSentence)}
            {questionScore !== null &&
              questionScore > 0 &&
              questionScore < 0.4 &&
              getScoreSentence(lowScoreSentence)}
            {questionScore !== null &&
              questionScore >= 0.4 &&
              questionScore < 0.8 &&
              getScoreSentence(highScoreSentence)}
            {questionScore !== null &&
              questionScore >= 0.8 &&
              questionScore < 0.95 &&
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
      <Button mt="auto" onClick={handleClickNext}>
        Další
      </Button>
    </Container>
  );
};

export { Slide10 };
