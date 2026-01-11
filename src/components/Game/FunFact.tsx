import React from 'react';
import Typography from '@mui/material/Typography';
import NumberFormat from 'react-number-format';

const FunFact = ({
  correctAnswer,
  fact,
}: {
  correctAnswer: number;
  fact: string;
}) => {
  const factPieces = fact.includes('{correct}')
    ? fact.split('{correct}')
    : [fact];

  return (
    <Typography
      align="center"
      color="text.secondary"
      sx={{ fontSize: { xs: 16, sm: 20, md: 24 }, mb: 4 }}
    >
      {factPieces.length < 2 ? (
        <>{factPieces[0]}</>
      ) : (
        <>
          {factPieces[0]}
          <Typography
            component="span"
            color="white"
            fontSize={{ xs: 16, sm: 20, md: 24 }}
          >
            <NumberFormat
              value={correctAnswer}
              displayType={'text'}
              thousandSeparator={' '}
            />
          </Typography>
          {factPieces[1]}
        </>
      )}
    </Typography>
  );
};

export { FunFact };
