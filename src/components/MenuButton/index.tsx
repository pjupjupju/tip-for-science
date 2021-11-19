import React from 'react';
import { Button, ButtonProps } from 'rebass';

const buttonStyles = {
  ':hover': {
    backgroundColor: 'white',
  },
  fontSize: 4,
};

const MenuButton = ({ ...restProps }: Omit<ButtonProps, 'sx'>) => (
  <Button sx={buttonStyles} {...(restProps as any)} />
);

export { MenuButton };
