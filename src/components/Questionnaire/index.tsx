import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
} from '@mui/material';

const questionnaire = [
  { id: 12, item: 'Myslím si že flopec není úplný dingus.' },
  { id: 15, item: 'Někdy chci pejsku prodat na maso.' },
  { id: 34, item: 'Na každém šprochu pravdy trochu.' },
  { id: 35, item: 'Přidávám sem otázky jen aby se muselo scrollovat.' },
  { id: 39, item: 'Karamel je cukr co se už neuzdraví.' },
  { id: 45, item: 'Blíží se rok apo... kalypsy 🤸🏽' },
];

const SCALE = [1, 2, 3, 4, 5] as const;

const Questionnaire = () => {
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [showValidation, setShowValidation] = React.useState(false);

  const answeredCount = questionnaire.filter(
    (q) => answers[q.id] != null
  ).length;
  const isComplete = answeredCount === questionnaire.length;

  const setAnswer = (id: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setShowValidation(false);
  };

  const handleNext = () => {
    if (!isComplete) {
      setShowValidation(true);
      return;
    }
    console.log('Answers:', answers);
  };

  return (
    <Box>
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }} color="#FFFFFF">
          Dotazník
        </Typography>

        <Typography variant="body2" color="#FFFFFF" sx={{ mb: 1 }}>
          Vyber pro každé tvrzení, do jaké míry s ním souhlasíš či nesouhlasíš.
        </Typography>

        {showValidation && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Vyplň prosím všechny otázky, než budeš pokračovat.
          </Alert>
        )}
      </Box>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={2}>
          {questionnaire.map((q, idx) => {
            const value = answers[q.id] ?? '';

            return (
              <Box key={q.id}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {idx + 1}. {q.item}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Úplně nesouhlasím
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Úplně souhlasím
                  </Typography>
                </Box>
                <RadioGroup
                  row
                  value={value}
                  onChange={(e) => setAnswer(q.id, Number(e.target.value))}
                  sx={{
                    display: 'flex',
                    width: '100%',
                    flexWrap: 'nowrap',
                    m: 0,
                    '& .MuiFormControlLabel-root': {
                      flex: 1,
                      m: 0,
                      borderRadius: 1,
                      py: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      minWidth: 0,
                      '&:hover': { backgroundColor: 'action.hover' },
                    },
                    '& .MuiFormControlLabel-labelPlacementBottom': {
                      flexDirection: 'column',
                    },
                    '& .MuiFormControlLabel-label': {
                      fontSize: 12,
                      lineHeight: 1.1,
                      whiteSpace: 'nowrap',
                    },
                  }}
                >
                  {SCALE.map((v) => (
                    <FormControlLabel
                      key={v}
                      value={v}
                      control={<Radio />}
                      label={String(v)}
                      labelPlacement="bottom"
                    />
                  ))}
                </RadioGroup>

                {idx < questionnaire.length - 1 ? (
                  <Divider sx={{ mt: 2 }} />
                ) : null}
              </Box>
            );
          })}
        </Stack>
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleNext}>
          Další
        </Button>
      </Box>
    </Box>
  );
};

export { Questionnaire };
