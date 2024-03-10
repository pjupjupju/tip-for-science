import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Button } from 'rebass';

const HomeButton = () => {
  const history = useHistory();
  const handleClickHome = () => {
    history.push('/');
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
