import React from 'react';
import { Text, Flex } from 'rebass';
import NumberFormat from 'react-number-format';
import { FormattedMessage } from 'react-intl';

interface PreviousTipsProps {
  previousTips?: number[];
  unit?: string;
}

const previousTipStyle = {
  background: '#e91e63',
  mr: 1,
  px: 2,
  py: 1,
};

const PreviousTips = ({ previousTips, unit }: PreviousTipsProps) =>
  previousTips != null && previousTips.length !== 0 ? (
    <>
      <Text textAlign="center" color="#FF0070" my={1}>
        <FormattedMessage
          id="app.previoustis"
          defaultMessage="Previous tips: "
          description="Previous tips"
        />
      </Text>
      <Flex justifyContent="center">
        {previousTips.map((previousTip, index) => (
          <Text
            sx={previousTipStyle}
            key={`previous-tip-${index}-${previousTip}`}
          >
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
