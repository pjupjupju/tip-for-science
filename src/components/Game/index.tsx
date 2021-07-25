import React, { KeyboardEvent } from 'react';
import { Box, Button, Flex, Image, Text } from 'rebass';
import { ResponsiveLine } from '@nivo/line';
import { Label, Input } from '@rebass/forms';
import { mockData } from './mockData';
import { Link } from 'react-router-dom';
import { TooCloseDialog } from './TooCloseDialog';
import { GameOverScreen } from './GameOverScreen';
import { PreviousTips } from './PreviousTips';
import { getScore } from '../../helpers';

export interface Settings {
  question: string;
  image: string;
  previousTips?: number[];
  correctAnswer: number;
  timeLimit?: number;
  unit: string;
}

interface GameProps {
  isSubmitted: boolean;
  onFinish: Function;
  onHome: Function;
  onSubmit?: (event: KeyboardEvent<HTMLInputElement>) => void;
  settings: Settings;
  currentTip?: number;
  score: number;
}

const inputStyles = {
  '::placeholder': {
    color: 'white',
  },
  color: 'white',
  flex: 1,
  mx: 3,
};

const imageStyle = {
  height: '210px',
  width: '100%',
  alignSelf: 'center',
};

const labelStyle = {
  flexGrow: 0,
  flexShrink: 0,
  width: 'auto',
  color: 'white',
};

const isTooClose = (currentTip: number, correctAnswer: number): boolean =>
  currentTip >= correctAnswer * 0.95 && currentTip <= correctAnswer * 1.05;

const Game = ({
  settings: { question, image, previousTips, unit, timeLimit, correctAnswer },
  isSubmitted,
  onHome,
  onSubmit,
  onFinish,
  currentTip,
  score,
}: GameProps) => {
  const handleClickFinish = () => {
    onFinish();
  };
  const handleClickHome = () => {
    onHome();
  };

  return !isSubmitted ? (
    <Flex flexDirection="column" height="100%">
      <Box height="80px">
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={3}
        >
          {question}
        </Text>
      </Box>
      <Image src={image} sx={imageStyle} />
      <PreviousTips previousTips={previousTips} unit={unit} />
      <Flex justifyContent="center" alignItems="center" p={2}>
        <Label htmlFor="tip" sx={labelStyle}>
          tip:
        </Label>
        <Input
          id="tip"
          name="tip"
          type="number"
          placeholder="váš tip"
          sx={inputStyles}
          onKeyDown={onSubmit}
        />
        <Text color="white">{unit}</Text>
      </Flex>
    </Flex>
  ) : (
    <Flex flexDirection="column" height="100%">
      <Box height="80px">
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={3}
        >
          Score: {typeof currentTip != "undefined" ? getScore(currentTip, correctAnswer).toFixed(3) : 0}
        </Text>
      </Box>
      <Image src={image} sx={imageStyle} />
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        {typeof currentTip !== 'undefined' ? (
          <>
            <Box width="100%" height="200px">
              <ResponsiveLine
                enableArea={true}
                curve="natural"
                xScale={{
                  type: 'linear',
                  min: 0,
                  max: 50,
                }}
                yScale={{
                  type: 'linear',
                  min: 0,
                  max: 1,
                }}
                data={mockData}
                margin={{
                  top: 50,
                  right: 50,
                  bottom: 50,
                  left: 50,
                }}
                enableGridX={false}
                enableGridY={false}
                enablePoints={false}
                markers={[
                  {
                    axis: 'x',
                    value: Number(currentTip),
                    lineStyle: { stroke: 'white', strokeWidth: 1 },
                    legend: 'váš tip',
                    textStyle: { fill: 'white' },
                  },
                  {
                    axis: 'x',
                    value: 18.29,
                    lineStyle: { stroke: '#FF0070', strokeWidth: 1 },
                    legend: 'správná odpověď',
                    textStyle: { fill: '#FF0070' },
                  },
                ]}
              />
            </Box>
            {isTooClose(currentTip, correctAnswer) && (
              <TooCloseDialog
                onGuessed={() => {
                  console.log('som frajer a som tipnul');
                }}
                onKnewIt={() => {
                  console.log('som frajer a som vedel');
                }}
              />
            )}
          </>
        ) : (
          <GameOverScreen />
        )}
      </Flex>
      <Flex justifyContent="space-between" mt="auto">
        <Button as={Link} onClick={handleClickHome}>
          Domů
        </Button>
        <Button as={Link} onClick={handleClickFinish}>
          Pokračovat
        </Button>
      </Flex>
    </Flex>
  );
};

export { Game, GameOverScreen, TooCloseDialog, PreviousTips };
