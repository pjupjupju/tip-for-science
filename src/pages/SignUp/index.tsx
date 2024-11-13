import React, { useState } from 'react';
import { Flex, Link as HrefLink, Box, Text, Heading } from 'rebass';
import { Label, Input } from '@rebass/forms';
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
import { inputStyles, labelStyles } from '../../components/commonStyleSheets';
import Helmet from 'react-helmet';
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
        intl.formatMessage(validationMessages.passwordMin, { min: MIN_PASSWORD_LENGTH })
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

  const [signUp] = useMutation(SIGN_UP_MUTATION, {
    refetchQueries: [AuthQueryName],
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
      navigate('/');
    } else {
      setErrors(data!.signUp!.errors);
    }
  };

  return (
    <Container>
      <Helmet title={helmet}></Helmet>
      <Flex
        flexDirection="column"
        justifyContent="center"
        height="100%"
        width="100%"
        p="3"
      >
        <Flex
          sx={{ flexGrow: 2 }}
          justifyContent="center"
          flexDirection="column"
        >
          <Heading
            textAlign="left"
            color="#D6D6D6"
            fontWeight={900}
            lineHeight="0.85em"
            mx="auto"
            fontSize={80}
          >
            TIP FOR <br />
            SCIENCE
          </Heading>
        </Flex>
        <Flex justifyContent="center">
          <Text color="white" fontSize="1">
            <FormattedMessage
              id="app.signup.menu.acount"
              defaultMessage="Already have an account?"
              description="SignUp Account text"
            />{' '}
            <Link to="/signin" style={{ color: '#FF0070' }}>
              <FormattedMessage
                id="app.signup.menu.login"
                defaultMessage="Log in"
                description="SignUp Login text"
              />
            </Link>{' '}
          </Text>
        </Flex>

        <Flex
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          flexDirection="column"
          justifyContent="center"
          width="100%"
          p="1"
        >
          <Label htmlFor="email" sx={labelStyles}>
            <FormattedMessage
              id="app.signup.menu.email"
              defaultMessage="E-mail"
              description="SignUp Email label"
            />
          </Label>
          <Input
            id="email"
            type="text"
            placeholder="e-mail"
            mb={2}
            sx={inputStyles}
            {...register('email')}
          />
          <Label htmlFor="password" sx={labelStyles}>
            <FormattedMessage
              id="app.signup.menu.password"
              defaultMessage="Password"
              description="SignUp Password label"
            />
          </Label>
          <Input
            id="password"
            type="password"
            mb={2}
            sx={inputStyles}
            {...register('password')}
          />
          <Label htmlFor="password" sx={labelStyles}>
            <FormattedMessage
              id="app.signup.menu.passwordagain"
              defaultMessage="Repeat password"
              description="SignUp Repeat Password label"
            />
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            mb={2}
            sx={inputStyles}
            {...register('confirmPassword')}
          />
          <Flex justifyContent="center" my={2}>
            <Text color="white" fontSize="1">
              <FormattedMessage
                id="app.signup.menu.agree"
                defaultMessage="By clicking on Create you agree with"
                description="SignUp Agree text"
              />{' '}
              <HrefLink
                href="/consent"
                target="_blank"
                style={{ color: '#D76B90' }}
              >
                <FormattedMessage
                  id="app.signup.menu.processing"
                  defaultMessage="processing of personal data"
                  description="SignUp Processing text"
                />
              </HrefLink>
              .
            </Text>
          </Flex>
          <MenuButton type="submit" primary>
            <FormattedMessage
              id="app.signup.menu.create"
              defaultMessage="Create"
              description="SignUp Agree text"
            />
          </MenuButton>
          {errors.length > 0 && (
            <Box>
              {errors.map((item: { error: string }, index) => (
                <Text color="red" key={`error-${index}`}>
                  {item.error}
                </Text>
              ))}
            </Box>
          )}

          <Flex justifyContent="center" my="2">
            <Text color="white" fontSize="1">
              <Link to="/" style={{ color: '#D76B90' }}>
                <FormattedMessage
                  id="app.signup.menu.home"
                  defaultMessage="Home"
                  description="SignUp Home link"
                />
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};
export { SignUp };
