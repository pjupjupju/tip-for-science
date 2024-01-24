import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router-dom';
import { Box, Button, Flex, Heading, Text } from 'rebass';
import { BackButton, Container, Spinner } from '../../components';
import {
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
      <FormattedMessage id="app.dashboard.menu.dasboard"
                  defaultMessage="Dashboard"
                  description="Dashboard" />
      </Heading>
      <Flex flexDirection="column">
        <Heading fontSize={3} color="white" mb={3}>
        <FormattedMessage id="app.dashboard.menu.actions"
                  defaultMessage="Actions"
                  description="Actions button" />
        </Heading>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex flex={1} flexDirection="column" mr={1}>
            <Text color="white" fontFamily="Tahoma">
            <FormattedMessage id="app.dashboard.menu.export"
                  defaultMessage="Export .csv to S3"
                  description="Export button" />
            </Text>
            <Button width="50%" my={2} onClick={handleClickExport}>
              {exportLoading ? '... generating' : 'Download'}
            </Button>
          </Flex>
          <Flex flex={1} flexDirection="column">
            <Text color="white" fontFamily="Tahoma">
            <FormattedMessage id="app.dashboard.menu.import"
                  defaultMessage="Import from Spreadsheet"
                  description="Import button" />
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
        </Flex>
        <Box sx={consoleStyle}>
          {log.map((line, index) => (
            <Text key={`line-${index}`} fontFamily="monospace">
              $: {line}
            </Text>
          ))}
        </Box>
        <Heading fontSize={3} color="white" mb={3}>
        <FormattedMessage id="app.dashboard.menu.stats"
                  defaultMessage="Stats"
                  description="Stats button" />
        </Heading>
        <Flex flexDirection="column">
          <Text color="white" fontWeight="bold" fontFamily="Tahoma" mb={3}>
          <FormattedMessage id="app.dashboard.menu.online"
                  defaultMessage="Online users playing: "
                  description="Online button" />
            {data.getOnlineStats.online}
          </Text>
        </Flex>
      </Flex>
      <BackButton>
      <FormattedMessage id="app.dashboard.footer.home"
                  defaultMessage="Home"
                  description="Home button" />
      </BackButton>
    </Container>
  );
};

export { Dashboard };
