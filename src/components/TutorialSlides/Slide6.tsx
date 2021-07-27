import React from 'react';
import { Button, Image, Text } from 'rebass';
import { getScore } from '../../helpers';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import wildchart from './../../assets/slide5_graf.jpg';
import { SlideProps } from './types';

const imageStyle = {
  minHeight: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide6 = ({ handleNextStep, currentTip }: SlideProps) => {
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
          Za svou odpověď bys dostal/a {typeof currentTip !== "undefined" ? getScore(currentTip,11000).toFixed(3) : 0} bodu.
        </Text>
      </TutorialHeader>
      <Image src={wildchart} sx={imageStyle} />
      <Text
        fontSize={[3, 4, 5]}
        fontWeight="bold"
        color="secondary"
        textAlign="center"
        py={4}
        px={3}
      >
        Body získáš, pokud se trefíš mezi 50 - 200 % hodnoty správné odpovědi.
      </Text>
      <Button onClick={handleClickNext}>Další</Button>
    </Container>
  );
};

export { Slide6 };
