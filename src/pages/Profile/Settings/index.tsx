import React, { ReactNode } from 'react';
import { Input, Label, Radio } from '@rebass/forms';
import { Flex, Button, Heading, Text, Box, Link } from 'rebass';
import { Link as RouterLink } from 'react-router-dom';
import { Container } from '../../../components';

const NavbarLink = ({
  children,
  ...rest
}: {
  children: ReactNode;
  [key: string]: any;
}) => (
  <Link variant="nav" as={RouterLink} {...rest}>
    {children}
  </Link>
);

const Settings = () => {
  return (
    <Container>
      <Flex flexDirection="column" height="100%">
        <Flex px={2} color="white" bg="secondary" alignItems="center">
          <Text p={2} fontWeight="bold">
            Profil
          </Text>
          <Box mx="auto" />
          <NavbarLink to="/profile/stats">Stats</NavbarLink>
          <NavbarLink to="/profile/settings" color="black">
            Nastavení
          </NavbarLink>
          <NavbarLink to="/">Domů</NavbarLink>
        </Flex>
        <Text color="secondary" my="2" ml="2">
          Všechny údaje budou před vyhodnocením anonymizovány.
        </Text>
        <Heading color="secondary" fontSize={[3, 3, 4]} mt="4" mb="2" mx="3">
          Přihlašovací údaje:
        </Heading>

        <Input
          placeholder="tady zobrazit registrační mail"
          color="white"
          mt="2"
          ml="2"
        />
        <Flex mt="2" justifyContent="space-between" width="100%">
          <Button
            backgroundColor="#414141"
            sx={{ flex: 1, color: 'white' }}
            mr="1"
          >
            Změnit e-mail
          </Button>
          <Button backgroundColor="#414141" sx={{ flex: 1, color: 'white' }}>
            Změnit heslo
          </Button>
        </Flex>
        <Heading color="secondary" fontSize={[3, 3, 4]} mt="4" mx="3">
          Nepovinné údaje:
        </Heading>
        <Text color="secondary" fontSize={3} my="2" ml="2">
          Jsem:
        </Text>
        <Text color="secondary" fontSize={2} ml="2">
          <Box ml="2">
            <Label color="white">
              <Radio name="gender" id="woman" value="woman" />
              Žena
            </Label>
            <Label color="white">
              <Radio name="gender" id="man" value="man" />
              Muž
            </Label>
            <Label color="white">
              <Radio name="gender" id="enby" value="enby" />
              Nebinární
            </Label>
            <Label color="white">
              <Radio name="gender" id="other" value="other" />
              Jiné (můžeš uvést):
            </Label>
            <Input placeholder="..." color="white" width="calc(40vh)" my="2" />
          </Box>
        </Text>
        <Text color="secondary" fontSize={3} my="2" ml="2">
          Věk:
        </Text>
        <Input
          type="number"
          name="age"
          placeholder="..."
          min="18"
          max="120"
          color="white"
          width="calc(20vh)"
          my="2"
        />

        <Flex mt="auto" justifyContent="space-between" width="100%" mb="2">
          <Button sx={{ flex: 1, color: 'white' }}>Uložit</Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export { Settings };
