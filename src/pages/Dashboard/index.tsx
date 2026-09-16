import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { BackButton, Container, Spinner } from '../../components';
import {
  EXPORT_MUTATION,
  IMPORT_MUTATION,
  ONLINE_STATS_QUERY,
} from '../../gql';
import { User, UserRole } from '../../types';
import { TranslationImporter } from './TranslationImporter';

const buttonStyles = { width: { xs: '100% ', sm: 150 }, my: 2 };

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
  const intl = useIntl();
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
              ? intl.formatMessage({ id: 'app.dashboard.log.importSuccess', defaultMessage: 'All available questions imported.' })
              : intl.formatMessage({ id: 'app.dashboard.log.importPartial', defaultMessage: 'Some questions were not imported.' })
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
              ? intl.formatMessage({ id: 'app.dashboard.log.exportLocal', defaultMessage: 'Local file created.' })
              : intl.formatMessage({ id: 'app.dashboard.log.exportLink', defaultMessage: 'Download link: {url}' }, { url: exportData })
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
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <Container>
        <Box
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet title={intl.formatMessage({ id: 'app.dashboard.title', defaultMessage: 'Admin dashboard' })} />
      <Typography variant="h4" color="primary" my={4}>
        <FormattedMessage
          id="app.dashboard.menu.dasboard"
          defaultMessage="Dashboard"
          description="Dashboard"
        />
      </Typography>
      <Box display="flex" flexDirection="column">
        <Typography variant="h5" color="white" mb={3}>
          <FormattedMessage
            id="app.dashboard.menu.actions"
            defaultMessage="Actions"
            description="Actions button"
          />
        </Typography>
        <Stack direction="row" alignItems="flex-end" gap={2}>
          <Box flex={1} display="flex" flexDirection="column">
            <Typography color="white" fontFamily="Tahoma">
              <FormattedMessage
                id="app.dashboard.menu.export"
                defaultMessage="Export .csv to S3"
                description="Export button"
              />
            </Typography>
            <Button
              variant="contained"
              sx={buttonStyles}
              onClick={handleClickExport}
            >
              {exportLoading
                ? <FormattedMessage id="app.dashboard.button.generating" defaultMessage="Generating…" />
                : <FormattedMessage id="app.dashboard.button.download" defaultMessage="Download" />}
            </Button>
          </Box>

          <Box flex={1} display="flex" flexDirection="column">
            <Typography color="white" fontFamily="Tahoma">
              <FormattedMessage
                id="app.dashboard.menu.import"
                defaultMessage="Import from Spreadsheet"
                description="Import button"
              />
            </Typography>
            <Button
              variant="contained"
              disabled={importLoading}
              sx={buttonStyles}
              onClick={handleClickImport}
            >
              {importLoading
                ? <FormattedMessage id="app.dashboard.button.importing" defaultMessage="Importing…" />
                : <FormattedMessage id="app.dashboard.button.import" defaultMessage="Import" />}
            </Button>
          </Box>

        </Stack>
        <TranslationImporter />
        <Box sx={consoleStyle}>
          {log.map((line, index) => (
            <Typography
              key={`line-${index}`}
              fontFamily="monospace"
              variant="body2"
            >
              {' '}
              $: {line}
            </Typography>
          ))}
        </Box>
        <Typography variant="h5" color="white" mb={3}>
          <FormattedMessage
            id="app.dashboard.menu.stats"
            defaultMessage="Stats"
            description="Stats button"
          />
        </Typography>
        <Box display="flex" flexDirection="column">
          <Typography
            color="white"
            fontWeight="bold"
            fontFamily="Tahoma"
            mb={3}
          >
            <FormattedMessage
              id="app.dashboard.menu.online"
              defaultMessage="Online users playing: "
              description="Online button"
            />
            {' '}{data.getOnlineStats.online}
          </Typography>
        </Box>
      </Box>
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
