import { Flex, Text, Button } from 'rebass';
import React from 'react';
import { Container } from '..';
import { useHistory } from 'react-router';
import { TranslucentBox } from '../TranslucentBox';

interface NoMoreQuestionsProps {
  score: Number;
}

const NoMoreQuestions = ({ score }: NoMoreQuestionsProps) => {
  const history = useHistory();
  const handleClickHome = () => {
    history.push('/');
  };
  const handleClickProfile = () => {
    history.push('/profile');
  };

  return (
    <TranslucentBox>
      <Container>
        <Flex
          p={3}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Text
            fontSize={4}
            fontWeight={500}
            textAlign="center"
            my={2}
            color="secondary"
          >
            Toto byla (prozatím) poslední otázka.
            <br />
            Tvoje skóre:{' '}
          </Text>
          <Text color="accent" as="span" fontSize={6} fontWeight={700}>
            {score}
          </Text>
          <Text fontWeight={500} textAlign="center" my={5} color="secondary">
            Až budou k dispozici další, dáme ti vědět na registrační e-mail.
            <br />Zkontrolovat nebo opravit jej můžeš v sekci "Profil".
          </Text>

          <Flex justifyContent="space-between" width="100%" mt={6}>
            <Button
              onClick={handleClickHome}
              sx={{ flex: 2 }}
              mr={1}
              backgroundColor={'#414141'}
            >
              Domů
            </Button>
            <Button onClick={handleClickProfile} sx={{ flex: 2 }}>
              Profil
            </Button>
          </Flex>
        </Flex>
      </Container>
    </TranslucentBox>
  );
};

export { NoMoreQuestions };
