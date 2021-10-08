import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Flex } from 'rebass';
import { UserScoreCurve } from '../../components/UserScoreCurve';

const Stats = () => {
  const history = useHistory();
  const handleClickBack = () => {
    history.push('/');
  };
  return (
    <Flex flexDirection="column" height="100%">
      <UserScoreCurve />
      <Flex mt="auto">
        <Button onClick={handleClickBack}>zpět</Button>
      </Flex>
    </Flex>
  );
};

export { Stats };
