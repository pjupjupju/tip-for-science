import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NumberFormat from 'react-number-format';
import { Container } from '../Container';
import { ScoreChart } from '../ScoreChart';
import { TutorialHeader } from '../TutorialHeader';
import { getTutorialImageStyle } from '../commonStyleSheets';
import jupiter from './../../assets/jupiterTut.jpg';
import { SlideProps } from './types';
import { getScore } from '../../helpers';
import { FunFact } from './../Game/FunFact';
import { HomeButton } from './HomeButton';
import { NextButton } from './NextButton';
import { useIntl } from 'react-intl';
import ScoreMessage from '../ScoreMessage';
import { tutorialText } from './styles';

const imageStyle = getTutorialImageStyle(jupiter);

const Slide14 = ({ handleNextStep, currentTip }: SlideProps) => {
  const intl = useIntl();
  const fact = intl.formatMessage({
    id: 'app.tutorial.slide.ffjupiter',
    defaultMessage: `This gas giant rotates at a speed of {correct} km/h at the equator. 
    One day on Jupiter lasts just under 10 hours, and it completes an orbit around the Sun in approximately 12 Earth years.`,
    description: 'Tut14 ffjupiter',
  });
  const unit = intl.formatMessage({
    id: 'app.unitkmh',
    defaultMessage: `km/h`,
    description: 'unit km/h',
  });
  const correctAnswer = 45583;
  const previousTips = [80000, 1000, 500, 20000];
  const questionScore = getScore(
    typeof currentTip === 'undefined' ? 0 : currentTip,
    45583
  );
  return (
    <Container>
      <TutorialHeader>
        <Typography
          fontSize={{
            xs: 20,
            sm: 24,
            md: 32,
          }}
          color="accent.main"
          textAlign="center"
          sx={{ px: 2, py: 3 }}
        >
          {' '}
          <NumberFormat
            value={currentTip}
            displayType={'text'}
            thousandSeparator={' '}
          />{' '}
          {unit}?{' '}
          <Typography component="span" sx={tutorialText}>
            {' '}
            {questionScore === 0 && (
              <ScoreMessage question="Slide14" scoreType="score.zero" />
            )}
            {questionScore !== null &&
              questionScore > 0 &&
              questionScore < 40 && (
                <ScoreMessage question="Slide14" scoreType="score.low" />
              )}
            {questionScore !== null &&
              questionScore >= 40 &&
              questionScore < 80 && (
                <ScoreMessage question="Slide14" scoreType="score.high" />
              )}
            {questionScore !== null &&
              questionScore >= 80 &&
              questionScore < 95 && (
                <ScoreMessage question="Slide14" scoreType="score.top" />
              )}
          </Typography>
        </Typography>
      </TutorialHeader>
      <Box sx={imageStyle} />

      <Box width="100%" height="200px">
        {typeof currentTip !== 'undefined' && (
          <ScoreChart
            currentTip={currentTip}
            correctAnswer={correctAnswer}
            previousTips={previousTips}
          />
        )}
      </Box>

      <FunFact correctAnswer={correctAnswer} fact={fact} />
      <Stack
        direction="row"
        justifyContent="space-between"
        width="100%"
        mt="auto"
      >
        <HomeButton />
        <NextButton handleNextStep={handleNextStep} />
      </Stack>
    </Container>
  );
};

export { Slide14 };
