import React from 'react';
import Helmet from 'react-helmet';
import HrefLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link, useSearchParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Container } from '../../components';
import { PasswordUpdateForm } from './PasswordUpdateForm';
import { PasswordResetRequestForm } from './PasswordResetRequestForm';

const ResetPassword = () => {
  const intl = useIntl();
  const helmet = intl.formatMessage({
    id: 'app.reset',
    defaultMessage: `Reset password`,
    description: 'Reset password page title',
  });

  const [params] = useSearchParams();
  const id = params.get('id');
  const token = params.get('token');
  const isPasswordUpdatePage = !!id && !!token;

  return (
    <Container noPadding>
      <Helmet title={helmet}></Helmet>
      <Stack
        direction="column"
        justifyContent="center"
        height="100%"
        width="100%"
        boxSizing="border-box"
        p={3}
      >
        <Stack maxHeight="50%" flexGrow={1} justifyContent="center" direction="column">
          <Typography
            variant="h1"
            textAlign="left"
            color="#D6D6D6"
            fontWeight={900}
            lineHeight="0.85em"
            mx="auto"
            fontSize={80}
          >
            TIP FOR <br />
            SCIENCE
          </Typography>
        </Stack>
        {isPasswordUpdatePage ? (
          <PasswordUpdateForm id={id} token={token} />
        ) : (
          <PasswordResetRequestForm />
        )}
      </Stack>
    </Container>
  );
};
export { ResetPassword };
