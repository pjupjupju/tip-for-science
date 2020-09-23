import React from "react";
import { Flex, Heading, Button } from "rebass";

const Home = () => (
  <Flex
    flexDirection="column"
    justifyContent="center"
    height="100%"
    width="100%"
    p="3"
  >
    <Flex sx={{ flexGrow: 1 }} justifyContent="center" flexDirection="column">
      <Heading textAlign="center" color="white">
        TIP FOR SCIENCE
      </Heading>
    </Flex>
    <Flex
      flexDirection="column"
      sx={{
        flexGrow: 0,
        flexShrink: 0,
      }}
    >
      <Flex mb="2">
        <Button mr="1" flex="1">
          about
        </Button>
        <Button ml="1" flex="1">
          stats
        </Button>
      </Flex>
      <Button>play</Button>
    </Flex>
  </Flex>
);
export { Home };
