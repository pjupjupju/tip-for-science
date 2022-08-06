import React from 'react';
import { Box, Button, Text, Flex } from 'rebass';
import { getTutorialImageStyle } from '../commonStyleSheets';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import elephant from './../../assets/elephantTut.jpg';
import { SlideProps } from './types';
import { useHistory } from 'react-router';

const imageStyle = getTutorialImageStyle(elephant);

const Slide2 = ({ handleNextStep }: SlideProps) => {
  const history = useHistory();
  const handleClickHome = () => {
    history.push('/');
  };
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
        textAlign="center"
        py={4}
        px={3}
      >
        Největší známý slon byl zastřelen v roce 1956 v Angole. Řekněme, že
        předchozí hráči Tip for Science hádali, že toto obrovské zvíře vážilo{' '}
        <Text color="primary" as="span">
          8 300
        </Text>
        ,{' '}
        <Text color="primary" as="span">
          9 500
        </Text>
        , nebo{' '}
        <Text color="primary" as="span">
          15 000{' '}
        </Text>
        kg.
      </Text>
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
          Další ▶
        </Button>
      </Flex>
    </Container>
  );
};

export { Slide2 };
