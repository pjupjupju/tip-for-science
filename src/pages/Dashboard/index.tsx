import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { Box, Button, Flex, Heading, Text } from 'rebass';
import { BackButton, Container, Spinner } from '../../components';
import {
  BATCH_SLUGIFY_MUTATION,
  EXPORT_MUTATION,
  IMPORT_MUTATION,
  ONLINE_STATS_QUERY,
} from '../../gql';
import { User, UserRole } from '../../types';

const consoleStyle = {
  px: 2,
  py: 2,
  border: '1px solid #cacaca',
  background: 'black',
  color: 'white',
  my: 2,
  minHeight: '160px',
  maxHeight: '200px',
  overflowY: 'scroll',
};

interface DashboardProps {
  user: User | null;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [log, setLog] = useState<string[]>([]);
  const { loading, data } = useQuery(ONLINE_STATS_QUERY);

  const [batchSlugify, { loading: batchSlugifyLoading }] = useMutation(
    BATCH_SLUGIFY_MUTATION,
    {
      onCompleted: () => {
        setLog([...log, JSON.stringify('Slugifying completed.')]);
      },
    }
  );

  const [importQuestions, { loading: importLoading }] = useMutation(
    IMPORT_MUTATION,
    {
      onCompleted: ({ importQuestions }) => {
        setLog([
          ...log,
          JSON.stringify(
            importQuestions
              ? 'All available questions imported.'
              : 'Some questions were not imported.'
          ),
        ]);
      },
    }
  );

  const [exportData, { loading: exportLoading }] = useMutation(
    EXPORT_MUTATION,
    {
      onCompleted: ({ exportData }) => {
        setLog([
          ...log,
          JSON.stringify(
            exportData === 'local'
              ? 'Local file created.'
              : `Download link: ${exportData}`
          ),
        ]);
      },
    }
  );

  const handleClickBatchSlugify = () => {
    batchSlugify();
  };
  const handleClickExport = () => {
    exportData();
  };
  const handleClickImport = () => {
    importQuestions();
  };

  if (!user || user.role !== UserRole.admin) {
    return <Redirect to="/" />;
  }

  if (loading) {
    return (
      <Container>
        <Flex
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner />
        </Flex>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet title="Admin dashboard"></Helmet>
      <Heading color="primary" my={4}>
        Dashboard
      </Heading>
      <Flex flexDirection="column">
        <Heading fontSize={3} color="white" mb={3}>
          Actions
        </Heading>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex flex={1} flexDirection="column" mr={1}>
            <Text color="white" fontFamily="Tahoma">
              Export .csv to S3
            </Text>
            <Button width="50%" my={2} onClick={handleClickExport}>
              {exportLoading ? '... generating' : 'Download'}
            </Button>
          </Flex>
          <Flex flex={1} flexDirection="column">
            <Text color="white" fontFamily="Tahoma">
              Import from Spreadsheet
            </Text>
            <Button
              disabled={importLoading}
              width="50%"
              my={2}
              onClick={handleClickImport}
            >
              {importLoading ? '... importing' : 'Import'}
            </Button>
          </Flex>
          <Flex flex={1} flexDirection="column" mr={1}>
            <Text color="white" fontFamily="Tahoma">
              Batch slugify
            </Text>
            <Button width="50%" my={2} onClick={handleClickBatchSlugify}>
              {batchSlugifyLoading ? '... slugifying' : 'Slugify'}
            </Button>
          </Flex>
        </Flex>
        <Box sx={consoleStyle}>
          {log.map((line, index) => (
            <Text key={`line-${index}`} fontFamily="monospace">
              $: {line}
            </Text>
          ))}
        </Box>
        <Heading fontSize={3} color="white" mb={3}>
          Stats
        </Heading>
        <Flex flexDirection="column">
          <Text color="white" fontFamily="Tahoma" mb={3}>
            <b>Online users playing: </b>
            {data.getOnlineStats.online}
          </Text>
        </Flex>
      </Flex>
      <BackButton>domů</BackButton>
    </Container>
  );
};

export { Dashboard };
