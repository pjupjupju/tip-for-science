import React, { useEffect, useRef, useReducer } from 'react';
import { Redirect } from 'react-router-dom';
import { useQuery, useMutation, NetworkStatus } from '@apollo/client';
import { useHistory } from 'react-router';
import { Flex } from 'rebass';
import { Container, Game, NoMoreQuestions, Spinner } from './../../components';
import { MY_SCORE_QUERY, QUESTION_QUERY, SAVE_MUTATION } from '../../gql';
import { User } from '../../types';
import Helmet from 'react-helmet';

interface PlayProps {
  user: User | null;
}

type GameState = {
  isSubmitted: boolean;
  knewItDialog: boolean;
  currentTip?: number;
};

enum ActionType {
  GAME_INIT = 'GAME_INIT',
  GAME_KNEW_IT_DIALOG = 'GAME_KNEW_IT_DIALOG',
  GAME_SUBMIT = 'GAME_SUBMIT',
  GAME_FINISH = 'GAME_FINISH',
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
      };
    default:
      return state;
  }
};

const initState = {
  isSubmitted: false,
  knewItDialog: false,
};

const Play = ({ user }: PlayProps) => {
  const [{ currentTip, knewItDialog, isSubmitted }, dispatch] = useReducer(
    gameReducer,
    initState
  );

  const history = useHistory();
  const onHome = () => history.push('/');
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

  const { loading, data, networkStatus, refetch } = useQuery(QUESTION_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: () => {
      gameStart.current = new Date().getTime();
    },
  });
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
          // TODO: implement forced saveTip here if we want to save also unanswered questions
          onSubmit(0, false, false);
          dispatch({ type: ActionType.GAME_SUBMIT });
        }
      }, timeLimit * 1000);
    }
  }, [questionId]);

  if (!user) {
    return <Redirect to="/" />;
  }

  if (loading || scoreLoading || networkStatus === NetworkStatus.refetch) {
    return (
      <Container>
        <Flex
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner />
        </Flex>
      </Container>
    );
  }

  if (data.getNextQuestion == null) {
    return <NoMoreQuestions score={getMyScoreData.getMyScore || 0} />;
  }

  return (
    <>
      <Helmet defaultTitle="TipForScience.org"></Helmet>
      <Game
        currentTip={currentTip}
        settings={data.getNextQuestion}
        score={getMyScoreData.getMyScore || 0}
        isSubmitted={isSubmitted}
        isKnewItDialogOpen={knewItDialog}
        onIsTooClose={onIsTooClose}
        onHome={onHome}
        onSubmit={onSubmit}
        onFinish={() => {
          refetch();
          dispatch({
            type: ActionType.GAME_FINISH,
          });
        }}
      />
    </>
  );
};

export { Play };
