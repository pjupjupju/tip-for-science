import React from 'react';
import { Box, Flex, Text } from 'rebass';
import { SlideProps } from './types';

const Slide8 = (props: SlideProps) => {
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
          Tato hra je modelem evoluce.
        </Text>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
          mb="4"
        >
          Tvé tipy a tipy ostatních hráčů tvoří populace. V rámci nich
          jednotlivé tipy bojují o přežití, hledají partnery, množí se.
        </Text>
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
        >
          Několik z nich uvidíš pokaždé jako nápovědu společně s otázkou. *tohle
          všechno zní česky hrozně divně a můj mozek je nyní příliš v
          programátorském m=odu na to abych vymýšlelo kvalitní copy :D*
        </Text>
      </Box>
    </Flex>
  );
};

export { Slide8 };
