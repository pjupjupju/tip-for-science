import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getTutorialImageStyle } from '../commonStyleSheets';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { SlideProps } from './types';
import { FormattedMessage } from 'react-intl';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';
import elephant from './../../assets/elephantTut.jpg';

const imageStyle = getTutorialImageStyle(elephant);

const Slide2 = ({ handleNextStep }: SlideProps) => {
  return (
    <Container>
      <TutorialHeader>
        <Typography
          fontSize={{
            xs: 16,
            sm: 20,
            md: 24,
          }}
          color="text.secondary"
          textAlign="center"
          px={1}
          py={2}
        >
          <FormattedMessage
            id="app.tutorial.slide.guess"
            defaultMessage="Fear not, the correct answers will soon be revealed! But first, why not take a guess..."
            description="Tut2 guess"
          />
        </Typography>
      </TutorialHeader>
      <Box sx={imageStyle} />
      <Typography
        fontSize={{
          xs: 16,
          sm: 20,
          md: 24,
        }}
        color="text.secondary"
        textAlign="center"
        px={1}
        py={2}
      >
        <FormattedMessage
          id="app.tutorial.slide.ffeleph"
          defaultMessage="The largest known elephant was shot dead in 1956 in Angola. Let's say the previous players of Tip for Science guessed that this colossal creature weighed"
          description="Tut2 ffeleph"
        />{' '}
        <Typography component="span" color="primary" fontSize={[18, 24, 24]}>
          8 300
        </Typography>
        ,{' '}
        <Typography component="span" color="primary" fontSize={[18, 24, 24]}>
          9 500
        </Typography>
        ,{' '}
        <FormattedMessage
          id="app.tutorial.slide.or"
          defaultMessage="or"
          description="Tut2 or"
        />{' '}
        <Typography component="span" color="primary" fontSize={[18, 24, 24]}>
          15 000{' '}
        </Typography>
        <FormattedMessage
          id="app.tutorial.slide.elekg"
          defaultMessage="kg"
          description="Tut2 kg"
        />
        .
      </Typography>
      <Box mt="auto" display="flex" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Box>
    </Container>
  );
};

export { Slide2 };
