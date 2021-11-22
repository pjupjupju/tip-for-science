import React from 'react';
import { Box, Button, ButtonProps } from 'rebass';
import { animated, useSpring } from 'react-spring';

const Circle = ({ value }: { value: number }) => (
  <Box
    sx={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: `conic-gradient(#000 0 ${value}%, transparent 0 100%)`,
    }}
  />
);

const AnimatedCircle =  animated(Circle);

const AnimatedButton = ({ timeLimit, ...rest }: { timeLimit: number }) => {
  const { value } = useSpring({
    from: { value: 1 },
    to: { value: 100 },
    config: { duration: timeLimit * 1000 },
  });

  return (
    <Button {...rest}>
      <AnimatedCircle
        value={value}
      />
    </Button>
  );
};

const SubmitButton = ({ timeLimit, ...rest }: ButtonProps & { timeLimit?: number }) =>
  typeof timeLimit !== 'undefined' ? (
    <AnimatedButton {...rest} timeLimit={timeLimit} />
  ) : (
    <Button {...rest}>Odeslat</Button>
  );

export { SubmitButton };
