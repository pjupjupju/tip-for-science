import { FormattedMessage } from 'react-intl';
import Button from '@mui/material/Button';

const buttonStyles = { flex: 5 };

const NextButton = ({ handleNextStep }) => {
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Button variant="contained" onClick={handleClickNext} sx={buttonStyles}>
      <FormattedMessage
        id="app.tutorial.menu.next"
        defaultMessage="Next"
        description="Tut next button"
      />
    </Button>
  );
};

export { NextButton };
