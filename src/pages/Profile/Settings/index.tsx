import React from 'react';
import { useHistory } from 'react-router';
import { Input, Label, Radio } from '@rebass/forms';
import { Flex, Button, Heading, Text, Box } from 'rebass';
import { Container, BackButton } from '../../../components';

const Settings = () => {
  const history = useHistory();
  const handleClickStats = () => {
    history.push('/profile/stats');
  };

  const handleClickSettings = () => {
    history.push('/profile/settings');
  };

  return (
    <Container>
      <Flex flexDirection="column" height="100%">
        <Flex justifyContent="space-between" width="100%" my={4}>
          <Button
            onClick={handleClickStats}
            sx={{ flex: 2 }}
            mr={1}
            backgroundColor={'#414141'}
          >
            Stats
          </Button>
          <Button onClick={handleClickSettings} sx={{ flex: 2 }}>
            Nastavení
          </Button>
        </Flex>
        <Heading color="secondary" fontSize={[2, 3, 4]} my="2" mx="3">
          Přihlašovací údaje:
        </Heading>
        <Input placeholder="mail" color="white" mt="2" />
        <Input placeholder="heslo (a znovu a tak)" color="white" mt="2" />
        <Heading color="secondary" fontSize={[2, 3, 4]} mt="4" mx="3">
          Nepovinné údaje:
        </Heading>
        <Text color="secondary" mt="2">
          Tyto údaje budou před vyhodnocením anonymizovány.
        </Text>
        <Text color="secondary" fontSize={3} mt="2">
          Jsem:
        </Text>
        <Text color="secondary" fontSize={2}>
          <Box>
            <Label>
              <Radio name="gender" id="žena" value="red" />
              Žena
            </Label>
            <Label>
              <Radio name="gender" id="green" value="green" />
              Muž
            </Label>
            <Label>
              <Radio name="gender" id="blue" value="blue" />
              Nebinární
            </Label>
            <Label>
              <Radio name="gender" id="blue" value="blue" />
              Jiné (můžeš uvést):
            </Label>
            <Input placeholder="..." color="white" my="2" />
          </Box>
        </Text>
        <Text color="secondary" fontSize={3} mt="2">
          Věk:
          <Input placeholder="..." color="white" my="2" />
        </Text>
        <BackButton mt="2">domů</BackButton>
      </Flex>
    </Container>
  );
};

export { Settings };
