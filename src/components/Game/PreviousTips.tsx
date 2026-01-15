import React from 'react';
import NumberFormat from 'react-number-format';
import { FormattedMessage } from 'react-intl';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface PreviousTipsProps {
  previousTips?: number[];
  unit?: string;
}

const previousTipStyle = {
  background: '#e91e63',
  px: 1,
  py: 0.5,
};

const PreviousTips = ({ previousTips, unit }: PreviousTipsProps) =>
  previousTips != null && previousTips.length !== 0 ? (
    <>
      <Typography align="center" color="primary" my= "0.5">
        <FormattedMessage
          id="app.previoustis"
          defaultMessage="Previous tips: "
          description="Previous tips"
        />
      </Typography>
      <Box display="flex" justifyContent="center">
        {previousTips.map((previousTip, index) => (
          <Typography
            key={`previous-tip-${index}-${previousTip}`}
            sx={previousTipStyle}
            mr={index + 1 !== previousTips.length ? 0.5 : 0}
          >
            <NumberFormat
              value={previousTip}
              displayType={'text'}
              thousandSeparator={' '}
            />
          </Typography>
        ))}
      </Box>
    </>
  ) : null;

export { PreviousTips };
