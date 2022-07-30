import React from 'react';
import { Button, Image, Text } from 'rebass';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import elephant from './../../assets/elephantTut.jpg';
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
  minHeight: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide4 = ({ handleNextStep, currentTip }: SlideProps) => {
  const handleClickNext = () => {
    handleNextStep();
  };

  const questionScore = getScore(
    typeof currentTip === 'undefined' ? 0 : currentTip,
    10886
  );
  return (
    <Container>
      <TutorialHeader>
        <Text fontSize={[3, 4, 5]} color="accent" textAlign="center" p={2}>
          {currentTip} kg?{' '}
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
      <Image src={elephant} sx={imageStyle} />
      <Text
        fontSize={[3, 4, 4]}
        color="secondary"
        textAlign="center"
        py={4}
        px={3}
      >
        Největší samec slona, jehož váhu se podařilo zaznamenat, vážil zhruba
        10 886 kg a v kohoutku měřil 3,96 metru. Byl tedy téměř o metr vyšší než
        průměrný slon africký.
      </Text>
      <Button
        mt="auto"
        sx={{ position: ['initial', 'initial', 'relative'], top: '-30px' }}
        onClick={handleClickNext}
      >
        Další
      </Button>
    </Container>
  );
};

export { Slide4 };
