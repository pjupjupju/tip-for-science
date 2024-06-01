import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Button } from 'rebass';

const HomeButton = () => {
  const navigate = useNavigate();
  const handleClickHome = () => {
    navigate('/');
  };
  return (
    <Button
      onClick={handleClickHome}
      backgroundColor={'#414141'}
      sx={{ flex: 1 }}
      mr="1"
    >
      <FormattedMessage
        id="app.tutorial.menu.home"
        defaultMessage="Home"
        description="Tut home button"
      />
    </Button>
  );
};

export { HomeButton };
