import React from 'react';
import Helmet from 'react-helmet';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container } from './../../components/Container';
import { FormattedMessage, useIntl } from 'react-intl';

const Consent = () => {
  const intl = useIntl();
  const helmet = intl.formatMessage({
    id: 'app.consenthelmet',
    defaultMessage: `Consent to Terms`,
    description: 'Consent helmet',
  });
  return (
    <Container>
      <Helmet title={helmet}></Helmet>
      <Box my={6}>
        <Typography variant="body1" color="text.secondary" fontSize={[16, 20]}>
          <FormattedMessage
            id="app.consent"
            defaultMessage="I hereby consent to Mgr. Pavlína Hillerová (hillerovap@natur.cuni.cz) processing my personal data, specifically: {lineBreak}
          - my email address {lineBreak}
          - personal information derived from my responses to questions in the questionnaires, {lineBreak}
        for the purposes of a study on cultural transmission. {lineBreak}
        {lineBreak}
        I understand that: {lineBreak}
        - I will receive information at the email address provided, {lineBreak}
        - I have the right to request information on what personal data is being processed about me, {lineBreak}
        - I can request corrections to my personal data if it is inaccurate or outdated, {lineBreak}
        - I can request that my personal data not be processed until the validity of the above requests is resolved, {lineBreak}
        - I have the right to lodge a complaint with the supervisory authority, {lineBreak}
        - I may withdraw my consent at any time by requesting deletion of my profile via email to hillerovap@natur.cuni.cz."
            description="Consent"
            values={{
              lineBreak: <br />,
            }}
          />
        </Typography>
      </Box>
    </Container>
  );
};

export { Consent };
