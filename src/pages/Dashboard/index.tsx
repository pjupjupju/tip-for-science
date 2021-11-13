import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Flex, Heading, Link, Text } from 'rebass';
import { Container } from '../../components';

const handleClickDashboard = () => {
  console.log('Si kliknul!');
};

const online = 1;

const Dashboard = () => {
  return (
    <Container>
      <Heading color="primary" my={4}>
        Dashboard
      </Heading>
      <Flex flexDirection="column">
        <Heading fontSize={3} color="white" mb={3}>
          Actions
        </Heading>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex flexDirection="column">
            <Text color="white" fontFamily="Tahoma">
              Export .csv
            </Text>
            <Button my={2} onClick={handleClickDashboard}>
              Download
            </Button>
          </Flex>
          <Flex flexDirection="column">
            <Text color="white" fontFamily="Tahoma">
              Import .csv
            </Text>
            <Button my={2} onClick={handleClickDashboard}>
              Upload
            </Button>
          </Flex>
          <Flex flexDirection="column">
            <Text color="white" fontFamily="Tahoma">
              Import GDocs
            </Text>
            <Button my={2} onClick={handleClickDashboard}>
              Upload
            </Button>
          </Flex>
        </Flex>
        <Heading fontSize={3} color="white" mb={3}>
          Stats
        </Heading>
        <Flex flexDirection="column">
          <Text color="white" fontFamily="Tahoma" mb={3}>
            <b>Online users: </b>
            {online}
          </Text>
          <RouterLink to="user-list" component={Link} color="primary">
            Show user list
          </RouterLink>
        </Flex>
      </Flex>
    </Container>
  );
};

export { Dashboard };
