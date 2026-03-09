import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { headerStyles, mediumBPadding, progressBarStyles } from './styles';

const mainStackStyles = {
  ...mediumBPadding,
  px: { xs: 2, sm: 3 },
  height: '100%',
  boxSizing: 'border-box',
};

const staticHeaderStyles = {
  ...headerStyles,
  position: 'relative',
};

const contentStackStyles = { p: { xs: 2, sm: 3 } };

const buttonStyles = { flex: 3 };

const QuestionnaireDone = ({ onFinish, pageNum, pages }) => {
  const navigate = useNavigate();
  const handleClickPlay = () => {
    onFinish();
  };
  const handleClickHome = () => {
    navigate('/');
  };

  return (
    <Stack sx={mainStackStyles}>
      <Box sx={staticHeaderStyles} flexShrink={0} flexGrow={0}>
        <Typography variant="h6" mb={1} color="#FFFFFF">
          <FormattedMessage
            id="app.questionnaire.questionnaire"
            defaultMessage="Questionnaire"
            description="Questionnaire"
          />
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="top">
          <Typography variant="body2" color="#FFFFFF" mb={1}>
            <FormattedMessage
              id="app.questionnaire.finished"
              defaultMessage="Hotovo, víc toho tady není 🎉!"
              description="Finished"
            />{' '}
          </Typography>
          <Typography variant="body2" color="#FFFFFF" mb={1} minWidth="90px">
            <FormattedMessage
              id="app.questionnaire.page"
              defaultMessage="Page"
              description="Page"
            />{' '}
            <b>{pageNum}</b> / <b>{pages}</b>
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={100}
          sx={progressBarStyles}
        />
      </Box>
      <Stack
        alignItems="center"
        justifyContent="center"
        flex={1}
        flexGrow={1}
        flexShrink={1}
        sx={contentStackStyles}
      >
        <Stack alignItems="center" justifyContent="center" mt="-30vh">
          <Typography variant="h4" color="#FFFFFF" mb={2}>
            <FormattedMessage
              id="app.questionnaire.thankyou"
              defaultMessage="Thank you!"
              description="Thank you message"
            />
          </Typography>
          <Typography variant="body2" color="#FFFFFF" mb={1}>
            <FormattedMessage
              id="app.questionnaire.completed"
              defaultMessage="Všechny otázky dotazníku jsi vyplnil*a a teď můžeš dále pokračovat
            ve hře, nebo na hlavní obrazovku."
              description="Everything completed message"
            />
          </Typography>
          <Stack
            width="100%"
            gap={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              onClick={handleClickHome}
              variant="contained"
              color="secondary"
              sx={buttonStyles}
            >
              <FormattedMessage
                id="app.questionnaire.button.home"
                defaultMessage="Home"
                description="Questionnaire go to main page button"
              />
            </Button>
            <Button
              onClick={handleClickPlay}
              variant="contained"
              color="primary"
              sx={buttonStyles}
            >
              <FormattedMessage
                id="app.questionnaire.button.play"
                defaultMessage="Play"
                description="Questionnaire play next question button"
              />
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export { QuestionnaireDone };
