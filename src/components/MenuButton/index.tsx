import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

const buttonStyles = {
  fontWeight: 400,
  fontSize: 25,
};

const MenuButton = ({
  primary,
  sx = {},
  ...restProps
}: ButtonProps & { primary?: boolean }) => (
  <Button
    sx={{...buttonStyles, ...sx}}
    color={primary ? 'primary' : 'secondary'}
    variant="contained"
    {...(restProps as any)}
  />
);

export { MenuButton };
