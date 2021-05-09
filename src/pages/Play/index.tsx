import React, {
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  useReducer,
} from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Game, Settings } from './../../components';
import washington from './../../assets/game_washington.jpg';
import { QUESTION_QUERY, SAVE_MUTATION } from '../../gql';
import { useHistory } from 'react-router';

type GameState = {
  question: Settings;
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
        question: action.payload.question,
        currentTip: undefined,
      };
    default:
      return state;
  }
};

const initState = {
  question: {
    question: 'Jak velkou má tadydlencten pán hlavu?',
    image: washington,
    previousTips: [10, 32],
    correctAnswer: 18.29,
    timeLimit: 10,
    unit: 'm',
  },
  isSubmitted: false,
};

const Play = () => {
  const [{ currentTip, question, isSubmitted }, dispatch] = useReducer(
    gameReducer,
    initState
  );

  const history = useHistory();
  const onHome = () => history.push('/');
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const myTip = Number(event.currentTarget.value);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      saveTip({
        variables: {
          id: 'lfjsdkfhdkj',
          tip: myTip,
        },
      });
      // setTip(Number(event.currentTarget.value));
      dispatch({ type: ActionType.GAME_SUBMIT, payload: { tip: myTip } });
    }
  };
  const timeoutRef = useRef<number>();

  const [nextQuestion, setNextQuestion] = useState<{
    question: string;
    image: string;
    previousTips: number[];
    correctAnswer: number;
    timeLimit: number;
    unit: string;
  }>();
  const { loading, data } = useQuery(QUESTION_QUERY);
  const [saveTip] = useMutation(SAVE_MUTATION, {
    onCompleted: ({ saveTip: { __typename, ...data } }) => {
      setNextQuestion(data);
      console.log(data);
    },
  });

  useEffect(() => {
    if (question.timeLimit && !isSubmitted) {
      timeoutRef.current = setTimeout(() => {
        if (!isSubmitted) {
          dispatch({ type: ActionType.GAME_SUBMIT });
        }
      }, question.timeLimit * 1000);
    }
  }, [question, isSubmitted]);

  if (loading) {
    return <div>loading</div>;
  }

  console.log(data);

  return (
    <Game
      currentTip={currentTip}
      settings={question}
      isSubmitted={isSubmitted}
      onHome={onHome}
      onSubmit={handleSubmit}
      onFinish={() => {
        console.log('is next question null? ', nextQuestion != null);
        if (nextQuestion != null) {
          // setQuestions([...questions, nextQuestion]);
          console.log('click finish');
          dispatch({ type: ActionType.GAME_FINISH, payload: nextQuestion });
        }
        const dalsiOtazka = {
          question: 'Kolik kotatek dnes umrelo??',
          image: washington,
          previousTips: [10, 32],
          correctAnswer: 18.29,
          timeLimit: 5,
          unit: 'm',
        };
        dispatch({
          type: ActionType.GAME_FINISH,
          payload: { question: dalsiOtazka },
        });
      }}
    />
  );
};

export { Play };
