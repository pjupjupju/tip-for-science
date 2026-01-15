import React, { useState } from 'react';
import Helmet from 'react-helmet';
import InputLabel from '@mui/material/InputLabel';
import HrefLink from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { FormattedMessage, useIntl } from 'react-intl';

import { Container, MenuButton } from '../../components';
import { AuthQueryName, SIGN_UP_MUTATION } from '../../gql';
import {
  MIN_PASSWORD_LENGTH,
  emailRegex,
  useYupValidationResolver,
} from '../../helpers';
import { settingInputStyles, labelStyles } from '../../components/commonStyleSheets';
import { validationMessages } from './messages';

const SignUp = () => {
  const intl = useIntl();
  const helmet = intl.formatMessage({
    id: 'app.sigin',
    defaultMessage: `Sign in`,
    description: 'Sign in',
  });
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(intl.formatMessage(validationMessages.emailRequired))
      .matches(emailRegex, intl.formatMessage(validationMessages.emailInvalid)),
    password: Yup.string()
      .required(intl.formatMessage(validationMessages.passwordRequired))
      .required(intl.formatMessage(validationMessages.passwordRequired))
      .min(
        MIN_PASSWORD_LENGTH,
        intl.formatMessage(validationMessages.passwordMin, {
          min: MIN_PASSWORD_LENGTH,
        })
      ),
    confirmPassword: Yup.string()
      .required(intl.formatMessage(validationMessages.passwordConfirmation))
      .oneOf(
        [Yup.ref('password')],
        intl.formatMessage(validationMessages.passwordNotMatch)
      ),
  });

  const [errors, setErrors] = useState<Array<{ error: string }>>([]);
  const resolver = useYupValidationResolver(validationSchema, setErrors);
  const { register, handleSubmit } = useForm({ resolver });

  const navigate = useNavigate();

  const [signUp, { loading }] = useMutation(SIGN_UP_MUTATION, {
    refetchQueries: [AuthQueryName],
    awaitRefetchQueries: true,
    onCompleted: ({ signUp: { __typename, ...data } }) => {
      // console.log(data);
    },
    // onError:
  });

  const onSubmit = async (values: { email: string; password: string }) => {
    const { data } = await signUp({
      variables: {
        email: values.email,
        password: values.password,
      },
    });

    if (data && !data.signUp.errors) {
      navigate('/profile/settings');
    } else {
      setErrors(data!.signUp!.errors);
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
              id="app.signup.menu.acount"
              defaultMessage="Already have an account?"
              description="SignUp Account text"
            />{' '}
            <HrefLink component={Link} to="/signin" color="primary">
              <FormattedMessage
                id="app.signup.menu.login"
                defaultMessage="Log in"
                description="SignUp Login text"
              />
            </HrefLink>{' '}
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
              id="app.signup.menu.email"
              defaultMessage="E-mail"
              description="SignUp Email label"
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
              id="app.signup.menu.password"
              defaultMessage="Password"
              description="SignUp Password label"
            />
          </InputLabel>
          <OutlinedInput
            id="password"
            type="password"
            sx={settingInputStyles}
            {...register('password')}
          />
          <InputLabel htmlFor="password" sx={labelStyles}>
            <FormattedMessage
              id="app.signup.menu.passwordagain"
              defaultMessage="Repeat password"
              description="SignUp Repeat Password label"
            />
          </InputLabel>
          <OutlinedInput
            id="confirmPassword"
            type="password"
            sx={settingInputStyles}
            {...register('confirmPassword')}
          />
          <Stack direction="row" justifyContent="center" my={2}>
            <Typography color="white" fontSize={14}>
              <FormattedMessage
                id="app.signup.menu.agree"
                defaultMessage="By clicking on Create you agree with"
                description="SignUp Agree text"
              />{' '}
              <HrefLink href="/consent" target="_blank" color="text.secondary">
                <FormattedMessage
                  id="app.signup.menu.processing"
                  defaultMessage="processing of personal data"
                  description="SignUp Processing text"
                />
              </HrefLink>
              .
            </Typography>
          </Stack>
          <MenuButton loading={loading} type="submit" primary>
            <FormattedMessage
              id="app.signup.menu.create"
              defaultMessage="Create"
              description="SignUp Agree text"
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

          <Stack direction="row" justifyContent="center" my={1}>
            <Typography color="white" fontSize={14}>
              <HrefLink component={Link} color="text.secondary" to="/">
                <FormattedMessage
                  id="app.signup.menu.home"
                  defaultMessage="Home"
                  description="SignUp Home link"
                />
              </HrefLink>
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};
export { SignUp };
