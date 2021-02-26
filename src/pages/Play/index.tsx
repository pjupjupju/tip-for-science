import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Game } from './../../components';
import washington from './../../assets/game_washington.jpg';
import { QUESTION_QUERY, SAVE_MUTATION } from '../../gql';

const Play = () => {
  const { loading, data } = useQuery(QUESTION_QUERY);
  const [saveTip] = useMutation(SAVE_MUTATION);

  if (loading) {
    return (<div>loading</div>);
  }

  console.log(data);

  return (<Game
    settings={{
      question: 'Jak velkou má tadydlencten pán hlavu?',
      image: washington,
      previousTips: [10, 32],
      correctAnswer: 18.29,
      timeLimit: 10,
      unit: 'm',
    }}
    onSubmit={(value: string) => {
      console.log('cum sum!');
      saveTip({ variables: { id: 'lfjsdkfhdkj', tip: Number(value) }});
    }}
    onFinish={() => {
      console.log('odišiel som');
    }}
  />);
};

export { Play };
