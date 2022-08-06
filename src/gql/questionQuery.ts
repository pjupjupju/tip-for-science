import { gql } from '@apollo/client';

export const QUESTION_QUERY = gql`
  query NextQuestionQuery {
    getNextQuestion {
      id
      rId
      gId
      fact
      question
      image
      previousTips
      correctAnswer
      timeLimit
      unit
    }
  }
`;
