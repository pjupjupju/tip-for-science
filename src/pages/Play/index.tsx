import React, { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Game } from './../../components';
import washington from './../../assets/game_washington.jpg';
import { QUESTION_QUERY, SAVE_MUTATION } from '../../gql';

const Play = () => {
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
    }
  };
  const timeoutRef = useRef<number>();

  const [questions, setQuestions] = useState([
    {
      question: 'Jak velkou má tadydlencten pán hlavu?',
      image: washington,
      previousTips: [10, 32],
      correctAnswer: 18.29,
      timeLimit: 10,
      unit: 'm',
    },
  ]);
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
