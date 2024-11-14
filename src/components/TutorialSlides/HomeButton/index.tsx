import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const buttonStyles = { flex: 1, marginRight: 1 };

const HomeButton = () => {
  const navigate = useNavigate();
  const handleClickHome = () => {
    navigate('/');
  };
  return (
    <Button
      variant="contained"
      onClick={handleClickHome}
      color="secondary"
      sx={buttonStyles}
    >
      <FormattedMessage
        id="app.home"
        defaultMessage="Home"
        description="Home button"
      />
    </Button>
  );
};

export { HomeButton };
