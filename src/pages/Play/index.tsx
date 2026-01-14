import React, { useEffect, useRef, useReducer, useCallback } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import Helmet from 'react-helmet';
import {
  useQuery,
  useMutation,
  NetworkStatus,
  useLazyQuery,
} from '@apollo/client';

import { Ipip } from '../Ipip';
import { Game, LoadingContainer, NoMoreQuestions } from './../../components';
import { MY_SCORE_QUERY, QUESTION_QUERY, SAVE_MUTATION } from '../../gql';
import { User } from '../../types';

interface PlayProps {
  user: User | null;
}

type GameState = {
  isSubmitted: boolean;
  knewItDialog: boolean;
  isQuestionnaire?: boolean;
  currentTip?: number;
};

enum ActionType {
  GAME_INIT = 'GAME_INIT',
  GAME_KNEW_IT_DIALOG = 'GAME_KNEW_IT_DIALOG',
  GAME_SUBMIT = 'GAME_SUBMIT',
  GAME_FINISH = 'GAME_FINISH',
  GAME_QUESTIONNAIRE_INIT = 'GAME_QUESTIONNAIRE_INIT',
}
interface GameAction {
  type: ActionType;
  payload?: any;
}

const gameReducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    case 'GAME_INIT':
      return { ...state, isSubmitted: false, currentTip: undefined };
    case 'GAME_KNEW_IT_DIALOG':
      return { ...state, knewItDialog: true };
    case 'GAME_SUBMIT':
      return {
        ...state,
        isSubmitted: true,
        currentTip: action.payload?.tip,
        knewItDialog: false,
      };
    case 'GAME_FINISH':
      return {
        ...state,
        isSubmitted: false,
        currentTip: undefined,
        isQuestionnaire: false,
      };
    case 'GAME_QUESTIONNAIRE_INIT':
      return {
        ...state,
        isSubmitted: false,
        currentTip: undefined,
        isQuestionnaire: true,
      };
    default:
      return state;
  }
};

const initState = {
  isSubmitted: false,
  knewItDialog: false,
  isQuestionnaire: false,
};

const getInitState = (user: User) => ({
  ...initState,
  isQuestionnaire: !!user.isQuestionnaireActive,
});

const runChecks = (user: User, questionId: string) => {
  let isQuestionnaireNext = false;

  if (questionId === user.nextQuestionnaireAfterQuestion) {
    isQuestionnaireNext = true;
  }

  return { isQuestionnaireNext };
};

const Play = ({ user }: PlayProps) => {
  const [{ currentTip, knewItDialog, isSubmitted, isQuestionnaire }, dispatch] =
    useReducer(gameReducer, getInitState(user));

  const navigate = useNavigate();
  const onHome = () => navigate('/');
  const onIsTooClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    elapsedTimeInMs.current = new Date().getTime() - gameStart.current;

    dispatch({ type: ActionType.GAME_KNEW_IT_DIALOG });
  };
  const onSubmit = (
    myTip: number,
    knewAnswer: boolean = false,
    answered: boolean = true
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const msElapsed =
      elapsedTimeInMs.current || new Date().getTime() - gameStart.current;
    elapsedTimeInMs.current = null;
    saveTip({
      variables: {
        id: questionId,
        tip: myTip,
        rId: data.getNextQuestion.rId,
        gId: data.getNextQuestion.gId,
        previousTips: data.getNextQuestion.previousTips,
        knewAnswer,
        answered,
        msElapsed: answered ? msElapsed : timeLimit * 1000,
      },
    });
    dispatch({ type: ActionType.GAME_SUBMIT, payload: { tip: myTip } });
  };
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const gameStart = useRef<number>(new Date().getTime());
  // a reference to time elapsed if we open a TooCloseDialog
  const elapsedTimeInMs = useRef<number | null>(null);

  const [loadQuestion, { loading, data, networkStatus, refetch }] =
    useLazyQuery(QUESTION_QUERY, {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: () => {
        gameStart.current = new Date().getTime();
      },
    });

  // initial question load if the questionnaire is not active
  useEffect(() => {
    if (!user?.isQuestionnaireActive) {
      loadQuestion();
    }
  }, []);

  const { id: questionId, timeLimit } =
    data != null
      ? data.getNextQuestion || { id: null, timeLimit: null }
      : { id: null, timeLimit: null };

  const { loading: scoreLoading, data: getMyScoreData } =
    useQuery(MY_SCORE_QUERY);

  const [saveTip] = useMutation(SAVE_MUTATION, {
    onCompleted: ({ saveTip: { __typename, ...data } }) => {
      // console.log('savetip-complete', data);
    },
    refetchQueries: ['MyScoreQuery'],
  });

  useEffect(() => {
    if (
      !loading &&
      networkStatus !== NetworkStatus.refetch &&
      questionId &&
      timeLimit &&
      !isSubmitted
    ) {
      timeoutRef.current = setTimeout(() => {
        if (!isSubmitted) {
          // forced saveTip to save also unanswered questions with answer: 0, answered: false
          onSubmit(0, false, false);
          dispatch({ type: ActionType.GAME_SUBMIT });
        }
      }, timeLimit * 1000);
    }
  }, [questionId]);

  const onFinish = useCallback(() => {
    const { isQuestionnaireNext } = runChecks(user, questionId);
    if (isQuestionnaireNext) {
      dispatch({
        type: ActionType.GAME_QUESTIONNAIRE_INIT,
      });
    } else {
      refetch();
      dispatch({
        type: ActionType.GAME_FINISH,
      });
    }
  }, [redirect, refetch, dispatch, questionId, user]);

  const onQuestionnaireFinish = useCallback(() => {
    loadQuestion();
    dispatch({
      type: ActionType.GAME_FINISH,
    });
  }, [loadQuestion, dispatch]);

  if (!user) {
    redirect('/');
  }

  if (loading || scoreLoading || networkStatus === NetworkStatus.refetch) {
    return <LoadingContainer />;
  }

  if (!isQuestionnaire && data?.getNextQuestion == null) {
    return <NoMoreQuestions score={getMyScoreData.getMyScore || 0} />;
  }

  return (
    <>
      <Helmet defaultTitle="TipForScience.org"></Helmet>
      {isQuestionnaire ? (
        <Ipip user={user} onQuestionnaireFinish={onQuestionnaireFinish} />
      ) : (
        <Game
          currentTip={currentTip}
          settings={data.getNextQuestion}
          score={getMyScoreData.getMyScore || 0}
          isSubmitted={isSubmitted}
          isKnewItDialogOpen={knewItDialog}
          onIsTooClose={onIsTooClose}
          onHome={onHome}
          onSubmit={onSubmit}
          onFinish={onFinish}
        />
      )}
    </>
  );
};

export { Play };
