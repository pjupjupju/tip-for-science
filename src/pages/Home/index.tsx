import React from "react";
import { Flex, Heading, Button } from "rebass";

const buttonStyle = {
  ":hover": {
    backgroundColor: "white",
  },
  fontSize: 4
};

const Home = () => (
  <Flex
    flexDirection="column"
    justifyContent="center"
    height="100%"
    width="100%"
    p="3"
  >
    <Flex sx={{ flexGrow: 2 }} justifyContent="center" flexDirection="column">
      <Heading
        textAlign="center"
        color="lightgray"
        fontFamily="Impact"
        fontSize={80}
      >
        TIP FOR SCIENCE
      </Heading>
    </Flex>
    <Flex
      flexDirection="column"
      sx={{
        flexGrow: 1,
        flexShrink: 0,
      }}
    >
      <Flex mb="2">
        <Button sx={buttonStyle} mr="1" flex="1">
          about
        </Button>
        <Button sx={buttonStyle} ml="1" flex="1">
          stats
        </Button>
      </Flex>
      <Button sx={buttonStyle}>play</Button>
    </Flex>
  </Flex>
);
export { Home };
