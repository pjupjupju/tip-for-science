import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Game } from './../../components';
import washington from './../../assets/game_washington.jpg';
import { QUESTION_QUERY, SAVE_MUTATION } from '../../gql';

const Play = () => {
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

  if (loading) {
    return <div>loading</div>;
  }

  console.log(data);

  return (
    <Game
      settings={questions[questions.length - 1]}
      onSubmit={(value: string) => {
        console.log('cum sum!');
        saveTip({ variables: { id: 'lfjsdkfhdkj', tip: Number(value) } });
      }}
      onFinish={() => {
        if (nextQuestion != null) {
          setQuestions([...questions, nextQuestion]);
        }
      }}
    />
  );
};

export { Play };
