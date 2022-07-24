import React, { useState } from 'react';
import { Flex, Button, Box, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { Container } from '../../components';
import { AuthQueryName, SIGN_UP_MUTATION } from '../../gql';
import {
  MIN_PASSWORD_LENGTH,
  emailRegex,
  useYupValidationResolver,
} from '../../helpers';

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

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is mandatory')
    .matches(emailRegex, 'Please provide a valid e-mail'),
  password: Yup.string()
    .required('Password is mendatory')
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at ${MIN_PASSWORD_LENGTH} char long`
    ),
  confirmPassword: Yup.string()
    .required('Please confirm password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

const SignUp = () => {
  const [errors, setErrors] = useState<Array<{ error: string }>>([]);
  const resolver = useYupValidationResolver(validationSchema, setErrors);
  const { register, handleSubmit } = useForm({ resolver });

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
        <Label htmlFor="password" sx={labelStyles}>
          Heslo znovu
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          mb={2}
          sx={inputStyles}
          {...register('confirmPassword')}
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
