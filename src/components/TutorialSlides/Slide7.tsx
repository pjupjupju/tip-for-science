import React from 'react';
import { Button, Image, Text } from 'rebass';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import wildchart from './../../assets/slide5_graf.jpg';
import { SlideProps } from './types';

const imageStyle = {
  minHeight: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide7 = ({ handleNextStep }: SlideProps) => {
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
          Tady můžeš vidět celý graf toho, jak funguje distribuce bodů:
        </Text>
      </TutorialHeader>
      <Image src={wildchart} sx={imageStyle} />
      <Button onClick={handleClickNext}>Další</Button>
    </Container>
  );
};

export { Slide7 };
