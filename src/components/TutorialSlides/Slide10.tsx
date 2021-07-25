import React from 'react';
import { Button, Image, Text } from 'rebass';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import elephant from './../../assets/slide1_elephant.jpg';
import chart from './../../assets/slide5_graf.jpg';
import { SlideProps } from './types';

const imageStyle = {
  minHeight: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide10 = ({ handleNextStep }: SlideProps) => {
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Container>
      <TutorialHeader>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={3}
        >
          děvať? těsně vedle.
        </Text>
      </TutorialHeader>
      <Image src={elephant} sx={imageStyle} />
      <Image src={chart} sx={imageStyle} />
      <Button onClick={handleClickNext}>Další</Button>
    </Container>
  );
};

export { Slide10 };
