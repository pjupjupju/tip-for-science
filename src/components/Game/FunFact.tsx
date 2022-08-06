import React from 'react';
import { Text } from 'rebass';
import NumberFormat from 'react-number-format';

const FunFact = ({
  correctAnswer,
  fact,
}: {
  correctAnswer: number;
  fact: string;
}) => {
  console.log('includes? ', fact.includes('{correct}'));

  const factPieces = fact.includes('{correct}')
    ? fact.split('{correct}')
    : [fact];

  return (
    <Text textAlign="center" color="secondary" fontSize={4}>
      {factPieces.length < 2 ? (
        <>{factPieces[0]}</>
      ) : (
        <>
          {factPieces[0]}
          <Text as="span" color="white">
            <NumberFormat
              value={correctAnswer}
              displayType={'text'}
              thousandSeparator={' '}
            />
          </Text>
          {factPieces[1]}
        </>
      )}
    </Text>
  );
};

export { FunFact };
