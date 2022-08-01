import React from 'react';
import { Button, Text, Box } from 'rebass';
import { Container } from '../Container';
import { ScoreChart } from '../ScoreChart';
import { TutorialHeader } from '../TutorialHeader';
import { getTutorialImageStyle } from '../commonStyleSheets';
import jupiter from './../../assets/jupiterTut.jpg';
import { SlideProps } from './types';
import {
  getScore,
  getScoreSentence,
  topScoreSentence,
  highScoreSentence,
  lowScoreSentence,
  zeroScoreSentence,
} from '../../helpers';

const imageStyle = getTutorialImageStyle(jupiter);

const Slide14 = ({ handleNextStep, currentTip }: SlideProps) => {
  const correctAnswer = 45583;
  const handleClickNext = () => {
    handleNextStep();
  };
  const questionScore = getScore(
    typeof currentTip === 'undefined' ? 0 : currentTip,
    45583
  );
  return (
    <Container>
      <TutorialHeader>
        <Text fontSize={[3, 4, 5]} color="accent" textAlign="center" p={3}>
          {currentTip} km/h?{' '}
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
      </TutorialHeader>
      <Box sx={imageStyle} />
      <Box width="100%" height="200px">
        {typeof currentTip !== 'undefined' && (
          <ScoreChart currentTip={currentTip} correctAnswer={correctAnswer} />
        )}
      </Box>
      <Button mt="auto" onClick={handleClickNext}>
        Další
      </Button>
    </Container>
  );
};

export { Slide14 };
