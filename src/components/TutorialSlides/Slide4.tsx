import React from 'react';
import { Button, Image, Text } from 'rebass';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import elephant from './../../assets/slide1_elephant.jpg';
import { SlideProps } from './types';

const imageStyle = {
  minHeight: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide4 = ({ handleNextStep, currentTip }: SlideProps) => {
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
          {currentTip} kg? těsně vedle!
        </Text>
      </TutorialHeader>
      <Image src={elephant} sx={imageStyle} />
      <Text
        fontSize={[3, 4, 5]}
        fontWeight="bold"
        color="secondary"
        textAlign="center"
        py={4}
        px={3}
      >
        Největší samec slona, jehož váhu se podařilo zaznamenat, vážil zhruba
        11 000 kg a v kohoutku měřil 3,96 metru. Byl tedy téměř o metr vyšší než
        průměrný slon africký.
      </Text>
      <Button onClick={handleClickNext}>Další</Button>
    </Container>
  );
};

export { Slide4 };
