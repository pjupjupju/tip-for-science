import React from 'react';
import { Text, Flex } from 'rebass';

interface PreviousTipsProps {
  previousTips?: number[];
  unit?: string;
}

const previousTipStyle = {
  background: '#FF0070',
  mr: 1,
  p: 1,
};

const PreviousTips = ({ previousTips, unit }: PreviousTipsProps) =>
  previousTips != null && previousTips.length !== 0 ? (
    <>
      <Text textAlign="center" color="#FF0070" my={1}>
        Předchozí tipy:{' '}
      </Text>
      <Flex justifyContent="center">
        {previousTips.map((previousTip) => (
          <Text sx={previousTipStyle} key={`previous-tip-${previousTip}`}>
            {previousTip}
          </Text>
        ))}
      </Flex>
    </>
  ) : null;

export { PreviousTips };
