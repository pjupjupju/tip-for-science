import React from 'react';
import { Flex, Text } from 'rebass';
import { Container } from '../Container';
import { TranslucentBox } from '../TranslucentBox';
import Button from '@mui/material/Button';
import { FormattedMessage } from 'react-intl';

const TooCloseDialog = ({
  onGuessed,
  onKnewIt,
}: {
  onGuessed: Function;
  onKnewIt: Function;
}) => {
  const handleClickGuessed = () => {
    onGuessed();
  };
  const handleClickKnewIt = () => {
    onKnewIt();
  };

  return (
    <TranslucentBox>
      <Container>
        <Flex
          p={3}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Text fontWeight={500} textAlign="center" my={3} color="white">
            <FormattedMessage
              id="app.game.tooclose"
              defaultMessage="Wow! That was REALLY close! Did you actually know the correct answer, or did you just make an amazing guess?"
              description="Too close"
            />
            <br />
            <FormattedMessage
              id="app.game.closedontworry"
              defaultMessage="Don't worry, this won't affect your score, but it helps us with data analysis. :)"
              description="Don't worry"
            />
          </Text>
          <Flex justifyContent="space-between" width="100%">
            <Button onClick={handleClickGuessed}>
              <FormattedMessage
                id="app.game.guessed"
                defaultMessage="I guessed"
                description="Guessed"
              />
            </Button>
            <Button onClick={handleClickKnewIt}>
              <FormattedMessage
                id="app.game.knew"
                defaultMessage="I knew"
                description="Knew"
              />
            </Button>
          </Flex>
        </Flex>
      </Container>
    </TranslucentBox>
  );
};

export { TooCloseDialog };
