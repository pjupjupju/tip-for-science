import { FormattedMessage } from 'react-intl';
import { Button } from 'rebass';

const NextButton = ({ handleNextStep }) => {
  const handleClickNext = () => {
    handleNextStep();
  };
  return (
    <Button onClick={handleClickNext} sx={{ flex: 5 }}>
      <FormattedMessage
        id="app.tutorial.menu.next"
        defaultMessage="Next"
        description="Tut next button"
      />
    </Button>
  );
};

export { NextButton };
