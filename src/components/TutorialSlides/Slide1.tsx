import React from 'react';
import { Button, Image, Text, Flex } from 'rebass';
import washington from './../../assets/washingtonTutF.jpg';
import elephant from './../../assets/elephantTutF.jpg';
import jupiter from './../../assets/jupiterTutF.jpg';
import { SlideProps } from './types';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';

const Slide1 = ({ handleNextStep }: SlideProps) => {
  // obsah () se pak muze smazat, je to tu pro hloupe lidi
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Container>
      <TutorialHeader centerVertically={false}>
        <Text
          fontSize={[3, 4, 5]}
          color="secondary"
          textAlign="center"
          fontWeight="bold"
          mb={4}
          p={4}
        >
          Zajímalo by tě...
        </Text>
      </TutorialHeader>
      <Flex flexDirection="column">
        <Flex justifyContent="flex-start">
          <Image
            src={elephant}
            sx={{
              width: 'calc(20vh)',
            }}
          />
          <Text
            fontSize={[3, 4, 4]}
            color="secondary"
            textAlign="center"
            mb={4}
            p={4}
          >
            ...kolik vážil nejtěžší slon v historii?
          </Text>
        </Flex>
        <Flex justifyContent="flex-end">
          <Text
            fontSize={[3, 4, 4]}
            color="secondary"
            textAlign="center"
            mb={4}
            p={4}
          >
            ...jak velká je hlava George Washingtona
            <br />v sousoší Mount Rushmore?
          </Text>
          <Image
            src={washington}
            sx={{
              width: 'calc(20vh)',
            }}
          />
        </Flex>
        <Flex justifyContent="flex-start">
          <Image
            src={jupiter}
            sx={{
              width: 'calc(20vh)',
            }}
          />
          <Text
            fontSize={[3, 4, 4]}
            color="secondary"
            textAlign="center"
            mb={4}
            p={4}
          >
            ...jak rychle se pohybuje Jupiter?
          </Text>
        </Flex>
      </Flex>
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

export { Slide1 };
