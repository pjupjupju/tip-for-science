import React, { useEffect, useRef, useReducer } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Game } from './../../components';
// import washington from './../../assets/game_washington.jpg';
import { MY_SCORE_QUERY, QUESTION_QUERY, SAVE_MUTATION } from '../../gql';
import { useHistory } from 'react-router';

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

  const { loading, data, refetch } = useQuery(QUESTION_QUERY);
  const { loading: scoreLoading, data: getMyScoreData } = useQuery(
    MY_SCORE_QUERY
  );

  const [saveTip] = useMutation(SAVE_MUTATION, {
    onCompleted: ({ saveTip: { __typename, ...data } }) => {
      refetch();
      console.log(data);
    },
    refetchQueries: ['MyScoreQuery'],
  });

  useEffect(() => {
    if (data && data.getNextQuestion.timeLimit && !isSubmitted) {
      timeoutRef.current = setTimeout(() => {
        if (!isSubmitted) {
          dispatch({ type: ActionType.GAME_SUBMIT });
        }
      }, data.getNextQuestion.timeLimit * 1000);
    }
  }, [data, isSubmitted]);

  if (loading || scoreLoading) {
    return <div>loading</div>;
  }

  console.log(data);

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
        dispatch({
          type: ActionType.GAME_FINISH,
        });
      }}
    />
  );
};

export { Play };
