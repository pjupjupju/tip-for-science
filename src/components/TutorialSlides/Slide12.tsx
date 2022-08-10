import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Text, Box, Flex } from 'rebass';
import { Container } from '../Container';
import { SlideProps } from './types';

const Slide12 = ({ handleNextStep }: SlideProps) => {
  const history = useHistory();
  const handleClickHome = () => {
    history.push('/');
  };
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Container>
      <Box p="4" my="auto">
        <Text
          fontSize={[3, 4, 5]}
          color="secondary"
          textAlign="center"
          mb="4"
          mt="4"
        >
          Tato hra je jeden velký experiment v rámci kulturní evoluce. Zajímá
          nás, jak tento druh extrémně spolupracujících opic nalezne optimální
          strategii, když bude mít k dispozici pouze skupinovou inteligenci.
        </Text>
      </Box>
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

export { Slide12 };
