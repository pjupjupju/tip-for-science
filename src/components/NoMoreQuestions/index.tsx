import { Flex, Text, Button } from 'rebass';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '..';
import { FormattedMessage } from 'react-intl';

interface NoMoreQuestionsProps {
  score: Number;
}

const NoMoreQuestions = ({ score }: NoMoreQuestionsProps) => {
  const navigate = useNavigate();
  const handleClickHome = () => {
    navigate('/');
  };
  const handleClickSettings = () => {
    navigate('/profile/settings');
  };

  return (
    <Container>
      <Flex
        p={3}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
      >
        <Text
          fontSize={4}
          fontWeight={500}
          textAlign="center"
          my={2}
          color="secondary"
        >
          <FormattedMessage
            id="app.game.lastquestion"
            defaultMessage="This was the last question (for now)."
            description="Last question"
          />
          <br />
          <FormattedMessage
            id="app.stats.menu.score"
            defaultMessage="Your score:"
            description="Score text"
          />{' '}
        </Text>
        <Text color="accent" as="span" fontSize={6} fontWeight={700}>
          {score.toString()}
        </Text>
        <Text fontWeight={500} textAlign="center" my={5} color="secondary">
          <FormattedMessage
            id="app.game.morequestions"
            defaultMessage="When more questions become available, we'll let you know at your registration email."
            description="More questions"
          />
          <br />
          <FormattedMessage
            id="app.game.checkmail"
            defaultMessage="You can check or update it in the Settings."
            description="mail settings"
          />{' '}
        </Text>
        <Flex justifyContent="space-between" width="100%" mt={6}>
          <Button
            onClick={handleClickHome}
            sx={{ flex: 2 }}
            mr={1}
            backgroundColor={'#414141'}
          >
            <FormattedMessage
              id="app.home"
              defaultMessage="Home"
              description="Home button"
            />
          </Button>
          <Button onClick={handleClickSettings} sx={{ flex: 2 }}>
            <FormattedMessage
              id="app.stats.menu.settings"
              defaultMessage="Settings"
              description="Settings link"
            />
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export { NoMoreQuestions };
