import { useQuery } from '@apollo/client';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Flex, Heading, Link, Text } from 'rebass';
import { BackButton, Container } from '../../components';
import { ONLINE_STATS_QUERY } from '../../gql';

const handleClickDashboard = () => {
  // console.log('Si kliknul!');
};

const Dashboard = () => {
  const { loading, data } = useQuery(ONLINE_STATS_QUERY);

  if (loading) {
    return <div>loading</div>;
  }

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
            {data.getOnlineStats.onlineUsers}
          </Text>
          <RouterLink to="/dashboard/user-list" component={Link} color="primary">
            Show user list
          </RouterLink>
        </Flex>
      </Flex>
      <BackButton>domů</BackButton>
    </Container>
  );
};

export { Dashboard };
