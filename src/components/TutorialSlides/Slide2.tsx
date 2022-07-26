import React from 'react';
import { Box, Button, Image, Text } from 'rebass';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import elephant from './../../assets/slide1_elephant.jpg';
import { SlideProps } from './types';

const imageStyle = {
  flexShrink: 1,
  flexGrow: 1,
  backgroundImage: `url(${elephant})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const Slide2 = ({ handleNextStep }: SlideProps) => {
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
          px={3}
          py={4}
        >
          Neboj, správné odpovědi se brzy dozvíš! Nejdřív ale zkus hádat...
        </Text>
      </TutorialHeader>
      <Box sx={imageStyle} />
      <Text
        fontSize={[3, 4, 4]}
        color="secondary"
        textAlign="center" // shlm: zarovnat next button dolů
        py={4}
        px={3}
      >
        Největší známý slon byl zastřelen v roce 1956 v Angole. Předchozí hráči
        Tip for Science hádali, že toto obrovské zvíře vážilo{' '}
        <Text color="accent" as="span">
          8 300
        </Text>
        ,{' '}
        <Text color="accent" as="span">
          9500
        </Text>
        , nebo{' '}
        <Text color="accent" as="span">
          15 000{' '}
        </Text>
        kg.
      </Text>
      <Button
        sx={{ position: ['initial', 'initial', 'relative'], top: '-20px' }}
        onClick={handleClickNext}
      >
        Další
      </Button>
    </Container>
  );
};

export { Slide2 };
