import React, { useState } from 'react';
import { Flex, Button, Box, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { useForm } from 'react-hook-form';

import { Container } from '../../components';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { AuthQueryName, SIGN_IN_MUTATION } from '../../gql';

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

const Signup = () => {
  const { register, handleSubmit } = useForm();

  const [errors, setErrors] = useState([]);
  const history = useHistory();

  const [signIn] = useMutation(SIGN_IN_MUTATION, {
    refetchQueries: [AuthQueryName],
    onCompleted: ({ signIn: { __typename, ...data } }) => {
      console.log(data);
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
      history.push('/');
    } else {
      setErrors(data!.signIn!.errors);
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
          Přihlásit
        </Button>
        {errors.length > 0 && (
          <Box>
            {errors.map((item: { error: string }) => (
              <Text color="red">{item.error}</Text>
            ))}
          </Box>
        )}
      </Flex>
    </Container>
  );
};
export { Signup };
