import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import Button, { ButtonProps } from '@mui/material/Button';
import Box from '@mui/material/Box';
import { FormattedMessage } from 'react-intl';

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

const AnimatedCircle = animated(Circle);

const AnimatedButton = ({ timeLimit, ...rest }: { timeLimit: number }) => {
  const { value } = useSpring({
    from: { value: 1 },
    to: { value: 100 },
    config: { duration: timeLimit * 1000 },
  });

  return (
    <Button {...rest}>
      <AnimatedCircle value={value} />
    </Button>
  );
};

const SubmitButton = ({
  timeLimit,
  ...rest
}: ButtonProps & { timeLimit?: number }) =>
  typeof timeLimit !== 'undefined' ? (
    <AnimatedButton variant="contained" {...rest} timeLimit={timeLimit} />
  ) : (
    <Button variant="contained" {...rest}>
      <FormattedMessage
        id="app.submitbutton"
        defaultMessage="Submit"
        description="Submitbutton"
      />
    </Button>
  );

export { SubmitButton };
