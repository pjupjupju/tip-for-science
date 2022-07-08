import React from 'react';
import { Button, ButtonProps } from 'rebass';

const buttonStyles = {
  backgroundColor: '#414141',
  color: '#D6D6D6',
  fontWeight: 400,
  ':hover': {
    backgroundColor: 'white',
    color: '#414141',
  },
  fontSize: 4,
};

const primaryButtonStyles = {
  fontWeight: 400,
  color: 'white',
  ':hover': {
    backgroundColor: 'white',
    color: 'primary',
  },
  fontSize: 4,
};

const MenuButton = ({
  primary,
  ...restProps
}: Omit<ButtonProps, 'sx'> & { primary?: boolean }) => (
  <Button
    sx={primary ? primaryButtonStyles : buttonStyles}
    {...(restProps as any)}
  />
);

export { MenuButton };
