import React from 'react';
import { Button, Text, Box, Flex } from 'rebass';
import NumberFormat from 'react-number-format';
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
import { useHistory } from 'react-router-dom';
import { FunFact } from './../Game/FunFact';

const imageStyle = getTutorialImageStyle(jupiter);

const fact =
  'Tento plynný obr se (na rovníku) otáčí rychlostí {correct} km/h. Jeden den na Jupiteru trvá necelých 10 hodin. Slunce oběhne za zhruba 12 pozemských let.';

const Slide14 = ({ handleNextStep, currentTip }: SlideProps) => {
  const correctAnswer = 45583;
  const previousTips = [80000, 1000, 500, 20000];
  const history = useHistory();
  const handleClickHome = () => {
    history.push('/');
  };
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
          <NumberFormat
            value={currentTip}
            displayType={'text'}
            thousandSeparator={' '}
          />{' '}
          km/h?{' '}
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
        <Button
          onClick={handleClickHome}
          backgroundColor={'#414141'}
          sx={{ flex: 1 }}
          mr="1"
        >
          Domů
        </Button>
        <Button onClick={handleClickNext} sx={{ flex: 5 }}>
          Další
        </Button>
      </Flex>
    </Container>
  );
};

export { Slide14 };
