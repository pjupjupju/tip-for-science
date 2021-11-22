import React, { useEffect, useRef, useReducer } from 'react';
import { useQuery, useMutation, NetworkStatus } from '@apollo/client';
import { Container, Game, NoMoreQuestions, Spinner } from './../../components';
import { MY_SCORE_QUERY, QUESTION_QUERY, SAVE_MUTATION } from '../../gql';
import { useHistory } from 'react-router';
import { Flex } from 'rebass';

type GameState = {
  isSubmitted: boolean;
  currentTip?: number;
};

enum ActionType {
  GAME_INIT = 'GAME_INIT',
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
    case 'GAME_SUBMIT':
      return { ...state, isSubmitted: true, currentTip: action.payload?.tip };
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
};

const Play = () => {
  console.log('RENDERING');
  const [{ currentTip, isSubmitted }, dispatch] = useReducer(
    gameReducer,
    initState
  );

  const history = useHistory();
  const onHome = () => history.push('/');
  const onSubmit = (myTip: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveTip({
      variables: {
        id: 'lfjsdkfhdkj',
        tip: myTip,
      },
    });
    dispatch({ type: ActionType.GAME_SUBMIT, payload: { tip: myTip } });
  };
  const timeoutRef = useRef<number>();

  const { loading, data, networkStatus, refetch } = useQuery(QUESTION_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });
  const { id: questionId, timeLimit } =
    data != null
      ? data.getNextQuestion || { id: null, timeLimit: null }
      : { id: null, timeLimit: null };

  const { loading: scoreLoading, data: getMyScoreData } = useQuery(
    MY_SCORE_QUERY
  );

  const [saveTip] = useMutation(SAVE_MUTATION, {
    onCompleted: ({ saveTip: { __typename, ...data } }) => {
      console.log('savetip-complete', data);
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
          dispatch({ type: ActionType.GAME_SUBMIT });
        }
      }, timeLimit * 1000);
    }
  }, [questionId]);

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
    <Game
      currentTip={currentTip}
      settings={data.getNextQuestion}
      score={getMyScoreData.getMyScore || 0}
      isSubmitted={isSubmitted}
      onHome={onHome}
      onSubmit={onSubmit}
      onFinish={() => {
        // TODO: pokud neexistuje dalsi otazka?
        refetch();
        dispatch({
          type: ActionType.GAME_FINISH,
        });
      }}
    />
  );
};

export { Play };
