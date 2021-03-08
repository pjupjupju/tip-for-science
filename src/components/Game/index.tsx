import React, { useState, KeyboardEvent, useEffect } from 'react';
import { Box, Button, Flex, Image, Text } from 'rebass';
import { ResponsiveLine } from '@nivo/line';
import { Label, Input } from '@rebass/forms';
import { mockData } from './data';
import { Link, useHistory } from 'react-router-dom';

interface Settings {
  question: string;
  image: string;
  previousTips?: number[];
  correctAnswer: number;
  timeLimit?: number;
  unit: string;
}

interface GameProps {
  onFinish?: Function;
  onSubmit?: Function;
  settings: Settings;
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

const previousTipStyle = {
  background: '#FF0070',
  mr: 1,
  p: 1,
};

const Game = ({
  settings: { question, image, previousTips, unit, timeLimit },
  onSubmit,
  onFinish,
}: GameProps) => {

  const history = useHistory();

  const [submitted, setSubmitted] = useState(false);
  const [tip, setTip] = useState<number | null>(null);
  useEffect(() => {
    if (timeLimit && !submitted) {
      console.log('started timeout');
      setTimeout(() => {
        console.log('ended timeout');
        if (!submitted) {
          setSubmitted(true);
        }
      }, timeLimit * 1000);
    }
  }, [timeLimit, submitted]);
  useEffect(() => {
    return () => {
      if (onFinish) {
        onFinish();
      }
    };
  }, [onFinish]);
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (onSubmit) {
        onSubmit(event.currentTarget.value);
      }
      setTip(Number(event.currentTarget.value));
      setSubmitted(true);
    }
  };
  return !submitted ? (
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
      {previousTips != null && previousTips.length !== 0 && (
        <>
          <Text textAlign="center" color="#FF0070" my={1}>
            Předchozí tipy:{' '}
          </Text>
          <Flex justifyContent="center">
            {previousTips.map((previousTip) => (
              <Text sx={previousTipStyle} key={`previous-tip-${previousTip}`}>
                {previousTip}
              </Text>
            ))}
          </Flex>
        </>
      )}
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
          onKeyDown={handleSubmit}
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
          Total score:
        </Text>
      </Box>
      <Image src={image} sx={imageStyle} />
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
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
                value: Number(tip),
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
        <Text color="white">Tady bude graf a pod tím nějaký fun fact.</Text>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          🏚 domů
        </Link>
      </Flex>
      <Flex justifyContent="space-between" mt="auto">
        <Button as={Link} onClick={()=>history.push("/")}>flop</Button>
        <Button>flopšť</Button>
      </Flex>
    </Flex>
  );
};

export { Game };
