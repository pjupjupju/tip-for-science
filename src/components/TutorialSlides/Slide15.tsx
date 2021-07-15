import React from 'react';
import { useHistory } from 'react-router';
import { Box, Button, Flex, Image, Text } from 'rebass';
import logo from './../../assets/logoskoly.png';
import { SlideProps } from './types';

const imageStyle = {
  height: '210px',
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
    <Flex flexDirection="column">
      <Box height="80px">
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={3}
        >
          To je vše, nyní jsi připraven na hru naostro!
        </Text>
      </Box>
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
    </Flex>
  );
};

export { Slide15 };
