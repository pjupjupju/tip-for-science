import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Heading, Flex } from 'rebass';

const Stats = () => {
  const history = useHistory();
  const handleClickBack = () => {
    history.push('/');
  };
  return (
    <Flex flexDirection="column" height="100%">
      <Heading color="lightgray">Stats</Heading>
      <Flex mt="auto">
        <Button onClick={handleClickBack}>zpět</Button>
      </Flex>
    </Flex>
  );
};

export { Stats };
