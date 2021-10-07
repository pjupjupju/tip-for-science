import React, { useContext, useState } from 'react';
import { Flex, Button, Box, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { Container } from '../../components';
import { setItem } from '../../io';
import { UserContext } from '../../userContext';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SIGN_IN_MUTATION } from '../../gql';

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
  const { setUser } = useContext(UserContext);
  const [errors, setErrors] = useState([]);
  const history = useHistory();

  const [signIn] = useMutation(SIGN_IN_MUTATION, {
    onCompleted: ({ signIn: { __typename, ...data } }) => {
      console.log(data);
    },
    // onError:
  });

  const handleSignUp = async () => {
    const { data } = await signIn({
      variables: {
        email: 'jurajhrib@gmail.com',
        password: 'tipforscience123',
      },
    });

    console.log('here are data:', data);
    console.log('here are errors: ', data.signIn.errors);

    if (data && !data.signIn.errors) {
      setItem('user', JSON.stringify({ token: 'p100f33cz3k' }));
      setUser({ token: 'p100f33cz3k' });
      history.push('/');
    } else {
      setErrors(data!.signIn!.errors);
    }
  };

  return (
    <Container>
      <Flex
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
          name="email"
          type="text"
          placeholder="e-mail"
          mb={2}
          sx={inputStyles}
        />
        <Label htmlFor="password" sx={labelStyles}>
          Heslo
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          mb={2}
          sx={inputStyles}
        />
        <Button onClick={handleSignUp} my={3}>
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
