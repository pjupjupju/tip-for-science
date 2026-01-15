import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SlideProps } from './types';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { FormattedMessage } from 'react-intl';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';
import washington from './../../assets/washingtonTutF.jpg';
import elephant from './../../assets/elephantTutF.jpg';
import jupiter from './../../assets/jupiterTutF.jpg';

const imageStyles = {
  width: ['calc(15vh)', 'calc(20vh)'],
  height: ['calc(15vh)', 'calc(20vh)'],
  borderRadius: '50%',
  flexShrink: 0,
};

const Slide1 = ({ handleNextStep }: SlideProps) => {
  return (
    <Container>
      <TutorialHeader centerVertically={false}>
        <Typography
          fontSize={{
            xs: 16,
            sm: 20,
            md: 24,
          }}
          color="text.secondary"
          textAlign="center"
          fontWeight="bold"
          mb={2}
          p={2}
        >
          <FormattedMessage
            id="app.tutorial.slide.curious"
            defaultMessage="Are you curious..."
            description="Tut1 curious"
          />
        </Typography>
      </TutorialHeader>

      <Box display="flex" flexDirection="column" pt={3} pb={4}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box component="img" src={elephant} alt="elephant" sx={imageStyles} />
          <Typography
fontSize={{
  xs: 16,
  sm: 20,
  md: 24,
}}            color="text.secondary"
            textAlign="center"
            mb={2}
            p={2}
          >
            <FormattedMessage
              id="app.tutorial.slide.eleph"
              defaultMessage="...to find out the weight of the heaviest elephant ever recorded in the annals of history?"
              description="Tut1 elephant"
            />
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography
            fontSize={{
              xs: 16,
              sm: 20,
              md: 24,
            }}
            color="text.secondary"
            textAlign="center"
            mb={4}
            p={4}
          >
            <FormattedMessage
              id="app.tutorial.slide.wash"
              defaultMessage="...about the monumental size of George Washington's head at Mount Rushmore?"
              description="Tut1 washington"
            />
          </Typography>
          <Box
            component="img"
            src={washington}
            alt="washington"
            sx={imageStyles}
          />
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center">
          <Box component="img" src={jupiter} alt="jupiter" sx={imageStyles} />
          <Typography
            fontSize={{
              xs: 16,
              sm: 20,
              md: 24,
            }}
            color="text.secondary"
            textAlign="center"
            mb={2}
            p={2}
          >
            <FormattedMessage
              id="app.tutorial.slide.jupiter1"
              defaultMessage="...how swiftly does Jupiter race across the space?"
              description="Tut1 jupiter"
            />
          </Typography>
        </Box>
      </Box>
      <Box mt="auto" display="flex" justifyContent="space-between" width="100%">
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Box>
    </Container>
  );
};

export { Slide1 };
