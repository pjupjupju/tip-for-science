import React from 'react';
import { useHistory } from 'react-router';
import { Button, Image, Text } from 'rebass';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import logo from './../../assets/logoskoly.png';
import { SlideProps } from './types';

const imageStyle = {
  minHeight: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide15 = (props: SlideProps) => {
  const history = useHistory();
  const handleClickHome = () => {
    history.push('/');
  };
  const handleClickPlay = () => {
    history.push('/play');
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
          To je vše, nyní jsi připraven na hru naostro!
        </Text>
      </TutorialHeader>
      <Image src={logo} sx={imageStyle} />
      <Text
        fontSize={[3, 4, 5]}
        fontWeight="bold"
        color="secondary"
        textAlign="center"
        p={3}
      >
        Tip for Science bylo vytvořeno evolučními biology z Univerzity Karlovy.
      </Text>
      <Button onClick={handleClickHome}>Domů</Button>
      <Button onClick={handleClickPlay}>Začít hrát</Button>
    </Container>
  );
};

export { Slide15 };
