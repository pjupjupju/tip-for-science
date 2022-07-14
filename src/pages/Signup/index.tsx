import React, { useState } from 'react';
import { Flex, Button, Box, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { useForm } from 'react-hook-form';

import { Container } from '../../components';
import { Link, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { AuthQueryName, SIGN_UP_MUTATION } from '../../gql';

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

const SignUp = () => {
  const { register, handleSubmit } = useForm();

  const [errors, setErrors] = useState([]);
  const history = useHistory();

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
      history.push('/');
    } else {
      setErrors(data!.signUp!.errors);
    }
  };

  return (
    <Container>
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
          E-mail
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
          Heslo
        </Label>
        <Input
          id="password"
          type="password"
          mb={2}
          sx={inputStyles}
          {...register('password')}
        />
        <Button type="submit" my={3}>
          Vytvořit
        </Button>
        {errors.length > 0 && (
          <Box>
            {errors.map((item: { error: string }, index) => (
              <Text color="red" key={`error-${index}`}>
                {item.error}
              </Text>
            ))}
          </Box>
        )}
        <Flex justifyContent="center">
          <Text color="white" fontSize="1">
            Máš účet?{' '}
            <Link to="/signin" style={{ color: '#FF0070' }}>
              Přihlásit se
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Container>
  );
};
export { SignUp };
