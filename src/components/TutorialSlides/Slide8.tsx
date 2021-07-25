import React from 'react';
import { Box, Button, Text } from 'rebass';
import { Container } from '../Container';
import { SlideProps } from './types';

const Slide8 = ({ handleNextStep }: SlideProps) => {
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Container>
      <Box p="4">
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
          mb="4"
        >
          Tato hra je modelem evoluce.
        </Text>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
          mb="4"
        >
          Tvé tipy a tipy ostatních hráčů tvoří populace. V rámci nich
          jednotlivé tipy bojují o přežití, hledají partnery, množí se.
        </Text>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
        >
          Několik z nich uvidíš pokaždé jako nápovědu společně s otázkou. *tohle
          všechno zní česky hrozně divně a můj mozek je nyní příliš v
          programátorském módu na to abych vymýšlelo kvalitní copy :D*
        </Text>
      </Box>
      <Button onClick={handleClickNext}>Další</Button>
    </Container>
  );
};

export { Slide8 };
