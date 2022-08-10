import React from 'react';
import { Button, Image, Text, Flex } from 'rebass';
import washington from './../../assets/washingtonTutF.jpg';
import elephant from './../../assets/elephantTutF.jpg';
import jupiter from './../../assets/jupiterTutF.jpg';
import { SlideProps } from './types';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { useHistory } from 'react-router';

const Slide1 = ({ handleNextStep }: SlideProps) => {
  const history = useHistory();
  const handleClickHome = () => {
    history.push('/');
  };
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
      <Flex flexDirection="column" pt={3} pb={4}>
        <Flex justifyContent="center" alignItems="center">
          <Image
            src={elephant}
            sx={{
              width: ['calc(15vh)', 'calc(20vh)'],
              height: ['calc(15vh)', 'calc(20vh)'],
              borderRadius: '50%',
              flexShrink: 0,
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
        <Flex justifyContent="center" alignItems="center">
          <Text
            fontSize={[3, 4, 4]}
            color="secondary"
            textAlign="center"
            mb={4}
            p={4}
          >
            ...jak velká je hlava George Washingtona
            <br />
            v sousoší Mount Rushmore?
          </Text>
          <Image
            src={washington}
            sx={{
              width: ['calc(15vh)', 'calc(20vh)'],
              height: ['calc(15vh)', 'calc(20vh)'],
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <Image
            src={jupiter}
            sx={{
              width: ['calc(15vh)', 'calc(20vh)'],
              height: ['calc(15vh)', 'calc(20vh)'],
              borderRadius: '50%',
              flexShrink: 0,
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
          Další
        </Button>
      </Flex>
    </Container>
  );
};

export { Slide1 };
