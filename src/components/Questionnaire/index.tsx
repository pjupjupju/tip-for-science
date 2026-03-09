import React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMutation } from '@apollo/client';
import {
  AuthQueryName,
  QuestionnaireQueryName,
  SAVE_QUESTIONNAIRE_BATCH_MUTATION,
  SAVE_QUESTIONNAIRE_MUTATION,
} from '../../gql';
import { QUESTIONNAIRE_BUNDLE_SIZE } from '../../config';
import {
  footerStyles,
  headerStyles,
  mediumBMargin,
  mediumBPadding,
  mediumTMargin,
  paperStyles,
  progressBarStyles,
  radioGroupStyles,
} from './styles';
import { QuestionnaireDone } from './QuestionnaireDone';
import { NoMoreQuestions } from './NoMoreQuestions';
import { FormattedMessage } from 'react-intl';

type QuestionnaireItem = {
  id: number;
  item: string;
  value?: number;
};

interface QuestionnaireProps {
  completeBundle: number[];
  onFinish: () => void;
  questionnaire: QuestionnaireItem[];
}

const SCALE = [1, 2, 3, 4, 5] as const;

const getPageNumber = (
  completeBundle: number[],
  batch: QuestionnaireItem[]
) => {
  if (batch.length === 0) {
    return 0;
  }

  const lastOrdinal = completeBundle.indexOf(batch[batch.length - 1].id) + 1;
  return lastOrdinal / QUESTIONNAIRE_BUNDLE_SIZE;
};

const Questionnaire = ({
  completeBundle,
  onFinish,
  questionnaire,
}: QuestionnaireProps) => {
  const [answers, setAnswers] = React.useState<Record<number, number>>(
    questionnaire.reduce(
      (acc, q) => (q.value ? { ...acc, [q.id]: q.value } : acc),
      {}
    )
  );
  const [showValidation, setShowValidation] = React.useState(false);
  const [allIpipDone, setAllIpipDone] = React.useState(false);

  const answeredCount = questionnaire.filter(
    (q) => answers[q.id] != null
  ).length;
  const isComplete = answeredCount === questionnaire.length;
  const pageNum = getPageNumber(completeBundle, questionnaire);
  const pages = completeBundle.length / QUESTIONNAIRE_BUNDLE_SIZE;
  const percentDone = allIpipDone
    ? 100
    : Math.round(((pageNum - 1) / pages) * 100);

  const [saveQuestionnaireAnswer, { loading: isSaveAnswerLoading }] =
    useMutation(SAVE_QUESTIONNAIRE_MUTATION);
  const [saveQuestionnaireBatch, { loading: isSubmitLoading }] = useMutation(
    SAVE_QUESTIONNAIRE_BATCH_MUTATION
  );

  const setAnswer = async (id: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setShowValidation(false);
    await saveQuestionnaireAnswer({
      variables: {
        questionId: id,
        value,
      },
    });
  };

  const handleNext = async () => {
    if (!isComplete) {
      setShowValidation(true);
      return;
    }

    await saveQuestionnaireBatch({
      variables: {
        items: questionnaire.map((q) => ({
          questionId: q.id,
          value: answers[q.id],
        })),
      },
      refetchQueries:
        pageNum !== pages ? [QuestionnaireQueryName] : [AuthQueryName],
    });

    if (pageNum === pages) {
      setAllIpipDone(true);
    }
  };

  if (allIpipDone) {
    return (
      <QuestionnaireDone onFinish={onFinish} pageNum={pageNum} pages={pages} />
    );
  }

  if (questionnaire.length === 0 && pageNum === 0) {
    return <NoMoreQuestions onFinish={onFinish} />;
  }

  return (
    <Box sx={mediumBPadding}>
      <Box sx={headerStyles}>
        <Typography variant="h6" mb={1} color="#FFFFFF">
          Dotazník
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={2}
          my={2}
        >
          <Stack direction="column" gap={2} mb={1}>
            {pageNum === 1 ? (
              <>
                <Typography component="p" variant="body2" color="#FFFFFF">
                  <FormattedMessage
                    id="app.questionnaire.header.pause"
                    defaultMessage="Nyní přichází krátká pauza. Ale neboj, po vyplnění tohoto
                  krátkého osobnostního dotazníku na Tebe čeká ještě několik
                  otázek k tipování."
                    description="Short pause"
                  />
                </Typography>
                <Typography component="p" variant="body2" color="#FFFFFF">
                  <FormattedMessage
                    id="app.questionnaire.header.explanation"
                    defaultMessage="Níže jsou uvedena tvrzení, která popisují různé způsoby
                  myšlení, prožívání a chování. U každého tvrzení označ, do jaké
                  míry pro Tebe obecně platí. Nejde o to, jak se cítíš právě
                  teď, ale jaký*á obvykle jsi."
                    description="Explanation"
                  />
                </Typography>
              </>
            ) : (
              <Typography component="p" variant="body2" color="#FFFFFF">
                <FormattedMessage
                  id="app.questionnaire.header.instruction"
                  defaultMessage="Označ, do jaké míry pro vás jednotlivá tvrzení obecně platí."
                  description="Instruction"
                />
              </Typography>
            )}
          </Stack>
          <Typography variant="body2" color="#FFFFFF" mb={1} flexShrink={0}>
            <FormattedMessage
              id="app.questionnaire.page"
              defaultMessage="Page"
              description="Instruction"
            />
            <b>{pageNum}</b> / <b>{pages}</b>
          </Typography>
        </Stack>

        {showValidation && (
          <Alert severity="warning" sx={mediumBMargin}>
            <FormattedMessage
              id="app.questionnaire.warning"
              defaultMessage="Vyplň prosím všechny odpovědi, než budeš pokračovat."
              description="Instruction"
            />
          </Alert>
        )}

        <LinearProgress
          variant="determinate"
          value={percentDone}
          sx={progressBarStyles}
        />
      </Box>
      <Paper variant="outlined" sx={paperStyles}>
        <Stack spacing={2}>
          {questionnaire.map((q, idx) => {
            const value = answers[q.id] ?? '';

            return (
              <Box key={q.id}>
                <Typography variant="body2" mb={1}>
                  {idx + 1 + (pageNum - 1) * 10}. {q.item}
                </Typography>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" color="secondary">
                    <FormattedMessage
                      id="app.questionnaire.completelyinnacurate"
                      defaultMessage="Completely Inaccurate"
                      description="Completely Innacurate"
                    />
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    <FormattedMessage
                      id="app.questionnaire.completelyacurate"
                      defaultMessage="Completely Accurate"
                      description="Completely Acurate"
                    />{' '}
                  </Typography>
                </Stack>
                <RadioGroup
                  row
                  value={value}
                  onChange={(e) => setAnswer(q.id, Number(e.target.value))}
                  sx={radioGroupStyles}
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
                  <Divider sx={mediumTMargin} />
                ) : null}
              </Box>
            );
          })}
        </Stack>
      </Paper>

      <Box sx={footerStyles}>
        <Button
          variant="contained"
          disabled={!isComplete || isSaveAnswerLoading || isSubmitLoading}
          onClick={handleNext}
        >
          <FormattedMessage
            id="app.questionnaire.send"
            defaultMessage="Send"
            description="Send"
          />
        </Button>
      </Box>
    </Box>
  );
};

export { Questionnaire };
