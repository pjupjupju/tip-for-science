import React, { useState } from 'react';
import Helmet from 'react-helmet';
import InputLabel from '@mui/material/InputLabel';
import HrefLink from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

import { MenuButton, Container } from '../../components';
import { useMutation } from '@apollo/client';
import { AuthQueryName, SIGN_IN_MUTATION } from '../../gql';
import {
  labelStyles,
  settingInputStyles,
} from '../../components/commonStyleSheets';

const buttonStyles = {
  my: 3,
};

const SignIn = () => {
  const intl = useIntl();
  const helmet = intl.formatMessage({
    id: 'app.sigin',
    defaultMessage: `Sign in`,
    description: 'Sign in',
  });
  const { register, handleSubmit } = useForm();

  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const [signIn] = useMutation(SIGN_IN_MUTATION, {
    refetchQueries: [AuthQueryName],
    onCompleted: ({ signIn: { __typename, ...data } }) => {
      // console.log(data);
    },
    // onError:
  });

  const onSubmit = async (values: { email: string; password: string }) => {
    const { data } = await signIn({
      variables: {
        email: values.email,
        password: values.password,
      },
    });

    if (data && !data.signIn.errors) {
      navigate('/');
    } else {
      setErrors(data!.signIn!.errors);
    }
  };

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
        <Stack flexGrow={2} justifyContent="center" flexDirection="column">
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
        <Stack direction="row" justifyContent="center">
          <Typography color="white" fontSize={14}>
            <FormattedMessage
              id="app.signin.menu.noacc"
              defaultMessage="No account yet?"
              description="SignIn NoAcc text"
            />{' '}
            <HrefLink component={Link} to="/signup" color="primary">
              <FormattedMessage
                id="app.signin.menu.create"
                defaultMessage="Create an account"
                description="SignIn CreateAcc link"
              />
            </HrefLink>
          </Typography>
        </Stack>
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          direction="column"
          justifyContent="center"
          width="100%"
          boxSizing="border-box"
        >
          <InputLabel htmlFor="email" sx={labelStyles}>
            <FormattedMessage
              id="app.signin.menu.email"
              defaultMessage="E-mail"
              description="SignIn E-mail label"
            />
          </InputLabel>
          <OutlinedInput
            id="email"
            type="text"
            placeholder="e-mail"
            sx={settingInputStyles}
            {...register('email')}
          />
          <InputLabel htmlFor="password" sx={labelStyles}>
            <FormattedMessage
              id="app.signin.menu.password"
              defaultMessage="Password"
              description="SignIn Password label"
            />
          </InputLabel>
          <OutlinedInput
            id="password"
            type="password"
            sx={settingInputStyles}
            {...register('password')}
          />
          <Stack direction="row" justifyContent="center" my={2}></Stack>
          <MenuButton type="submit" sx={buttonStyles} primary>
            <FormattedMessage
              id="app.signin.menu.login"
              defaultMessage="Login"
              description="SignIn Login button"
            />
          </MenuButton>
          {errors.length > 0 && (
            <Stack my={1} direction="column">
              {errors.map((item: { error: string }, index) => (
                <Typography color="red" key={`error-${index}`}>
                  {item.error}
                </Typography>
              ))}
            </Stack>
          )}

          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            my={1}
          >
            <Typography color="white" fontSize={14}>
              <FormattedMessage
                id="app.signin.menu.forgottenpassword"
                defaultMessage="Or you can reset"
                description="Forgotten password help text"
              />{' '}
              <HrefLink
                component={Link}
                to="/reset-password"
                color="text.secondary"
              >
                <FormattedMessage
                  id="app.signup.menu.forgottenpasswordlink"
                  defaultMessage="forgotten password"
                  description="Forgotten password link"
                />
              </HrefLink>
              .
            </Typography>
            <Typography color="white" fontSize={14}>
              <HrefLink component={Link} color="text.secondary" to="/">
                <FormattedMessage
                  id="app.signin.menu.home"
                  defaultMessage="Home"
                  description="SignIn Home link"
                />
              </HrefLink>
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};
export { SignIn };
