import React, { useState } from 'react';
import { Flex, Button, Box, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Container } from '../../components';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { AuthQueryName, SIGN_IN_MUTATION } from '../../gql';
import Helmet from 'react-helmet';

const inputStyles = {
  '::placeholder': {
    color: 'white',
  },
  color: 'white',
};

const labelStyles = {
  color: 'white',
  fontWeight: 600,
};

const SignIn = () => {
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
    <Container>
      <Helmet title="Přihlášení"></Helmet>
      <Flex
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        flexDirection="column"
        justifyContent="center"
        height="100%"
        width="100%"
        p="3"
      >
        <Label htmlFor="email" sx={labelStyles}>
          <FormattedMessage id="app.signin.menu.email"
            defaultMessage="E-mail"
            description="SignIn E-mail label" />
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
          <FormattedMessage id="app.signin.menu.password"
            defaultMessage="Password"
            description="SignIn Password label" />
        </Label>
        <Input
          id="password"
          type="password"
          mb={2}
          sx={inputStyles}
          {...register('password')}
        />
        <Button type="submit" my={3}>
          <FormattedMessage id="app.signin.menu.login"
            defaultMessage="Login"
            description="SignIn Login button" />
        </Button>
        {errors.length > 0 && (
          <Box>
            {errors.map((item: { error: string }) => (
              <Text color="red">{item.error}</Text>
            ))}
          </Box>
        )}
        <Flex justifyContent="center">
          <Text color="white" fontSize="1">
            <FormattedMessage id="app.signin.menu.noacc"
              defaultMessage="No account yet?"
              description="SignIn NoAcc text" />
            {' '}
            <Link to="/signup" style={{ color: '#FF0070' }}>
              <FormattedMessage id="app.signin.menu.create"
                defaultMessage="Create an account"
                description="SignIn CreateAcc link" />
            </Link>
          </Text>
        </Flex>
        <Flex justifyContent="center" my="2">
          <Text color="white" fontSize="1">
            <Link to="/" style={{ color: '#D76B90' }}>
              <FormattedMessage id="app.signin.menu.home"
                defaultMessage="Home"
                description="SignIn Home link" />
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Container>
  );
};
export { SignIn };
