import React from 'react';
import { Box, Flex, Text } from 'rebass';
import { SlideProps } from './types';

const Slide11 = (props: SlideProps) => {
  return (
    <Flex flexDirection="column">
      <Box p="4">
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
          mb="4"
        >
          Vypilovali jsme sociální přenos téměř k dokonalosti.{' '}
        </Text>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
          mb="4"
        >
          Učíme se jeden od druhého, tvoříme, píšeme básně, inspirovaní tvůrci a
          básníky minulosti.
        </Text>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
          mb="4"
        >
          Využíváme výhod tzv. kulturní dědičnosti.
        </Text>
      </Box>
    </Flex>
  );
};

export { Slide11 };
