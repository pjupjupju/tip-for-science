import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Stepper } from './';

const length = 8;
export default { title: 'component/Stepper', component: Stepper };
export const Default = () => {
  const [active, setActive] = useState(0);
  const handleClick = () => {
    setActive(active === length - 1 ? 0 : active + 1);
  };
  return (
    <>
      <Stepper length={length} step={active} />
      <Button onClick={handleClick} role="button" sx={{cursor:"pointer"}}>
        Next
      </Button>
    </>
  );
};

Default.storyName = 'Stepper';
