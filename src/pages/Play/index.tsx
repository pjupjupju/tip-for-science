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
};

enum ActionType {
  GAME_INIT = 'GAME_INIT',
  GAME_SUBMIT = 'GAME_SUBMIT',
  GAME_FINISH = 'GAME_FINISH',
}
interface GameAction {
  type: ActionType;
}

const gameReducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    case 'GAME_INIT':
      return state;
    case 'GAME_SUBMIT':
      return state;
    case 'GAME_FINISH':
      return state;
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
  const [gameState, dispatch] = useReducer(gameReducer, initState);
  console.log(gameState);
  const history = useHistory();
  const onHome = () => history.push('/');
  const [submitted, setSubmitted] = useState(false);
  // const [tip, setTip] = useState<number | null>(null);
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      console.log('cum sum!');
      saveTip({
        variables: {
          id: 'lfjsdkfhdkj',
          tip: Number(event.currentTarget.value),
        },
      });
      // setTip(Number(event.currentTarget.value));
      setSubmitted(true);
      dispatch({ type: ActionType.GAME_SUBMIT });
    }
  };
  const timeoutRef = useRef<number>();

  const [questions, setQuestions] = useState([initState.question]);
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
    if (questions[questions.length - 1].timeLimit && !submitted) {
      console.log('started timeout');
      timeoutRef.current = setTimeout(() => {
        console.log('ended timeout');
        if (!submitted) {
          setSubmitted(true);
        }
      }, questions[questions.length - 1].timeLimit * 1000);
    }
  }, [questions, submitted]);

  if (loading) {
    return <div>loading</div>;
  }

  console.log(data);

  return (
    <Game
      settings={questions[questions.length - 1]}
      isSubmitted={submitted}
      onHome={onHome}
      onSubmit={handleSubmit}
      onFinish={() => {
        if (nextQuestion != null) {
          setQuestions([...questions, nextQuestion]);
        }
      }}
    />
  );
};

export { Play };
