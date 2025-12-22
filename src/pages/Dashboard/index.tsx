import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { redirect } from 'react-router-dom';
import { Box, Flex, Heading, Text } from 'rebass';
import Button from '@mui/material/Button';
import { BackButton, Container, Spinner } from '../../components';
import {
  EXPORT_MUTATION,
  IMPORT_MUTATION,
  ONLINE_STATS_QUERY,
  WIPE_BATCHES_MUTATION,
} from '../../gql';
import { User, UserRole } from '../../types';
import { WipeBatchesButton } from './WipeBatchesButton';

const buttonStyles = { width: '50%', my: 2 };

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

  const [wipeBatches, { loading: wipeBatchesLoading }] = useMutation(
    WIPE_BATCHES_MUTATION,
    {
      onCompleted: ({ wipeBatches }) => {
        setLog([
          ...log,
          JSON.stringify(
            wipeBatches
              ? 'All user question were deleted.'
              : 'Error: Some user question batches were not deleted.'
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

  const handleClickWipe = () => {
    wipeBatches();
  };

  if (!user || user.role !== UserRole.admin) {
    redirect('/');
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
        <FormattedMessage
          id="app.dashboard.menu.dasboard"
          defaultMessage="Dashboard"
          description="Dashboard"
        />
      </Heading>
      <Flex flexDirection="column">
        <Heading fontSize={3} color="white" mb={3}>
          <FormattedMessage
            id="app.dashboard.menu.actions"
            defaultMessage="Actions"
            description="Actions button"
          />
        </Heading>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex flex={1} flexDirection="column" mr={1}>
            <Text color="white" fontFamily="Tahoma">
              <FormattedMessage
                id="app.dashboard.menu.export"
                defaultMessage="Export .csv to S3"
                description="Export button"
              />
            </Text>
            <Button
              variant="contained"
              sx={buttonStyles}
              onClick={handleClickExport}
            >
              {exportLoading ? '... generating' : 'Download'}
            </Button>
          </Flex>
          <Flex flex={1} flexDirection="column">
            <Text color="white" fontFamily="Tahoma">
              <FormattedMessage
                id="app.dashboard.menu.import"
                defaultMessage="Import from Spreadsheet"
                description="Import button"
              />
            </Text>
            <Button
              variant="contained"
              disabled={importLoading}
              sx={buttonStyles}
              onClick={handleClickImport}
            >
              {importLoading ? '... importing' : 'Import'}
            </Button>
          </Flex>
        </Flex>
        <Flex justifyContent="start" alignItems="center">
          <Flex flex={0.5} flexDirection="column" mr={1}>
            <Text color="white" fontFamily="Tahoma">
              <FormattedMessage
                id="app.dashboard.menu.wipe"
                defaultMessage="Delete batches"
                description="Wipe batches button"
              />
            </Text>
            <WipeBatchesButton
              buttonStyles={buttonStyles}
              mutation={wipeBatches}
              loading={wipeBatchesLoading}
            />
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
          <FormattedMessage
            id="app.dashboard.menu.stats"
            defaultMessage="Stats"
            description="Stats button"
          />
        </Heading>
        <Flex flexDirection="column">
          <Text color="white" fontWeight="bold" fontFamily="Tahoma" mb={3}>
            <FormattedMessage
              id="app.dashboard.menu.online"
              defaultMessage="Online users playing: "
              description="Online button"
            />
            {data.getOnlineStats.online}
          </Text>
        </Flex>
      </Flex>
      <BackButton>
        <FormattedMessage
          id="app.dashboard.footer.home"
          defaultMessage="Home"
          description="Home button"
        />
      </BackButton>
    </Container>
  );
};

export { Dashboard };
