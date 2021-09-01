import React from 'react';
import { Flex, Button } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { Container } from '../../components';

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
  const handleSignUp = () => {};
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
      </Flex>
    </Container>
  );
};
export { Signup };
