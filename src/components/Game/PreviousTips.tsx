import React from 'react';
import { Text, Flex } from 'rebass';
import NumberFormat from 'react-number-format';

interface PreviousTipsProps {
  previousTips?: number[];
  unit?: string;
}

const previousTipStyle = {
  background: '#FF0070',
  mr: 1,
  paddingTop: 1,
  paddingBottom: 1,
  paddingLeft: 2,
  paddingRight: 2,
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
            <NumberFormat
              value={previousTip}
              displayType={'text'}
              thousandSeparator={' '}
            />
          </Text>
        ))}
      </Flex>
    </>
  ) : null;

export { PreviousTips };
