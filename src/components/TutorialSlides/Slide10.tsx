import React from 'react';
import { Button, Image, Text, Box } from 'rebass';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import elephant from './../../assets/slide1_elephant.jpg';
import { ScoreChart } from '../ScoreChart';
import { SlideProps } from './types';

const imageStyle = {
  minHeight: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide10 = ({ handleNextStep, currentTip }: SlideProps) => {
  const correctAnswer = 18.29;
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Container>
      <TutorialHeader>
        <Text
          fontSize={[3, 4, 5]}
          color="secondary"
          textAlign="center"
          p={3}
        >
          {currentTip} kg? těsně vedle.
        </Text>
      </TutorialHeader>
      <Image src={elephant} sx={imageStyle} />
      <Box width="100%" height="200px">
        {typeof currentTip !== 'undefined' && (
          <ScoreChart currentTip={currentTip} correctAnswer={correctAnswer} />
        )}
      </Box>
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

export { Slide10 };
